"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      // const res = await fetch("/api/gemini", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ userInput: input }),
      // });

      const userInput = input;
      if (!userInput) {
        setResponse("User input is required");
        return;
      }
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setResponse("API key is missing");
        return;
      }
      
      const systemPrompt = `You are a site advisor for a website. You **ONLY** have to give *SUMMARIZED* description of the site only. DO NOT provide what you have to do, just provide the required description. You will be given a URL and you will provide a brief description of the website by the name in your *DATABASE*, its purpose is to tell user that does this website name may contain any kind of *PORN*, *HARMFUL WORDS* and *SUCIDE*. The site link is`;
      
      const data = {
        contents: [{ parts: [{ text: systemPrompt + userInput }] }],
      };
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        console.error("Gemini API error:", await response.json());
        setResponse("Failed to fetch response from Gemini");
        return;
      }
      
      const responseData = await response.json();
      setResponse(responseData.candidates[0].content.parts[0].text);

    } catch (error) {
      console.log(error);
      setResponse("Error getting response from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-black">Gemini AI Chat</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-md bg-white-800 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask something..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Submit"}
        </button>

        <button
  className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
  onClick={async () => {
    try {
      const res = await fetch("/api/block-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteURl: input }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error blocking site:", error);
      alert("Failed to block the site.");
    }
  }}
>
  Block This Site
</button>

      </form>
      {response && (
        <div className="mt-6 w-full max-w-md p-4 bg-gray-800 rounded-md">
          <h2 className="text-lg font-semibold">AI Response:</h2>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}
