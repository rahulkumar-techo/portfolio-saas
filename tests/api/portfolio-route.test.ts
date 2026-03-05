import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { GET as getPortfolio, PATCH as patchPortfolio } from "@/app/api/portfolio/route";

const mockedService = vi.hoisted(() => ({
  getPortfolioByUserId: vi.fn(),
  updatePortfolio: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db", () => ({
  connectDB: vi.fn(),
}));

vi.mock("@/services/portfolio.service", () => ({
  PortfolioService: class {
    getPortfolioByUserId = mockedService.getPortfolioByUserId;
    updatePortfolio = mockedService.updatePortfolio;
  },
}));

describe("Portfolio API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectDB).mockResolvedValue({} as any);
  });

  it("GET returns 401 when unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as any);
    const res = await getPortfolio();
    expect(res.status).toBe(401);
  });

  it("GET returns portfolio when authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "user_1" } } as any);
    mockedService.getPortfolioByUserId.mockResolvedValue({ _id: "p1" });

    const res = await getPortfolio();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(mockedService.getPortfolioByUserId).toHaveBeenCalledWith("user_1");
    expect(body.success).toBe(true);
    expect(body.data._id).toBe("p1");
  });

  it("PATCH returns 401 when unauthenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as any);
    const req = new Request("http://localhost/api/portfolio", {
      method: "PATCH",
      body: JSON.stringify({ status: "draft" }),
    });

    const res = await patchPortfolio(req as any);
    expect(res.status).toBe(401);
  });

  it("PATCH validates request body", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "user_1" } } as any);
    const req = new Request("http://localhost/api/portfolio", {
      method: "PATCH",
      body: JSON.stringify({ status: "invalid_status" }),
    });

    const res = await patchPortfolio(req as any);
    expect(res.status).toBe(400);
  });

  it("PATCH updates portfolio for authenticated user", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "user_1" } } as any);
    mockedService.updatePortfolio.mockResolvedValue({ _id: "p1", status: "published" });

    const req = new Request("http://localhost/api/portfolio", {
      method: "PATCH",
      body: JSON.stringify({ status: "published" }),
    });

    const res = await patchPortfolio(req as any);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(mockedService.updatePortfolio).toHaveBeenCalledWith("user_1", { status: "published" });
    expect(body._id).toBe("p1");
  });
});
