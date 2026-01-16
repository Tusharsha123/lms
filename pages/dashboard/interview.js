import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function InterviewPractice() {
  const { data: session } = useSession();
  const [mode, setMode] = useState("practice");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const interviewQuestions = [
    {
      id: 1,
      category: "Behavioral",
      question:
        "Tell me about a time when you had to work with a difficult team member.",
      tips: ["Use STAR method", "Focus on resolution", "Highlight teamwork"],
      sampleAnswer:
        "In my previous project, I worked with a team member who had different communication styles...",
    },
    {
      id: 2,
      category: "Technical",
      question:
        "Explain the difference between let, const, and var in JavaScript.",
      tips: ["Discuss scope", "Mention hoisting", "Explain use cases"],
      sampleAnswer:
        "Let and const are block-scoped, while var is function-scoped. Const variables cannot be reassigned...",
    },
    {
      id: 3,
      category: "Behavioral",
      question: "Describe your biggest professional achievement.",
      tips: ["Quantify results", "Show impact", "Highlight learning"],
      sampleAnswer:
        "I led a project to optimize our database queries, which resulted in 40% faster load times...",
    },
    {
      id: 4,
      category: "Technical",
      question: "What is the time complexity of a binary search algorithm?",
      tips: [
        "Explain O(log n)",
        "Compare with linear search",
        "Discuss trade-offs",
      ],
      sampleAnswer:
        "Binary search has O(log n) time complexity because it eliminates half the data with each iteration...",
    },
    {
      id: 5,
      category: "General",
      question: "Why are you interested in this internship?",
      tips: ["Research company", "Align with goals", "Show enthusiasm"],
      sampleAnswer:
        "I'm excited about your work in AI and machine learning. Your company's innovative approach to...",
    },
  ];

  const interviewSessions = [
    {
      id: 1,
      title: "Behavioral Interview 101",
      difficulty: "Beginner",
      duration: "15 min",
      icon: "🎤",
    },
    {
      id: 2,
      title: "Technical Deep Dive",
      difficulty: "Intermediate",
      duration: "20 min",
      icon: "💻",
    },
    {
      id: 3,
      title: "FAANG Prep",
      difficulty: "Advanced",
      duration: "30 min",
      icon: "🚀",
    },
    {
      id: 4,
      title: "Startup Focus",
      difficulty: "Intermediate",
      duration: "25 min",
      icon: "🚀",
    },
  ];

  const previousAttempts = [
    {
      id: 1,
      title: "Behavioral Interview 101",
      score: 82,
      date: "Jan 15",
      feedback: "Good answers, work on confidence",
    },
    {
      id: 2,
      title: "Technical Deep Dive",
      score: 76,
      date: "Jan 10",
      feedback: "Solid technical knowledge",
    },
    {
      id: 3,
      title: "FAANG Prep",
      score: 68,
      date: "Jan 05",
      feedback: "Need more practice on edge cases",
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

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleSubmitAnswer = () => {
    setFeedback({
      score: Math.floor(Math.random() * 20) + 75,
      comments:
        "Your answer demonstrates solid understanding. Try to include more specific examples.",
      strengths: ["Clear structure", "Good pacing"],
      improvements: ["Add more technical details", "Include metrics"],
    });
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
            Mock Interview Practice
          </h1>
          <p className="text-lg text-slate-600">
            Practice interviews with AI coaching and real feedback
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-8">
          {[
            { mode: "sessions", label: "Interview Sessions" },
            { mode: "practice", label: "Random Questions" },
            { mode: "history", label: "Practice History" },
          ].map((m) => (
            <button
              key={m.mode}
              onClick={() => setMode(m.mode)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                mode === m.mode
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Interview Sessions */}
        {mode === "sessions" && (
          <div className="grid md:grid-cols-2 gap-6">
            {interviewSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl mb-2">{session.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition">
                      {session.title}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      session.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : session.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {session.difficulty}
                  </span>
                </div>
                <p className="text-slate-600 mb-4">
                  {session.duration} interview
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-600">Topics covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Communication",
                      "Problem Solving",
                      "Technical Skills",
                    ].map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Random Questions Practice */}
        {mode === "practice" && (
          <div className="bg-white border border-slate-200/50 rounded-2xl p-8">
            {!feedback ? (
              <div className="space-y-8">
                {/* Question */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full font-semibold mb-3">
                        {interviewQuestions[currentQuestion].category}
                      </span>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {interviewQuestions[currentQuestion].question}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Question</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {currentQuestion + 1} / {interviewQuestions.length}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / interviewQuestions.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    {interviewQuestions[currentQuestion].tips.map(
                      (tip, idx) => (
                        <li key={idx}>{tip}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* Recording Area */}
                <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-dashed border-slate-300">
                  <div className="mb-6">
                    <button
                      onClick={handleRecordToggle}
                      className={`px-8 py-4 rounded-full font-bold text-lg transition transform ${
                        isRecording
                          ? "bg-red-500 text-white hover:bg-red-600 hover:scale-105"
                          : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg"
                      }`}
                    >
                      {isRecording ? "⏹️ Stop Recording" : "🎤 Start Recording"}
                    </button>
                  </div>
                  {isRecording && (
                    <div className="flex justify-center items-center gap-2 text-red-500 font-semibold">
                      <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                      Recording in progress...
                    </div>
                  )}
                </div>

                {/* Sample Answer */}
                <div className="bg-slate-100 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    📝 Sample Answer
                  </h3>
                  <p className="text-slate-700">
                    {interviewQuestions[currentQuestion].sampleAnswer}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    ✅ Submit Answer
                  </button>
                  <button
                    disabled={currentQuestion === interviewQuestions.length - 1}
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600 mb-2">
                    {feedback.score}%
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Great effort!
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                    <h3 className="font-bold text-green-900 mb-3">
                      ✅ Strengths
                    </h3>
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-800">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded">
                    <h3 className="font-bold text-orange-900 mb-3">
                      🎯 Areas to Improve
                    </h3>
                    <ul className="space-y-2">
                      {feedback.improvements.map((improve, idx) => (
                        <li key={idx} className="text-orange-800">
                          • {improve}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-blue-900">
                    <strong>Feedback:</strong> {feedback.comments}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setFeedback(null);
                      setCurrentQuestion(0);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Try Another Question
                  </button>
                  <Link href="/dashboard">
                    <button className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice History */}
        {mode === "history" && (
          <div className="space-y-4">
            {previousAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {attempt.title}
                  </h3>
                  <p className="text-slate-600 mb-2">{attempt.date}</p>
                  <p className="text-slate-700 text-sm">{attempt.feedback}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                    {attempt.score}%
                  </div>
                  <button className="mt-4 px-6 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold hover:bg-teal-200 transition">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
