import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CareerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to login if not authenticated
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
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent">
              CareerDash
            </h1>
            <p className="text-sm text-slate-600">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 bg-slate-100 rounded-full hover:bg-slate-200 transition flex items-center justify-center">
              🔔
            </button>
            <button className="w-10 h-10 bg-teal-100 rounded-full hover:bg-teal-200 transition flex items-center justify-center text-sm font-bold text-teal-700">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Applications",
              value: "12",
              icon: "📋",
              color: "from-blue-500/10 to-blue-600/5",
            },
            {
              label: "Saved Jobs",
              value: "28",
              icon: "💼",
              color: "from-teal-500/10 to-teal-600/5",
            },
            {
              label: "Interviews",
              value: "3",
              icon: "🎤",
              color: "from-purple-500/10 to-purple-600/5",
            },
            {
              label: "Offers",
              value: "1",
              icon: "🏆",
              color: "from-orange-500/10 to-orange-600/5",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Main Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "📄",
                  title: "Resume",
                  href: "/dashboard/resume-builder",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: "🔍",
                  title: "Find Jobs",
                  href: "/dashboard/internships",
                  color: "from-teal-500 to-teal-600",
                },
                {
                  icon: "📝",
                  title: "Applications",
                  href: "/dashboard/applications",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: "🎤",
                  title: "Interview Prep",
                  href: "/dashboard/interview",
                  color: "from-orange-500 to-orange-600",
                },
              ].map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <button
                    className={`w-full p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:shadow-lg transition transform hover:-translate-y-1`}
                  >
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <div className="font-semibold">{action.title}</div>
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Career Progress
            </h2>
            <div className="space-y-4">
              {[
                { label: "Profile Completion", value: 85 },
                { label: "Resume Ready", value: 100 },
                { label: "Job Search Activity", value: 60 },
              ].map((progress, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {progress.label}
                    </span>
                    <span className="text-sm font-semibold text-teal-600">
                      {progress.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
                      style={{ width: `${progress.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Recent Applications
            </h3>
            <div className="space-y-3">
              {[
                {
                  company: "TechCorp",
                  role: "Frontend Intern",
                  status: "pending",
                  date: "2 days ago",
                },
                {
                  company: "DataStack",
                  role: "Data Analyst Intern",
                  status: "interviewed",
                  date: "1 week ago",
                },
                {
                  company: "CloudSys",
                  role: "Backend Intern",
                  status: "rejected",
                  date: "2 weeks ago",
                },
              ].map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {app.company}
                    </p>
                    <p className="text-sm text-slate-600">{app.role}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                        app.status === "pending"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "interviewed"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                    <p className="text-xs text-slate-600">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/applications">
              <button className="w-full mt-4 py-2 text-teal-600 hover:text-teal-700 font-semibold">
                View All →
              </button>
            </Link>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Recommended for You
            </h3>
            <div className="space-y-3">
              {[
                {
                  company: "InnovateLabs",
                  role: "Full Stack Intern",
                  match: 92,
                },
                {
                  company: "StartupXYZ",
                  role: "React Developer Intern",
                  match: 88,
                },
                { company: "TechVenture", role: "DevOps Intern", match: 85 },
              ].map((job, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-slate-200 rounded-lg hover:border-teal-400 transition group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition">
                        {job.company}
                      </p>
                      <p className="text-sm text-slate-600">{job.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">
                        {job.match}%
                      </div>
                      <div className="text-xs text-slate-500">Match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/internships">
              <button className="w-full mt-4 py-2 text-teal-600 hover:text-teal-700 font-semibold">
                Explore More →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
