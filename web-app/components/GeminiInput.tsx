// components/GeminiInput.tsx
"use client"

import { useState } from "react"

export default function GeminiInput() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      })
      const data = await res.json()
      setResponse(data.output?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.")
    } catch (error) {
        console.error("Error fetching response:", error)
      setResponse("Error fetching response.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border border-gray-300 p-3 rounded-md"
          rows={4}
          placeholder="Ask Gemini something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
          <strong>Gemini says:</strong> <br /> {response}
        </div>
      )}
    </div>
  )
}
