"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: input });
      setResponse(res.data.reply || "No response from AI");
    } catch (error) {
      console.error(error);
      setResponse("❌ Error: Unable to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        ⚡ Kavish AI Code Assistant
      </h1>

      <textarea
        className="w-full max-w-2xl p-4 rounded-xl bg-gray-800 text-gray-100 outline-none resize-none mb-4"
        rows={5}
        placeholder="Ask me to generate code, fix bugs, or explain logic..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Response"}
      </button>

      <div className="w-full max-w-2xl mt-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-lg font-semibold mb-2">💬 AI Response:</h2>
        <pre className="whitespace-pre-wrap text-sm text-gray-300">
          {response || "No output yet."}
        </pre>
      </div>
    </div>
  );
}
