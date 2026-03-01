import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
          <p className="text-gray-400 mb-6">Last Updated: January 24, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using PulseMate, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform. You must be 
              at least 18 years old to use PulseMate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">2. Age Restriction</h2>
            <p className="text-gray-300 leading-relaxed">
              PulseMate contains adult content and is strictly for users 18 years of age or older. 
              By creating an account, you confirm that you are at least 18 years old and have the 
              legal right to access adult content in your jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">3. Account Registration</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">4. Virtual Currency</h2>
            <p className="text-gray-300 leading-relaxed">
              Gems are virtual currency used on PulseMate. Purchases of gems are final and 
              non-refundable except as required by law. Gems have no real-world value and 
              cannot be exchanged for cash. We reserve the right to modify gem pricing 
              and availability at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">5. Content and Conduct</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Share account access with others</li>
              <li>Attempt to reverse engineer or hack the platform</li>
              <li>Use automated systems or bots</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Distribute content from the platform without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on PulseMate, including images, videos, text, and software, is 
              protected by copyright and other intellectual property laws. Users receive 
              a limited license to access content for personal use only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">7. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms 
              or for any other reason at our discretion. Upon termination, your right to 
              use the platform immediately ceases.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">8. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              PulseMate is provided "as is" without warranties of any kind. We do not 
              guarantee uninterrupted access or that the platform will be error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these terms at any time. Continued use of the platform after 
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pink-400 mb-4">10. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@pulsemate.ai" className="text-pink-400 hover:underline">
                support@pulsemate.ai
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30">
        <p>© 2026 PulseMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
