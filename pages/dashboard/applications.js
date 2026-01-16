import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ApplicationTracker() {
  const { data: session } = useSession();
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock applications data
  const applications = [
    {
      id: 1,
      company: "TechCorp",
      role: "Frontend Developer Intern",
      status: "pending",
      appliedDate: "2024-01-15",
      notes: "Waiting for response",
      color: "blue",
    },
    {
      id: 2,
      company: "DataStack",
      role: "Data Analyst Intern",
      status: "interviewed",
      appliedDate: "2024-01-10",
      notes: "First round interview completed",
      color: "purple",
    },
    {
      id: 3,
      company: "CloudSys",
      role: "Backend Engineer Intern",
      status: "rejected",
      appliedDate: "2024-01-08",
      notes: "Selected other candidate",
      color: "red",
    },
    {
      id: 4,
      company: "FinanceAI",
      role: "ML Engineer Intern",
      status: "offered",
      appliedDate: "2024-01-05",
      notes: "Offer pending acceptance",
      color: "green",
    },
    {
      id: 5,
      company: "DesignStudio",
      role: "UI/UX Designer Intern",
      status: "pending",
      appliedDate: "2024-01-12",
      notes: "Portfolio under review",
      color: "blue",
    },
    {
      id: 6,
      company: "InnovateLabs",
      role: "Full Stack Developer Intern",
      status: "interviewed",
      appliedDate: "2024-01-03",
      notes: "Technical assessment scheduled",
      color: "purple",
    },
  ];

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    interviewed: applications.filter((a) => a.status === "interviewed").length,
    offered: applications.filter((a) => a.status === "offered").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
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
              href="/dashboard/internships"
              className="text-slate-600 hover:text-slate-900"
            >
              Find Jobs
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
            Application Tracker
          </h1>
          <p className="text-lg text-slate-600">
            Track all your internship applications and interviews
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "from-slate-500/10 to-slate-600/5",
              icon: "📋",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "from-blue-500/10 to-blue-600/5",
              icon: "⏳",
            },
            {
              label: "Interviewed",
              value: stats.interviewed,
              color: "from-purple-500/10 to-purple-600/5",
              icon: "🎤",
            },
            {
              label: "Offered",
              value: stats.offered,
              color: "from-green-500/10 to-green-600/5",
              icon: "🎉",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              color: "from-red-500/10 to-red-600/5",
              icon: "❌",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur border border-slate-200/50 rounded-xl p-4 text-center hover:shadow-md transition`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Interviewed", value: "interviewed" },
            { label: "Offered", value: "offered" },
            { label: "Rejected", value: "rejected" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                filterStatus === tab.value
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-teal-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((app) => {
              const statusColors = {
                pending: "bg-blue-50 border-blue-200",
                interviewed: "bg-purple-50 border-purple-200",
                offered: "bg-green-50 border-green-200",
                rejected: "bg-red-50 border-red-200",
              };

              const statusBadgeColors = {
                pending: "bg-blue-100 text-blue-700",
                interviewed: "bg-purple-100 text-purple-700",
                offered: "bg-green-100 text-green-700",
                rejected: "bg-red-100 text-red-700",
              };

              const statusEmoji = {
                pending: "⏳",
                interviewed: "🎤",
                offered: "🎉",
                rejected: "❌",
              };

              return (
                <div
                  key={app.id}
                  className={`border-2 rounded-2xl p-6 transition hover:shadow-lg ${
                    statusColors[app.status]
                  }`}
                >
                  <div className="grid md:grid-cols-3 gap-6 items-start">
                    {/* Company & Role */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {app.company}
                          </h3>
                          <p className="text-lg text-slate-600">{app.role}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full font-semibold ${
                            statusBadgeColors[app.status]
                          } flex items-center gap-2`}
                        >
                          {statusEmoji[app.status]} {app.status}
                        </span>
                      </div>

                      <p className="text-slate-700 mb-4">{app.notes}</p>

                      <div className="flex gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Applied</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Days Ago</p>
                          <p className="font-semibold text-slate-900">
                            {Math.floor(
                              (new Date() - new Date(app.appliedDate)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-md transition font-semibold">
                        View Details
                      </button>
                      {app.status === "pending" && (
                        <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold">
                          Edit Status
                        </button>
                      )}
                      {app.status === "interviewed" && (
                        <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold">
                          Schedule Follow-up
                        </button>
                      )}
                      {app.status === "offered" && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
                          Accept Offer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/50">
              <p className="text-xl text-slate-600 mb-4">
                No applications found
              </p>
              <Link href="/dashboard/internships">
                <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg">
                  Browse Internships
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
