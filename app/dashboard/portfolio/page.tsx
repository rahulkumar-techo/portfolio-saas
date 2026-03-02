/**
 * AI Website Generator Page
 * Generates and previews AI-created webpage
 */

"use client"

import React, { useState } from "react"

const Page = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt) return

    setLoading(true)

    try {
      const res = await fetch("/api/portfolio/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const contentType = res.headers.get("content-type") || ""
      const payload = contentType.includes("application/json")
        ? await res.json()
        : { error: await res.text() }

      if (!res.ok) {
        throw new Error(payload.error || "Generation failed")
      }

      setGeneratedCode(payload.data || "")
    } catch (error) {
      console.error("Generation failed", error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-6">

      {/* Prompt Section */}
      <div className="flex flex-col gap-3">
        <textarea
          className="border p-3 rounded-lg w-full"
          rows={4}
          placeholder="Describe the website you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white p-3 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Website"}
        </button>
      </div>

      {/* Preview Section */}
      {generatedCode && (
        <div className="border rounded-lg overflow-hidden h-[600px]">
          <iframe
            srcDoc={generatedCode}
            title="AI Preview"
            className="w-full h-full"
          />
        </div>
      )}

    </div>
  )
}

export default Page
