import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
          <p className="text-gray-400 mb-6">Last Updated: January 24, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email address, username, and profile information</li>
              <li><strong>Usage Data:</strong> Chat history, gallery unlocks, gem transactions</li>
              <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
              <li><strong>Payment Information:</strong> Processed securely by our payment providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide and maintain the PulseMate platform</li>
              <li>Process transactions and manage your gem balance</li>
              <li>Personalize your experience and save your progress</li>
              <li>Send important notifications about your account</li>
              <li>Improve our services and develop new features</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">3. Data Storage and Security</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data is stored securely using industry-standard encryption. Progress data 
              is stored locally on your device and synced to our servers. We implement 
              appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">4. Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, remember 
              your preferences, and analyze platform usage. You can control cookie settings 
              through your browser preferences. Essential cookies required for platform 
              functionality cannot be disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use trusted third-party services for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Authentication (Clerk)</li>
              <li>Payment processing (Stripe)</li>
              <li>Image/video hosting (Cloudinary)</li>
              <li>Analytics and error tracking</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              These services have access to limited data necessary to perform their functions 
              and are obligated to protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Export your data (available in Profile settings)</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your data as long as your account is active or as needed to provide 
              services. You can request account deletion at any time through your Profile 
              settings. Some data may be retained for legal compliance or legitimate business 
              purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              PulseMate is strictly for users 18 years and older. We do not knowingly collect 
              information from anyone under 18. If we discover that a minor has provided us 
              with personal information, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">9. International Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information during 
              such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pink-400 mb-4">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at:{" "}
              <a href="mailto:privacy@pulsemate.ai" className="text-pink-400 hover:underline">
                privacy@pulsemate.ai
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
