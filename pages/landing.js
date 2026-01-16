import Link from "next/link";
import { useState } from "react";
import Button from "../components/Button";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent">
            CareerLaunch
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <button className="px-4 py-2 text-slate-700 hover:text-teal-600 transition">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-lg hover:shadow-lg transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Your Career Launch Starts Here
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              From internship discovery to job placement, we guide every step of
              your professional journey with AI-powered tools and expert
              coaching.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard/resume-builder" className="flex-1">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-semibold hover:shadow-xl transition transform hover:-translate-y-1">
                  ✨ Build Your Resume
                </button>
              </Link>
              <Link href="/dashboard/internships" className="flex-1">
                <button className="w-full px-8 py-4 bg-teal-50 text-teal-700 border-2 border-teal-200 rounded-xl font-semibold hover:bg-teal-100 transition">
                  🚀 Find Internships Now
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="bg-white/60 backdrop-blur p-4 rounded-lg border border-slate-200/50">
                <div className="text-2xl font-bold text-slate-700">500+</div>
                <div className="text-sm text-slate-600">Internships</div>
              </div>
              <div className="bg-white/60 backdrop-blur p-4 rounded-lg border border-slate-200/50">
                <div className="text-2xl font-bold text-slate-700">10k+</div>
                <div className="text-sm text-slate-600">Users Placed</div>
              </div>
              <div className="bg-white/60 backdrop-blur p-4 rounded-lg border border-slate-200/50">
                <div className="text-2xl font-bold text-slate-700">95%</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-200/20 to-slate-200/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur border border-slate-200/50 rounded-3xl p-8 shadow-2xl">
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-16 bg-gradient-to-br from-teal-100 to-slate-100 rounded-lg mt-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-100 rounded"></div>
                    <div className="h-8 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive tools for your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "Resume Builder",
                desc: "Professional templates with AI-powered suggestions",
                color: "from-blue-500/10 to-blue-600/5",
              },
              {
                icon: "🔍",
                title: "Internship Discovery",
                desc: "Find roles matching your skills and interests",
                color: "from-teal-500/10 to-teal-600/5",
              },
              {
                icon: "📋",
                title: "Application Tracker",
                desc: "Manage all applications in one place",
                color: "from-purple-500/10 to-purple-600/5",
              },
              {
                icon: "🎤",
                title: "Mock Interviews",
                desc: "Practice with AI coaching and real feedback",
                color: "from-orange-500/10 to-orange-600/5",
              },
              {
                icon: "📊",
                title: "Skill Analyzer",
                desc: "Identify gaps and personalized learning paths",
                color: "from-green-500/10 to-green-600/5",
              },
              {
                icon: "🏆",
                title: "Career Milestones",
                desc: "Track progress toward your goals",
                color: "from-rose-500/10 to-rose-600/5",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur border border-slate-200/50 rounded-2xl p-8 hover:shadow-lg transition group`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">
            Your Success Path
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Build Profile",
                desc: "Create your resume and showcase skills",
              },
              {
                step: "2",
                title: "Discover Roles",
                desc: "Find internships matched to you",
              },
              {
                step: "3",
                title: "Prepare",
                desc: "Practice interviews with AI coaching",
              },
              {
                step: "4",
                title: "Get Placed",
                desc: "Land your dream opportunity",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white border-2 border-teal-200 rounded-2xl p-8 text-center hover:border-teal-400 transition">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-16 -right-8 text-teal-400 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-700 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students building successful careers
          </p>
          <Link href="/auth/signup">
            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:shadow-xl transition transform hover:-translate-y-1">
              Start Your Journey Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-slate-200/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-600">
          <p>&copy; 2026 CareerLaunch. Helping you succeed.</p>
        </div>
      </footer>
    </div>
  );
}
