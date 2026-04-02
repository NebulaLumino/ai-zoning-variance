"use client";

import { useState } from "react";

const ACCENT = "violet";

export default function ZoningVarianceGenerator() {
  const [form, setForm] = useState({
    propertyAddress: "",
    currentZoning: "",
    proposedUse: "",
    varianceType: "area",
    neighborhoodContext: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `You are an expert municipal planning and zoning attorney. Generate a complete zoning variance application and hearing preparation package.\n\nPROPERTY ADDRESS: ${form.propertyAddress}\nCURRENT ZONING: ${form.currentZoning}\nPROPOSED USE: ${form.proposedUse}\nVARIANCE TYPE: ${form.varianceType}\nNEIGHBORHOOD CONTEXT: ${form.neighborhoodContext}\n\nVariance type: ${form.varianceType === "area" ? "Area variance (dimensional/physical)" : "Use variance (change of use)"}\n\nGenerate the following clearly labeled sections:\n1. ZONING ANALYSIS (analysis of current zoning code, what specific regulation requires a variance, why strict application would cause practical difficulty or unnecessary hardship)\n2. VARIANCE APPLICATION NARRATIVE (compelling written narrative for the planning/zoning board: describe the property, the hardship, why the variance is the minimum necessary, and how it will not adversely affect neighboring properties)\n3. COMPLIANCE CHECKLIST (comprehensive checklist confirming compliance with all applicable zoning requirements beyond the variance — parking, setbacks, height, FAR, etc.)\n4. NEIGHBOR NOTIFICATION TEMPLATE (draft notification letter to adjacent property owners for the required public hearing notice, including hearing date/place placeholder)\n5. HEARING PREPARATION NOTES (key talking points, anticipated objections and responses, who should attend, what evidence to bring, presentation tips for the zoning board hearing)\n\nUse precise zoning law terminology and procedural requirements.`,
            },
          ],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.choices?.[0]?.message?.content || "No output received.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const accentStyles: Record<string, { border: string; bg: string; text: string; heading: string; gradient: string }> = {
    violet: { border: "border-violet-500", bg: "bg-violet-500/10", text: "text-violet-300", heading: "text-violet-400", gradient: "linear-gradient(to right, #7c3aed, #6d28d9)" },
    blue: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-300", heading: "text-blue-400", gradient: "linear-gradient(to right, #2563eb, #1d4ed8)" },
    green: { border: "border-green-500", bg: "bg-green-500/10", text: "text-green-300", heading: "text-green-400", gradient: "linear-gradient(to right, #16a34a, #15803d)" },
    amber: { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-300", heading: "text-amber-400", gradient: "linear-gradient(to right, #d97706, #b45309)" },
    rose: { border: "border-rose-500", bg: "bg-rose-500/10", text: "text-rose-300", heading: "text-rose-400", gradient: "linear-gradient(to right, #e11d48, #be123c)" },
    teal: { border: "border-teal-500", bg: "bg-teal-500/10", text: "text-teal-300", heading: "text-teal-400", gradient: "linear-gradient(to right, #0d9488, #0f766e)" },
    cyan: { border: "border-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-300", heading: "text-cyan-400", gradient: "linear-gradient(to right, #0891b2, #0e7490)" },
    orange: { border: "border-orange-500", bg: "bg-orange-500/10", text: "text-orange-300", heading: "text-orange-400", gradient: "linear-gradient(to right, #ea580c, #c2410c)" },
    pink: { border: "border-pink-500", bg: "bg-pink-500/10", text: "text-pink-300", heading: "text-pink-400", gradient: "linear-gradient(to right, #db2777, #be185d)" },
  };

  const s = accentStyles[ACCENT];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${s.heading} mb-2`}>
            🏠 AI Municipal Code Compliance & Zoning Variance Report
          </h1>
          <p className="text-gray-400">
            Generate zoning variance applications, compliance checklists, neighbor
            notifications, and hearing prep notes — powered by DeepSeek.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Property Address</label>
              <input
                name="propertyAddress"
                value={form.propertyAddress}
                onChange={handleChange}
                placeholder="e.g., 142 Oak Street, Springfield"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Current Zoning</label>
              <input
                name="currentZoning"
                value={form.currentZoning}
                onChange={handleChange}
                placeholder="e.g., R-2 (Single-Family Residential)"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Variance Type</label>
              <select
                name="varianceType"
                value={form.varianceType}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="area">Area Variance (dimensional/setback)</option>
                <option value="use">Use Variance (change of use)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Proposed Use / Development</label>
            <textarea
              name="proposedUse"
              value={form.proposedUse}
              onChange={handleChange}
              placeholder="Describe what you want to do: build a garage closer to the property line, add an accessory dwelling unit, convert to a home business, etc..."
              rows={4}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Neighborhood Context</label>
            <textarea
              name="neighborhoodContext"
              value={form.neighborhoodContext}
              onChange={handleChange}
              placeholder="Describe the surrounding area: neighboring land uses, zoning of adjacent parcels, any relevant history or context..."
              rows={4}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#374151" : s.gradient }}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Zoning Variance Package"}
          </button>

          {error && (
            <div className="border border-red-500 bg-red-500/10 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {output && (
          <div className={`border ${s.border} ${s.bg} rounded-xl p-6`}>
            <h2 className={`text-xl font-bold ${s.heading} mb-4`}>Generated Output</h2>
            <pre className="whitespace-pre-wrap text-gray-200 text-sm font-mono leading-relaxed">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
