/**
 * AI Resume Service — ATS Optimized
 * Comprehensive resume generation, scoring, and analysis using Gemini
 */

import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
  gpa?: number;
  honors?: string[];
  relevantCourses?: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;  // "MM/YYYY"
  endDate: string;    // "MM/YYYY" | "Present"
  bullets: string[];
  technologiesUsed?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologiesUsed: string[];
  url?: string;
  highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  expiryYear?: number;
  credentialId?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary?: string;
  education: Education[];
  experience: WorkExperience[];
  projects?: Project[];
  skills: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    languages?: string[];
    frameworks?: string[];
    certifications?: Certification[];
  };
  awards?: string[];
  publications?: string[];
  volunteerWork?: string[];
}

export interface JobDescription {
  title: string;
  company?: string;
  description: string;           // Raw JD text
  requiredSkills?: string[];
  preferredSkills?: string[];
  industryKeywords?: string[];
}

// ── Output shapes ──

export interface ATSScore {
  overall: number;               // 0–100
  breakdown: {
    keywordMatch: number;        // % of JD keywords found in resume
    formattingScore: number;     // ATS-parseable structure score
    quantificationScore: number; // % bullets with measurable outcomes
    actionVerbScore: number;     // % bullets starting with strong verbs
    sectionCompleteness: number; // Required sections present
    readabilityScore: number;    // Clarity + conciseness
  };
  grade: "A+" | "A" | "B+" | "B" | "C" | "D" | "F";
}

export interface ATSAnalysis {
  score: ATSScore;
  missingKeywords: string[];
  presentKeywords: string[];
  weakBullets: string[];         // Bullets lacking action verbs or metrics
  suggestions: {
    critical: string[];          // Must fix
    important: string[];         // Should fix
    optional: string[];          // Nice to have
  };
  sectionFeedback: Record<string, string>;
  tailoringTips: string[];       // JD-specific tips
}

export interface GeneratedResume {
  rawText: string;               // Plain ATS-parseable text
  markdownVersion: string;       // Readable markdown
  jsonStructured: ResumeData;    // Structured for further processing
  wordCount: number;
  estimatedPageCount: number;
}

export interface CoverLetterResult {
  coverLetter: string;
  keyThemesAddressed: string[];
}

export interface InterviewPrepResult {
  likelyQuestions: string[];
  suggestedAnswers: Record<string, string>;
  starExamples: string[];
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const ATS_ACTION_VERBS = [
  "Achieved","Accelerated","Architected","Automated","Boosted","Built",
  "Championed","Collaborated","Conducted","Configured","Created","Decreased",
  "Delivered","Deployed","Designed","Developed","Diagnosed","Directed",
  "Drove","Eliminated","Enabled","Enhanced","Established","Executed",
  "Expanded","Generated","Identified","Implemented","Improved","Increased",
  "Integrated","Launched","Led","Managed","Mentored","Migrated","Negotiated",
  "Optimized","Orchestrated","Oversaw","Partnered","Produced","Reduced",
  "Refactored","Resolved","Scaled","Secured","Spearheaded","Streamlined",
  "Transformed","Unified","Upgraded","Validated","Wrote"
];

const REQUIRED_SECTIONS = [
  "contact","summary","experience","education","skills"
];

const GEMINI_MODEL = "gemini-2.5-flash";

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

class AIResumeService {

  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  // ── Core generator ───────────────────────────────────────────────────────

