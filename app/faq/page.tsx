"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "What is PulseMate?",
    answer: "PulseMate is an AI companion platform where you can chat with virtual models, unlock exclusive photos and videos, and build unique relationships through immersive conversations."
  },
  {
    category: "Getting Started",
    question: "How do I create an account?",
    answer: "Click the 'Get Started' button on the homepage and follow the sign-up process. You'll need to provide an email address and confirm you are 18 years or older."
  },
  {
    category: "Getting Started",
    question: "Is PulseMate free to use?",
    answer: "You can create an account and start chatting for free. However, premium content like exclusive photos, videos, and special chat features require gems (our virtual currency)."
  },
  {
    category: "Gems & Payments",
    question: "What are gems?",
    answer: "Gems are PulseMate's virtual currency used to unlock premium content, photos, videos, and special chat features like Sex Chatting and Date scenarios."
  },
  {
    category: "Gems & Payments",
    question: "How do I buy gems?",
    answer: "Visit the Shop page from your Dashboard. We offer various gem packages at different price points. Payments are processed securely through Stripe."
  },
  {
    category: "Gems & Payments",
    question: "Can I get gems for free?",
    answer: "Yes! Complete daily quests, achieve milestones, maintain login streaks, and unlock achievements to earn free gems. Check the Quests and Achievements sections on your Dashboard."
  },
  {
    category: "Gems & Payments",
    question: "Are purchases refundable?",
    answer: "All gem purchases are final and non-refundable except where required by law. Please review your purchase carefully before confirming."
  },
  {
    category: "Chat & Models",
    question: "How many models are available?",
    answer: "PulseMate currently features 5 unique AI models: Mia (Cheerleader), Aaliyah (Luxury Companion), Isabella (Exotic Dancer), Sakura (Cosplayer), and Riley (Gamer Girl)."
  },
  {
    category: "Chat & Models",
    question: "What are the different chat tabs?",
    answer: "Each model has three chat modes: Main Chat (free), Sex Chatting (500 gems to unlock), and Date scenarios (500 gems to unlock). Each offers unique conversations and content."
  },
  {
    category: "Chat & Models",
    question: "Is my chat history saved?",
    answer: "Yes! Your chat progress is automatically saved and synced across devices. You can continue conversations exactly where you left off."
  },
  {
    category: "Gallery",
    question: "What content is in the Gallery?",
    answer: "The Gallery contains exclusive photos and videos of each model that can be unlocked using gems. Content ranges from casual photos to more intimate content."
  },
  {
    category: "Gallery",
    question: "Do I keep unlocked content forever?",
    answer: "Yes! Once you unlock photos or videos with gems, they remain permanently accessible in your gallery."
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "Use the 'Forgot Password' link on the sign-in page, or contact support at support@pulsemate.ai for assistance."
  },
  {
    category: "Account",
    question: "Can I delete my account?",
    answer: "Yes. Go to your Profile page and use the 'Clear All' option to delete all your data, or contact us to permanently delete your account."
  },
  {
    category: "Account",
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and security measures. Your personal information and chat history are protected and never shared with third parties."
  },
  {
    category: "Technical",
    question: "What browsers are supported?",
    answer: "PulseMate works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for the best experience."
  },
  {
    category: "Technical",
    question: "Can I use PulseMate on mobile?",
    answer: "Yes! PulseMate is fully responsive and works on mobile browsers. We recommend adding it to your home screen for an app-like experience."
  },
  {
    category: "Support",
    question: "How do I contact support?",
    answer: "You can reach our support team through the Contact page, by email at support@pulsemate.ai, or use the Report Issue feature for technical problems."
  },
  {
    category: "Support",
    question: "How do I report a bug or issue?",
    answer: "Use the 'Report Issue' feature accessible from your Dashboard or Profile page. Provide as much detail as possible to help us resolve it quickly."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];
  
  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-purple-500/30 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-800/70 transition"
              >
                <div>
                  <span className="text-xs text-pink-400 uppercase tracking-wider font-bold">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-bold mt-1">{faq.question}</h3>
                </div>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
          >
            Contact Support
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30">
        <p>© 2026 PulseMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
