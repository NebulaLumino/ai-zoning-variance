"use client";

import { useState } from "react";
import { generateText } from "ai";
import { deepseek } from "@ai-sdk/deepseek";

function getDeepSeekClient() {
  return deepseek("deepseek-chat");
}

type Field = { label: string; key: string; type: string; placeholder: string; required?: boolean };
type Section = { title: string; fields: Field[] };

const SECTIONS: Section[] = [
  {
    title: "Property Information",
    fields: [
      { label: "Property Address", key: "address", type: "text", placeholder: "123 Main St, City, State ZIP", required: true },
      { label: "Parcel Number (Tax ID)", key: "parcel", type: "text", placeholder: "e.g., 123-45-678" },
      { label: "Current Zoning Designation", key: "zoning", type: "text", placeholder: "e.g., R-1 Single Family Residential", required: true },
    ],
  },
  {
    title: "Variance Request",
    fields: [
      { label: "Variance Type", key: "varianceType", type: "select", placeholder: "Select type..." },
      { label: "Specific Dimension/Requirement Affected", key: "requirement", type: "text", placeholder: "e.g., Rear yard setback of 25ft required, requesting 15ft" },
      { label: "Current Non-Compliant Dimension", key: "currentDim", type: "text", placeholder: "e.g., Current setback is 10ft" },
      { label: "Requested Dimension", key: "requestedDim", type: "text", placeholder: "e.g., Requesting 15ft setback" },
    ],
  },
  {
    title: "Project & Hardship",
    fields: [
      { label: "Project Description", key: "projectDesc", type: "textarea", placeholder: "Describe your proposed project...", required: true },
      { label: "Why Does Current Zoning Create Hardship?", key: "hardship", type: "textarea", placeholder: "Explain the unique hardship the current zoning creates...", required: true },
    ],
  },
  {
    title: "Neighborhood Context",
    fields: [
      { label: "Existing Neighborhood Character", key: "neighborhood", type: "textarea", placeholder: "Describe the existing neighborhood character and context..." },
      { label: "How Will Variance Impact Neighborhood?", key: "impact", type: "textarea", placeholder: "Explain potential impacts on the neighborhood..." },
    ],
  },
  {
    title: "Supporting Materials",
    fields: [
      { label: "Supporting Documentation Available", key: "docs", type: "text", placeholder: "e.g., Survey, site plan, architect drawings, photos" },
      { label: "Prior Variance Applications (if any)", key: "priorVariance", type: "textarea", placeholder: "Any prior variance requests on this property..." },
    ],
  },
];

const VARIANCE_OPTIONS = ["Area Variance (dimensional)", "Use Variance", "Mixed (Area + Use)"];

export default function ZoningVariancePage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { text } = await generateText({
        model: getDeepSeekClient(),
        prompt: `You are an expert land use attorney and planning professional. Generate a complete, professional zoning variance application package for presentation to a planning commission or board of adjustment.

Use the following property and request information:
${Object.entries(formData)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}

Generate a comprehensive zoning variance application package containing ALL of the following sections, formatted as professional government/legal documents:

# VARIANCE APPLICATION PACKAGE

## 1. APPLICATION COVER SHEET
Include: property address, parcel number, current zoning, variance type requested, applicant name placeholder, date, and all relevant identifiers.

## 2. NARRATIVE JUSTIFICATION
Write a compelling, legally-sound narrative explaining why the variance should be granted. Reference the applicable legal standards for variance approval (undue hardship, unique circumstances, not self-created, public interest preserved, spirit of ordinance observed). Be persuasive but professional.

## 3. HARDSHIP ANALYSIS
Analyze the hardship under the accepted legal standard:
- Unique physical circumstances of the property
- How circumstances deprive the property of privileges enjoyed by other properties in the same zone
- Why the hardship is NOT self-created
- Why the variance is the minimum deviation necessary

## 4. NEIGHBORHOOD IMPACT ASSESSMENT
Write a professional assessment of how the requested variance:
- Does or does not affect adjacent property values
- Relates to the character of the surrounding area
- Impacts traffic, parking, and public services
- Is consistent with the general character of the neighborhood

## 5. SITE PLAN DESCRIPTION
Generate a professional site plan description that could accompany a submitted site plan. Include: setback dimensions, lot coverage, building envelope, impervious surface ratio, and all relevant measurements.

## 6. COMPREHENSIVE PLAN CONSISTENCY MEMORANDUM
Write a memo explaining how the requested variance is consistent with the jurisdiction's comprehensive plan goals and policies. Reference relevant general plan elements (land use, housing, neighborhood character, etc.).

## 7. PUBLIC HEARING TESTIMONY OUTLINE
Provide a structured outline for oral testimony at the public hearing:
- Opening statement (2-3 minutes)
- Key points to emphasize
- Anticipated objections and responses
- Supporting evidence to reference
- Closing statement

## 8. EXHIBIT AND ATTACHMENT CHECKLIST
Create a comprehensive checklist of all exhibits and attachments that should accompany the application:
- Required exhibits
- Recommended exhibits
- Optional but beneficial exhibits
- Pre-submission verification checklist

Format all sections with clear headers, professional language, and enough detail to be immediately usable by an applicant presenting to a planning commission.`,
      });
      setOutput(text);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  const currentFields = SECTIONS[activeSection]?.fields || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-1">Zoning Variance Application Generator</h1>
          <p className="text-gray-400 text-sm">Prepare complete, professional variance applications for planning commissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-[#12122a] border border-purple-900/40 rounded-xl p-6">
            {/* Section tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {SECTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSection === i
                      ? "bg-purple-600 text-white"
                      : "bg-[#1a1a2e] text-gray-400 hover:text-white border border-gray-700"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {SECTIONS[activeSection].title === "Variance Request" && activeSection === 1 && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Variance Type *</label>
                  <select
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    value={formData.varianceType || ""}
                    onChange={(e) => handleChange("varianceType", e.target.value)}
                  >
                    <option value="">Select type...</option>
                    {VARIANCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              )}
              {currentFields.map((field) => {
                if (SECTIONS[activeSection].title === "Variance Request" && field.key === "varianceType") return null;
                return (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-400 mb-1">
                      {field.label} {field.required && <span className="text-purple-400">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-y"
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                        placeholder={field.placeholder}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nav */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
                disabled={activeSection === 0}
                className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition-all"
              >
                ← Back
              </button>
              {activeSection < SECTIONS.length - 1 ? (
                <button
                  onClick={() => setActiveSection((s) => s + 1)}
                  className="px-4 py-2 rounded-lg text-sm bg-purple-600 hover:bg-purple-500 transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all font-medium"
                >
                  {loading ? "Generating..." : "Generate Application"}
                </button>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="bg-[#12122a] border border-purple-900/40 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-purple-300 mb-4">Generated Application Package</h2>
            {output ? (
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-gray-200 overflow-y-auto max-h-[600px]">
                {output}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic mt-8 text-center">
                Fill in the form and click &quot;Generate Application&quot; to produce a complete variance application package.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
