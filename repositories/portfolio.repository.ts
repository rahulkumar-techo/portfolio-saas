/**
 * Portfolio Repository
 * Handles DB operations only
 */

import { Portfolio } from "@/models/portfolio/portfolio.model";

export class PortfolioRepository {

  async findByUserId(userId: string) {
    return Portfolio.findOne({ userId, isDeleted: false });
  }

  async findByUsername(username: string) {
    return Portfolio.findOne({ username, status: "published" });
  }

  async updateById(id: string, update: any) {
    return Portfolio.findByIdAndUpdate(id, update, { new: true });
  }

  async incrementVersion(id: string) {
    return Portfolio.findByIdAndUpdate(
      id,
      { $inc: { version: 1 } },
      { new: true }
    );
  }
}