"use client";

import { useState } from "react";
import Link from "next/link";

const issueTypes = [
  { id: "bug", label: "Bug / Technical Issue", icon: "🐛" },
  { id: "content", label: "Content Problem", icon: "🖼️" },
  { id: "payment", label: "Payment Issue", icon: "💳" },
  { id: "account", label: "Account Access", icon: "🔐" },
  { id: "chat", label: "Chat Not Working", icon: "💬" },
  { id: "other", label: "Other", icon: "📋" },
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    email: "",
    severity: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Report form error:', error);
      alert('Failed to submit report. Please try again or email us directly.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
        <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <Link href="/dashboard" className="text-pink-400 hover:text-pink-300 transition">
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold mb-4">Report Submitted!</h1>
            <p className="text-gray-400 mb-4">
              Thank you for helping us improve PulseMate.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Report ID: #{Date.now().toString().slice(-6)}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition"
              >
                Submit Another
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Report an Issue
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
          <p className="text-gray-400 mb-8 text-center">
            Found a bug or having trouble? Let us know and we'll fix it as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                What type of issue are you experiencing?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {issueTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, issueType: type.id }))}
                    className={`p-4 rounded-xl border transition text-left ${
                      formData.issueType === type.id
                        ? "border-pink-500 bg-pink-500/20"
                        : "border-purple-500/30 hover:border-purple-500/60 bg-black/30"
                    }`}
                  >
                    <span className="text-2xl mr-2">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                How severe is this issue?
              </label>
              <div className="flex gap-3">
                {[
                  { id: "low", label: "Low", desc: "Minor inconvenience" },
                  { id: "medium", label: "Medium", desc: "Affects functionality" },
                  { id: "high", label: "High", desc: "Can't use platform" },
                ].map((sev) => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: sev.id }))}
                    className={`flex-1 p-4 rounded-xl border transition ${
                      formData.severity === sev.id
                        ? sev.id === "high"
                          ? "border-red-500 bg-red-500/20"
                          : sev.id === "medium"
                          ? "border-yellow-500 bg-yellow-500/20"
                          : "border-green-500 bg-green-500/20"
                        : "border-purple-500/30 hover:border-purple-500/60 bg-black/30"
                    }`}
                  >
                    <div className="font-bold">{sev.label}</div>
                    <div className="text-xs text-gray-400">{sev.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Describe the issue in detail
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-pink-500 focus:outline-none transition resize-none"
                placeholder="Please include:&#10;- What you were trying to do&#10;- What happened instead&#10;- Steps to reproduce the issue"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Your Email (for updates)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-pink-500 focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.issueType}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting Report..." : "Submit Report"}
            </button>

            <p className="text-center text-sm text-gray-500">
              You can also email us directly at{" "}
              <a href="mailto:support@pulsemate.ai" className="text-pink-400 hover:underline">
                support@pulsemate.ai
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30">
        <p>© 2026 PulseMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
