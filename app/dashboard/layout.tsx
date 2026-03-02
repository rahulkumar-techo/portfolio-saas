import { ReactNode } from "react";

export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <section className="min-h-screen">{children}</section>;
}