  private async generate(prompt: string, asJSON = false): Promise<string> {
    try {
      const config = asJSON
        ? { responseMimeType: "application/json" }
        : {};

      const response = await this.ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config,
      });

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) throw new Error("Empty response from Gemini");
      return text;

    } catch (error) {
      console.error("[AIResumeService] generation error:", error);
      throw new Error(`AI generation failed: ${(error as Error).message}`);
    }
  }

  private parseJSON<T>(raw: string): T {
    // Strip markdown fences if present
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(clean) as T;
  }

  // ── 1. Generate ATS Resume ───────────────────────────────────────────────

  /**
   * Generate a complete ATS-optimised resume.
   * Optionally pass a job description to tailor the output.
   */
  async generateATSResume(
    resumeData: ResumeData,
    jobDescription?: JobDescription
  ): Promise<GeneratedResume> {

    const tailoringContext = jobDescription ? `
TARGET ROLE: ${jobDescription.title}${jobDescription.company ? ` at ${jobDescription.company}` : ""}
JOB DESCRIPTION:
${jobDescription.description}

Required skills to weave in: ${(jobDescription.requiredSkills ?? []).join(", ")}
Preferred skills to mention if applicable: ${(jobDescription.preferredSkills ?? []).join(", ")}
` : "";

    const prompt = `
You are a world-class ATS resume expert and professional resume writer.
Generate a complete, polished, ATS-friendly resume from the data below.

${tailoringContext}

─── ATS RULES (MUST FOLLOW) ───
1. Start every bullet with a strong action verb from: ${ATS_ACTION_VERBS.slice(0, 20).join(", ")}, etc.
2. Include quantified achievements in at least 70% of bullets (%, $, time saved, users, team size).
3. Use EXACT keywords from the job description naturally throughout.
4. Sections in this order: Summary, Experience, Education, Projects, Skills, Certifications.
5. Use plain section headers (no icons, no tables).
6. Dates in "Month YYYY – Month YYYY" format.
7. No graphics, photos, columns, or text boxes.
8. Avoid personal pronouns (I, my, we).
9. Keep bullets to 1–2 lines max, starting with verb + context + impact.
10. Skills section: group by category (Languages, Frameworks, Tools, Cloud, etc.).

─── OUTPUT FORMAT ───
Return a JSON object with these exact keys:
{
  "rawText": "<plain text resume, ATS-safe, sections separated by \\n\\n>",
  "markdownVersion": "<same resume in clean markdown with ## headings>",
  "jsonStructured": <the full structured ResumeData object reflecting edits>,
  "wordCount": <integer>,
  "estimatedPageCount": <1 or 2>
}

─── RESUME DATA ───
${JSON.stringify(resumeData, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON<GeneratedResume>(raw);
  }

  // ── 2. ATS Score & Deep Analysis ────────────────────────────────────────

  /**
   * Score the resume against ATS criteria and optionally against a JD.
   * Returns a detailed breakdown with actionable fixes.
   */
  async analyzeResume(
    resumeData: ResumeData,
    jobDescription?: JobDescription
  ): Promise<ATSAnalysis> {

    const jdContext = jobDescription
      ? `\nJob Description to match against:\n${jobDescription.description}`
      : "\nNo specific job description provided — do general ATS analysis.";

    const prompt = `
You are an ATS parsing expert and resume coach. Deeply analyze this resume.

${jdContext}

─── ANALYSIS CHECKLIST ───
Score each area 0–100:
- keywordMatch: % of important JD keywords found in resume
- formattingScore: clean structure, no tables/columns/graphics, standard sections
- quantificationScore: % of bullets with numbers, %, $, time, scale metrics
- actionVerbScore: % of bullets starting with strong action verbs
- sectionCompleteness: all required sections present (${REQUIRED_SECTIONS.join(", ")})
- readabilityScore: concise, no filler words, professional tone

Overall = weighted average: keyword(30%) + quant(25%) + action(20%) + format(15%) + sections(5%) + readability(5%)

Grade scale: 90-100=A+, 80-89=A, 75-79=B+, 65-74=B, 50-64=C, 35-49=D, <35=F

─── OUTPUT FORMAT ───
Return JSON with these exact keys:
{
  "score": {
    "overall": <number>,
    "breakdown": {
      "keywordMatch": <number>,
      "formattingScore": <number>,
      "quantificationScore": <number>,
      "actionVerbScore": <number>,
      "sectionCompleteness": <number>,
      "readabilityScore": <number>
    },
    "grade": "<grade>"
  },
  "missingKeywords": ["<keyword>", ...],
  "presentKeywords": ["<keyword>", ...],
  "weakBullets": ["<original bullet>", ...],
  "suggestions": {
    "critical": ["<fix>", ...],
    "important": ["<fix>", ...],
    "optional": ["<fix>", ...]
  },
  "sectionFeedback": {
    "summary": "<feedback>",
    "experience": "<feedback>",
    "skills": "<feedback>",
    "education": "<feedback>"
  },
  "tailoringTips": ["<tip>", ...]
}

─── RESUME DATA ───
${JSON.stringify(resumeData, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON<ATSAnalysis>(raw);
  }

  // ── 3. Rewrite Weak Bullets ──────────────────────────────────────────────

  /**
   * Takes weak bullets and rewrites them as strong, quantified, ATS-ready bullets.
   */
  async rewriteBullets(
    bullets: string[],
    context: { role: string; industry: string; jobDescription?: string }
  ): Promise<{ original: string; rewritten: string; improvement: string }[]> {

    const prompt = `
You are an expert resume writer. Rewrite these weak resume bullets into powerful, ATS-optimised bullets.

Role: ${context.role}
Industry: ${context.industry}
${context.jobDescription ? `Job context: ${context.jobDescription}` : ""}

Rules for rewriting:
- Start with a strong action verb
- Add quantified impact (estimate if needed — use "~" prefix)
- Include relevant keywords naturally
- Keep to 1–2 lines
- No personal pronouns
- Focus on impact, not just duties

Return JSON array:
[
  {
    "original": "<original bullet>",
    "rewritten": "<improved bullet>",
    "improvement": "<one sentence explaining what changed>"
  }
]

Bullets to rewrite:
${JSON.stringify(bullets, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 4. Generate Professional Summary ────────────────────────────────────

  /**
   * Craft a keyword-rich, ATS-optimised professional summary (3–5 lines).
   */
  async generateSummary(
    resumeData: ResumeData,
    jobDescription?: JobDescription
  ): Promise<{ summary: string; keywordsUsed: string[] }> {

    const prompt = `
Write a compelling, ATS-optimised professional summary for a resume.

Candidate: ${resumeData.contact.name}
Target Role: ${jobDescription?.title ?? "Not specified"}
${jobDescription ? `Job Description: ${jobDescription.description.slice(0, 800)}` : ""}

Requirements:
- 3–5 sentences, 60–90 words
- Include years of experience, top skills, and a unique value proposition
- Use keywords from the JD naturally
- Start with the job title or professional identity
- Include 1–2 quantified achievements
- No personal pronouns (I, my, me)
- Professional, confident, specific tone

Return JSON:
{
  "summary": "<the summary paragraph>",
  "keywordsUsed": ["<keyword>", ...]
}

Resume data for context:
${JSON.stringify({ experience: resumeData.experience, skills: resumeData.skills }, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 5. Keyword Gap Analysis ──────────────────────────────────────────────

  /**
   * Compare resume against a job description to find missing critical keywords.
   */
  async keywordGapAnalysis(
    resumeData: ResumeData,
    jobDescription: JobDescription
  ): Promise<{
    critical: string[];      // Must-have keywords missing from resume
    important: string[];     // High-value missing keywords
    nice: string[];          // Optional keywords to add
    alreadyPresent: string[];
    recommendedPlacements: Record<string, string>; // keyword → suggested section
  }> {

    const prompt = `
Perform a thorough keyword gap analysis between this resume and job description.

Categorize ALL keywords found in the JD:
- critical: required skills/tools explicitly stated as "required" or "must have"
- important: frequently mentioned skills and technologies
- nice: mentioned once or in "preferred/bonus" sections

For each missing keyword, suggest which resume section to add it to.

Return JSON:
{
  "critical": ["<keyword>"],
  "important": ["<keyword>"],
  "nice": ["<keyword>"],
  "alreadyPresent": ["<keyword>"],
  "recommendedPlacements": {
    "<keyword>": "<section: summary | experience | skills | projects>"
  }
}

JOB DESCRIPTION:
${jobDescription.description}

RESUME (plain text):
${JSON.stringify(resumeData, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 6. Tailor Resume for Specific Job ───────────────────────────────────

  /**
   * Fully tailor an existing resume to a specific job description.
   * Returns both the updated resume and a changelog of modifications.
   */
  async tailorResumeForJob(
    resumeData: ResumeData,
    jobDescription: JobDescription
  ): Promise<{ tailoredResume: GeneratedResume; changelog: string[] }> {

    const prompt = `
Tailor this resume specifically for the job description below.
Maximise keyword alignment while keeping all content truthful.

Changes you should make:
1. Reorder bullet points to lead with most relevant experience
2. Add JD keywords naturally into existing bullets (don't fabricate)
3. Rewrite the professional summary to mirror the JD's language
4. Reorder skills to match JD priorities
5. Highlight the most relevant projects
6. Adjust job titles slightly if honest alternatives are more ATS-friendly

─── JOB DESCRIPTION ───
Role: ${jobDescription.title}${jobDescription.company ? ` | ${jobDescription.company}` : ""}
${jobDescription.description}

─── OUTPUT FORMAT ───
Return JSON:
{
  "tailoredResume": {
    "rawText": "<ATS-safe plain text>",
    "markdownVersion": "<markdown>",
    "jsonStructured": <updated ResumeData>,
    "wordCount": <number>,
    "estimatedPageCount": <1|2>
  },
  "changelog": [
    "<description of change made>",
    ...
  ]
}

─── ORIGINAL RESUME DATA ───
${JSON.stringify(resumeData, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 7. Generate Cover Letter ─────────────────────────────────────────────

  /**
   * Generate a tailored, ATS-friendly cover letter.
   */
  async generateCoverLetter(
    resumeData: ResumeData,
    jobDescription: JobDescription
  ): Promise<CoverLetterResult> {

    const prompt = `
Write a compelling, professional cover letter tailored to this job.

Guidelines:
- 3 short paragraphs: hook + value proposition + call to action
- Mirror keywords from the JD naturally
- Reference 2–3 specific achievements from the resume with metrics
- Confident and direct tone — no filler phrases like "I believe" or "I feel"
- Under 300 words
- Include a strong opening line (not "I am writing to apply for...")

Return JSON:
{
  "coverLetter": "<full cover letter text with Dear Hiring Manager salutation and sign-off>",
  "keyThemesAddressed": ["<theme>", ...]
}

Candidate: ${resumeData.contact.name}
Role: ${jobDescription.title}${jobDescription.company ? ` at ${jobDescription.company}` : ""}

JOB DESCRIPTION:
${jobDescription.description}

TOP ACHIEVEMENTS TO REFERENCE:
${resumeData.experience.slice(0, 2).map(e => e.bullets.slice(0, 3).join("\n")).join("\n")}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 8. Interview Prep ────────────────────────────────────────────────────

  /**
   * Generate likely interview questions with STAR-format answers based on the resume.
   */
  async generateInterviewPrep(
    resumeData: ResumeData,
    jobDescription?: JobDescription
  ): Promise<InterviewPrepResult> {

    const prompt = `
Based on this resume and job description, generate targeted interview preparation material.

Create:
1. 10 likely interview questions (mix of behavioral, technical, situational)
2. STAR-format answer outlines for the top 5 using actual resume content
3. 3 strong STAR story examples the candidate can adapt

Return JSON:
{
  "likelyQuestions": ["<question>", ...],
  "suggestedAnswers": {
    "<question>": "<Situation: ... Task: ... Action: ... Result: ...>"
  },
  "starExamples": [
    "<Full STAR story from resume experience>",
    ...
  ]
}

${jobDescription ? `Target Role: ${jobDescription.title}\nJD: ${jobDescription.description.slice(0, 500)}` : ""}

Resume Data:
${JSON.stringify({ experience: resumeData.experience, skills: resumeData.skills, education: resumeData.education }, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 9. Skills Extractor ──────────────────────────────────────────────────

  /**
   * Automatically extract and categorize all skills from raw resume text.
   */
  async extractAndCategorizeSkills(rawResumeText: string): Promise<{
    technical: string[];
    soft: string[];
    tools: string[];
    frameworks: string[];
    languages: string[];
    cloud: string[];
    certifications: string[];
  }> {

    const prompt = `
Extract and categorize all skills mentioned in this resume text.
Be thorough — look in experience bullets, projects, and skills sections.

Return JSON:
{
  "technical": [],
  "soft": [],
  "tools": [],
  "frameworks": [],
  "languages": [],
  "cloud": [],
  "certifications": []
}

Resume Text:
${rawResumeText}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

  // ── 10. LinkedIn Headline & About Generator ───────────────────────────────

  /**
   * Generate an optimised LinkedIn headline and About section.
   */
  async generateLinkedInContent(
    resumeData: ResumeData,
    targetRole?: string
  ): Promise<{ headline: string; about: string; featuredSkills: string[] }> {

    const prompt = `
Create optimised LinkedIn content for this professional.

LinkedIn Headline: Max 220 chars. Format: "[Title] | [Top Skill] | [Value Prop]". Keyword-rich.
About Section: 3–5 paragraphs. First line is a hook. Include achievements, skills, call to action.
Featured Skills: Top 10 skills to feature (prioritise endorsable ones).

Return JSON:
{
  "headline": "<headline>",
  "about": "<about section>",
  "featuredSkills": ["<skill>", ...]
}

Target Role: ${targetRole ?? resumeData.experience?.[0]?.title ?? "Professional"}
Name: ${resumeData.contact.name}

${JSON.stringify({ experience: resumeData.experience.slice(0, 2), skills: resumeData.skills }, null, 2)}
`;

    const raw = await this.generate(prompt, true);
    return this.parseJSON(raw);
  }

}

const aiResumeService = new AIResumeService();

export default aiResumeService;


// ─────────────────────────────────────────────
// Usage Examples
// ─────────────────────────────────────────────

/*

import resumeService from "./ai-resume-service";

const myResume: ResumeData = {
  contact: {
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1-555-123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  experience: [{
    title: "Software Engineer",
    company: "Acme Corp",
    location: "Remote",
    startDate: "01/2022",
    endDate: "Present",
    bullets: [
      "Built a React dashboard used by 10,000 users",
      "Worked on backend APIs",
    ],
  }],
  education: [{
    degree: "B.S.",
    field: "Computer Science",
    institution: "UC Berkeley",
    graduationYear: 2021,
  }],
  skills: {
    technical: ["Python", "TypeScript", "React"],
    tools: ["Docker", "AWS", "Git"],
  },
};

const jd: JobDescription = {
  title: "Senior Full-Stack Engineer",
  company: "Stripe",
  description: "We are looking for a Senior Full-Stack Engineer proficient in React, Node.js, TypeScript, and AWS...",
  requiredSkills: ["React", "Node.js", "TypeScript", "AWS"],
};

// Generate tailored resume
const resume = await resumeService.generateATSResume(myResume, jd);

// Score & analyze it
const analysis = await resumeService.analyzeResume(myResume, jd);
console.log(`ATS Score: ${analysis.score.overall}/100 (${analysis.score.grade})`);

// Keyword gap
const gaps = await resumeService.keywordGapAnalysis(myResume, jd);
console.log("Missing critical keywords:", gaps.critical);

// Rewrite weak bullets
const improved = await resumeService.rewriteBullets(
  ["Worked on backend APIs", "Helped with deployment"],
  { role: "Senior Engineer", industry: "FinTech", jobDescription: jd.description }
);

// Generate cover letter
const letter = await resumeService.generateCoverLetter(myResume, jd);

// Interview prep
const prep = await resumeService.generateInterviewPrep(myResume, jd);

// LinkedIn
const linkedin = await resumeService.generateLinkedInContent(myResume, jd.title);

*/
