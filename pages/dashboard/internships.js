import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function InternshipPortal() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [savedJobs, setSavedJobs] = useState({});

  // Mock internships data
  const internships = [
    {
      id: 1,
      company: "TechCorp",
      role: "Frontend Developer Intern",
      industry: "Technology",
      level: "beginner",
      stipend: "$2000/mo",
      location: "San Francisco, CA",
      skills: ["React", "JavaScript", "CSS"],
      description:
        "Join our frontend team to build responsive web applications.",
      applicants: 234,
    },
    {
      id: 2,
      company: "DataStack",
      role: "Data Analyst Intern",
      industry: "Data Science",
      level: "intermediate",
      stipend: "$2500/mo",
      location: "New York, NY",
      skills: ["Python", "SQL", "Tableau"],
      description: "Analyze datasets and create insightful dashboards.",
      applicants: 187,
    },
    {
      id: 3,
      company: "CloudSys",
      role: "Backend Engineer Intern",
      industry: "Technology",
      level: "intermediate",
      stipend: "$2800/mo",
      location: "Seattle, WA",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      description: "Build scalable backend services for cloud infrastructure.",
      applicants: 145,
    },
    {
      id: 4,
      company: "FinanceAI",
      role: "ML Engineer Intern",
      industry: "Finance",
      level: "advanced",
      stipend: "$3500/mo",
      location: "Boston, MA",
      skills: ["Python", "TensorFlow", "ML"],
      description: "Develop machine learning models for financial predictions.",
      applicants: 98,
    },
    {
      id: 5,
      company: "DesignStudio",
      role: "UI/UX Designer Intern",
      industry: "Design",
      level: "beginner",
      stipend: "$1800/mo",
      location: "Austin, TX",
      skills: ["Figma", "UI Design", "Prototyping"],
      description: "Create beautiful user interfaces for mobile and web apps.",
      applicants: 156,
    },
    {
      id: 6,
      company: "InnovateLabs",
      role: "Full Stack Developer Intern",
      industry: "Technology",
      level: "intermediate",
      stipen: "$2700/mo",
      location: "Los Angeles, CA",
      skills: ["React", "Node.js", "MongoDB"],
      description: "Build full-stack applications with modern tech stack.",
      applicants: 203,
    },
  ];

  // Filter internships
  const filtered = internships.filter((job) => {
    const matchesSearch =
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || job.level === filterLevel;
    const matchesIndustry =
      filterIndustry === "all" || job.industry === filterIndustry;
    return matchesSearch && matchesLevel && matchesIndustry;
  });

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
              href="/dashboard/applications"
              className="text-slate-600 hover:text-slate-900"
            >
              Applications
            </Link>
            <Link
              href="/dashboard/resume-builder"
              className="text-slate-600 hover:text-slate-900"
            >
              Resume
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Internship Discovery
          </h1>
          <p className="text-lg text-slate-600">
            Find your next opportunity from {internships.length} available
            positions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search by role or company
              </label>
              <input
                type="text"
                placeholder="Frontend Developer, DataStack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Industry
              </label>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Data Science">Data Science</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition group"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Job Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition">
                          {job.role}
                        </h3>
                        <p className="text-lg text-slate-600">{job.company}</p>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-lg transition ${
                          savedJobs[job.id]
                            ? "bg-teal-100 text-teal-600"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {savedJobs[job.id] ? "💾" : "🔖"}
                      </button>
                    </div>

                    <p className="text-slate-600 mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Location</p>
                        <p className="font-semibold text-slate-900">
                          {job.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Stipend</p>
                        <p className="font-semibold text-slate-900">
                          {job.stipend}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Level</p>
                        <p className="font-semibold text-slate-900 capitalize">
                          {job.level}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Applications</p>
                        <p className="font-semibold text-slate-900">
                          {job.applicants}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col justify-between">
                    <div></div>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">
                No internships found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center py-8 text-slate-600">
          Showing {filtered.length} of {internships.length} internships
        </div>
      </div>
    </div>
  );
}
