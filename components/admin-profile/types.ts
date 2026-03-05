export type PortfolioData = typeof import("../../app/admin-profile/data").default;

export type Hero = PortfolioData["hero"];
export type About = PortfolioData["about"];
export type Skill = PortfolioData["skills"][number];
export type Project = PortfolioData["projects"][number];
export type Experience = PortfolioData["experience"][number];
export type Stat = PortfolioData["stats"][number];
export type Testimonial = PortfolioData["testimonials"][number];
export type Contact = PortfolioData["contact"];
