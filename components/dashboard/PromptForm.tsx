/**
 * PromptForm Component
 * Takes user prompt and sends to AI API
 */

"use client"

import { useState } from "react"

export default function PromptForm({ onGenerate }: { onGenerate: (data: any) => void }) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt) return

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    })

    const data = await res.json()
    onGenerate(data)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <textarea
        className="border p-3 rounded-lg"
        placeholder="Describe your portfolio..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-3 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Portfolio"}
      </button>
    </div>
  )
}