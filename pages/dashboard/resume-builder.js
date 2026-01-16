import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ResumeBuilder() {
  const { data: session } = useSession();
  const [step, setStep] = useState("template");
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  const templates = [
    {
      id: 1,
      name: "Modern Minimal",
      preview: "⚪",
      color: "from-slate-500 to-slate-600",
    },
    {
      id: 2,
      name: "Creative Bold",
      preview: "🎨",
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 3,
      name: "Professional Classic",
      preview: "📘",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 4,
      name: "Tech Focused",
      preview: "💻",
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Please sign in
          </h1>
          <Link href="/auth/signin">
            <button className="px-6 py-2 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-lg">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent cursor-pointer">
              CareerDash
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/internships"
              className="text-slate-600 hover:text-slate-900"
            >
              Find Jobs
            </Link>
            <Link
              href="/dashboard/applications"
              className="text-slate-600 hover:text-slate-900"
            >
              Applications
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Resume Builder
          </h1>
          <p className="text-lg text-slate-600">
            Create a professional resume in minutes
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { step: "template", label: "Template" },
            { step: "info", label: "Personal Info" },
            { step: "experience", label: "Experience" },
            { step: "education", label: "Education" },
            { step: "skills", label: "Skills" },
            { step: "preview", label: "Preview" },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setStep(s.step)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                step === s.step
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Template Selection */}
        {step === "template" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Choose a Template
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setStep("info")}
                  className="group text-center"
                >
                  <div
                    className={`bg-gradient-to-br ${template.color} rounded-2xl p-12 mb-4 text-6xl flex items-center justify-center group-hover:shadow-lg transition transform group-hover:scale-105`}
                  >
                    {template.preview}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition">
                    {template.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Personal Info */}
        {step === "info" && (
          <div className="space-y-6 bg-white border border-slate-200/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={resumeData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={resumeData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={resumeData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={resumeData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Professional Summary
                </label>
                <textarea
                  name="summary"
                  value={resumeData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief overview of your professional background..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <button
              onClick={() => setStep("experience")}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Continue to Experience
            </button>
          </div>
        )}

        {/* Experience */}
        {step === "experience" && (
          <div className="space-y-6 bg-white border border-slate-200/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Work Experience
            </h2>
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="month"
                    placeholder="Start Date"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <textarea
                  placeholder="Description of your responsibilities and achievements"
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <button className="w-full px-4 py-2 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition">
              + Add Another Experience
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setStep("info")}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("education")}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Continue to Education
              </button>
            </div>
          </div>
        )}

        {/* Education */}
        {step === "education" && (
          <div className="space-y-6 bg-white border border-slate-200/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900">Education</h2>
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="School/University Name"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Field of Study"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="month"
                    placeholder="Graduation Date"
                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
            <button className="w-full px-4 py-2 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition">
              + Add Another Education
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setStep("experience")}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("skills")}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Continue to Skills
              </button>
            </div>
          </div>
        )}

        {/* Skills */}
        {step === "skills" && (
          <div className="space-y-6 bg-white border border-slate-200/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Add a skill (press Enter to add)"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {["React", "JavaScript", "CSS", "Node.js", "SQL"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button className="text-teal-600 hover:text-teal-900">
                        ×
                      </button>
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep("education")}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("preview")}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Preview Resume
              </button>
            </div>
          </div>
        )}

        {/* Preview */}
        {step === "preview" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border border-slate-200/50 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-slate-900">
                  {resumeData.fullName || "John Doe"}
                </h2>
                <p className="text-teal-600 text-lg">
                  {[resumeData.email, resumeData.phone, resumeData.location]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
              {resumeData.summary && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-slate-700">{resumeData.summary}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                📥 Download PDF
              </button>
              <button className="w-full px-6 py-3 border-2 border-teal-300 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition">
                🔗 Share Resume
              </button>
              <button
                onClick={() => setStep("skills")}
                className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                ✏️ Edit Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
