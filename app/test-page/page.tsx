"use client";

import { useState } from "react";
import axios from "axios";

export default function TestAIPage() {

  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [strength, setStrength] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [generated, setGenerated] = useState<any>(null);
  const [ats, setAts] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStrength = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/resume/strength");
      if (res.data?.success) {
        setStrength(res.data.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Strength fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/resume/preview");
      if (res.data?.success) {
        setPreview(res.data.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Preview fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const generateResume = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/resume/generate", {
        jobDescription: jobDescription || undefined,
      });
      if (res.data?.success) {
        setGenerated(res.data.data.generated);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Resume generation failed");
    } finally {
      setLoading(false);
    }
  };

  const analyzeAts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/resume/ats", {
        jobDescription,
      });
      if (res.data?.success) {
        setAts(res.data.data.analysis);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">

      <h1 className="text-xl font-bold">
        Resume Builder + ATS Integration Test
      </h1>

      <textarea
        className="w-full min-h-40 border rounded-lg p-3 bg-transparent"
        placeholder="Paste job description here for ATS score + tailored generation"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={fetchStrength}
          className="px-4 py-2 bg-slate-700 rounded text-white"
        >
          {loading ? "Loading..." : "Check Strength"}
        </button>
        <button
          onClick={fetchPreview}
          className="px-4 py-2 bg-indigo-700 rounded text-white"
        >
          {loading ? "Loading..." : "Preview Resume Data"}
        </button>
        <button
          onClick={generateResume}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          {loading ? "Loading..." : "Generate ATS Resume"}
        </button>
        <button
          onClick={analyzeAts}
          className="px-4 py-2 bg-emerald-700 rounded text-white"
        >
          {loading ? "Loading..." : "Analyze ATS Match"}
        </button>
      </div>

      {error && (
        <div className="p-4 border border-red-500/40 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {strength && (
        <div className="p-6 border rounded-lg bg-white/5 space-y-2">
          <h2 className="font-semibold">Strength</h2>
          <p>Score: {strength.score}/100</p>
          <p>Missing: {(strength.missingSections || []).join(", ") || "None"}</p>
        </div>
      )}

      {preview?.previewText && (
        <div className="p-6 border rounded-lg bg-white/5 whitespace-pre-wrap">
          <h2 className="font-semibold mb-3">Preview</h2>
          {preview.previewText}
        </div>
      )}

      {generated?.rawText && (
        <div className="p-6 border rounded-lg bg-white/5 whitespace-pre-wrap space-y-3">
          <h2 className="font-semibold">Generated ATS Resume</h2>
          <p className="text-sm text-white/70">
            Words: {generated.wordCount} | Pages: {generated.estimatedPageCount}
          </p>
          <pre className="whitespace-pre-wrap">{generated.rawText}</pre>
        </div>
      )}

      {ats?.score && (
        <div className="p-6 border rounded-lg bg-white/5 space-y-3">
          <h2 className="font-semibold">ATS Analysis</h2>
          <p>
            Overall: {ats.score.overall}/100 ({ats.score.grade})
          </p>
          <p className="text-sm text-white/70">
            Missing Keywords: {(ats.missingKeywords || []).slice(0, 12).join(", ") || "None"}
          </p>
          <ul className="list-disc ml-5 text-sm">
            {(ats?.suggestions?.critical || []).slice(0, 5).map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="text-xs text-white/60"
      >
        Endpoints used: `/api/resume/strength`, `/api/resume/preview`, `/api/resume/generate`, `/api/resume/ats`
      </div>

    </div>
  );
}
