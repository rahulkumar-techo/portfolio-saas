/**
 * Gemini AI Service
 * Production-ready wrapper for PortfolioAI
 */

import "server-only";
import { GoogleGenAI } from "@google/genai";

export default function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
}

/* ======================================================
   GENERIC TEXT GENERATOR
====================================================== */

export async function generateText(prompt: string): Promise<string> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return text;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error";
    console.error("Gemini Error:", message);
    throw new Error("AI generation failed");
  }
}

function cleanModelOutput(text: string): string {
  const trimmed = text.trim();

  const fencedMatch = trimmed.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed
    .replace(/^`{3,}html\s*/i, "")
    .replace(/^`{3,}\s*/i, "")
    .replace(/`{3,}$/i, "")
    .trim();
}

export async function generatePortfolioHtml(prompt: string): Promise<string> {
  const strictPrompt = `
You are an expert frontend engineer.
Return ONLY one complete HTML5 document for a modern dark portfolio website.

Hard rules:
- Output must start with <!DOCTYPE html>
- Use semantic sections: header, main, section, footer
- Include exactly one hero section and exactly 3 project cards
- Include responsive CSS inside a <style> tag
- Use Google Fonts in the <head>
- No markdown, no backticks, no explanations
- Do not include any text outside the HTML document

User request:
${prompt}
`.trim();

  const raw = await generateText(strictPrompt);
  return cleanModelOutput(raw);
}

export { getAIClient };
