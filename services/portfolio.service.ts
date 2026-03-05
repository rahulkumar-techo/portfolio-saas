/**
 * Portfolio Service
 * Business logic layer
 */

import { PortfolioRepository } from "@/repositories/portfolio.repository";
import { PortfolioVersion } from "@/models/portfolio/portfolioVersio.model";

export class PortfolioService {

  private repo = new PortfolioRepository();

  async getPortfolioByUserId(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async updatePortfolio(userId: string, data: any) {
    const portfolio = await this.repo.findByUserId(userId);
    if (!portfolio) throw new Error("Portfolio not found");

    // Save previous version
    await PortfolioVersion.create({
      portfolioId: portfolio._id,
      content: portfolio.content,
      design: portfolio.design,
      version: portfolio.version,
    });

    // Update portfolio
    const updated = await this.repo.updateById(
     String(portfolio._id) ,
      { ...data }
    );

    await this.repo.incrementVersion( String(portfolio._id) );

    return updated;
  }

  async publishPortfolio(userId: string) {
    const portfolio = await this.repo.findByUserId(userId);
    if (!portfolio) throw new Error("Portfolio not found");

    portfolio.status = "published";
    portfolio.publishedVersion = portfolio.version;
    await portfolio.save();

    return portfolio;
  }
}
