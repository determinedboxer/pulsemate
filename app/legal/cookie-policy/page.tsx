import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <Link href="/" className="inline-block mb-6 text-pink-400 hover:text-pink-300 transition">
          ← Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        
        <p className="text-gray-400 mb-8">Last Updated: February 28, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely 
              used to make websites work more efficiently and provide information to the website owners.
            </p>
            <p className="mt-3">
              PulseMate uses cookies and similar tracking technologies to improve your experience, analyze usage, 
              and deliver personalized content. This Cookie Policy explains what cookies we use and why.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Types of Cookies We Use</h2>
            
            {/* Essential Cookies */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Essential Cookies (Always Active)</h3>
                  <p className="text-white">
                    These cookies are necessary for the website to function and cannot be disabled in our systems.
                  </p>
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">Purpose:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Authentication and security (Clerk session cookies)</li>
                <li>Remembering your login state</li>
                <li>Session management</li>
                <li>Security token validation</li>
                <li>Form submission processing</li>
                <li>Load balancing</li>
              </ul>

              <h4 className="font-semibold text-white mb-2 mt-4">Cookies Used:</h4>
              <ul className="list-none space-y-2 ml-4 text-sm">
                <li><strong className="text-green-400">__clerk_db_jwt</strong> - Authentication token (Expires: Session)</li>
                <li><strong className="text-green-400">__session</strong> - Session identifier (Expires: 14 days)</li>
                <li><strong className="text-green-400">cookieConsent</strong> - Stores your cookie preferences (Expires: 1 year)</li>
              </ul>

              <p className="mt-4 text-sm text-gray-400">
                <strong>Legal Basis:</strong> These cookies are strictly necessary to provide services you have requested.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">⚙️</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Functional Cookies (Optional)</h3>
                  <p className="text-white">
                    These cookies enable enhanced functionality and personalization. You can manage these in your 
                    <Link href="/cookie-settings" className="text-blue-300 hover:underline ml-1">Cookie Settings</Link>.
                  </p>
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">Purpose:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Remembering your preferences (theme, language)</li>
                <li>Saving your chat history and conversation state</li>
                <li>Storing your favorite AI companions</li>
                <li>Remembering your gem balance display preferences</li>
                <li>UI customization settings</li>
              </ul>

              <h4 className="font-semibold text-white mb-2 mt-4">Cookies Used:</h4>
              <ul className="list-none space-y-2 ml-4 text-sm">
                <li><strong className="text-blue-400">chat_history_*</strong> - Stores conversation data (Expires: 30 days)</li>
                <li><strong className="text-blue-400">user_preferences</strong> - UI and feature preferences (Expires: 1 year)</li>
                <li><strong className="text-blue-400">last_model_visited</strong> - Last AI companion chatted with (Expires: 7 days)</li>
              </ul>

              <p className="mt-4 text-sm text-gray-400">
                <strong>Legal Basis:</strong> Consent (you can opt-out in Cookie Settings).
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Analytics Cookies (Optional)</h3>
                  <p className="text-white">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously.
                  </p>
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">Purpose:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Counting visits and traffic sources</li>
                <li>Measuring page performance</li>
                <li>Understanding which features are most popular</li>
                <li>Identifying technical issues and errors</li>
                <li>Improving user experience based on usage patterns</li>
              </ul>

              <h4 className="font-semibold text-white mb-2 mt-4">Third-Party Services:</h4>
              <ul className="list-none space-y-2 ml-4 text-sm">
                <li><strong className="text-purple-400">Google Analytics</strong> (if enabled) - Web analytics (Expires: 2 years)</li>
                <li><strong className="text-purple-400">_ga</strong> - Distinguishes users (Expires: 2 years)</li>
                <li><strong className="text-purple-400">_gat</strong> - Throttles request rate (Expires: 1 minute)</li>
                <li><strong className="text-purple-400">_gid</strong> - Distinguishes users (Expires: 24 hours)</li>
              </ul>

              <p className="mt-4 text-sm text-gray-400">
                <strong>Legal Basis:</strong> Consent (you can opt-out in Cookie Settings).
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/20 border border-pink-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-2">Marketing Cookies (Optional)</h3>
                  <p className="text-white">
                    These cookies track your activity to deliver personalized advertising and content that 
                    matches your interests.
                  </p>
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">Purpose:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Showing you relevant promotional content</li>
                <li>Delivering personalized AI companion recommendations</li>
                <li>Tracking advertising campaign effectiveness</li>
                <li>Social media integration (share buttons, embeds)</li>
                <li>Retargeting advertisements</li>
              </ul>

              <h4 className="font-semibold text-white mb-2 mt-4">Third-Party Services:</h4>
              <ul className="list-none space-y-2 ml-4 text-sm">
                <li><strong className="text-pink-400">Facebook Pixel</strong> (if enabled) - Ad targeting (Expires: 90 days)</li>
                <li><strong className="text-pink-400">Twitter Pixel</strong> (if enabled) - Ad analytics (Expires: 30 days)</li>
              </ul>

              <p className="mt-4 text-sm text-gray-400">
                <strong>Legal Basis:</strong> Consent (you can opt-out in Cookie Settings).
              </p>
            </div>
          </section>

          {/* Session vs Persistent */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Session vs. Persistent Cookies</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">Session Cookies</h3>
            <p>
              These cookies are temporary and are deleted when you close your browser. They are essential for 
              navigation and basic functionality.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">Persistent Cookies</h3>
            <p>
              These cookies remain on your device until they expire or you delete them. They remember your 
              preferences and settings across multiple visits.
            </p>
          </section>

          {/* First-Party vs Third-Party */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. First-Party vs. Third-Party Cookies</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">First-Party Cookies</h3>
            <p>
              Set directly by PulseMate. These are primarily used for essential functionality and improving your 
              experience on our website.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">Third-Party Cookies</h3>
            <p>Set by external services we integrate with:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li><strong>Clerk:</strong> Authentication services</li>
              <li><strong>Google Analytics:</strong> Website analytics (if enabled)</li>
              <li><strong>Cloudinary:</strong> Image delivery optimization</li>
              <li><strong>NOWPayments:</strong> Payment processing</li>
            </ul>
          </section>

          {/* How to Manage */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. How to Manage Cookies</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.1 PulseMate Cookie Settings</h3>
            <p>
              You can manage your cookie preferences directly on our website:
            </p>
            <div className="mt-4">
              <Link 
                href="/cookie-settings"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                Manage Cookie Preferences →
              </Link>
            </div>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-6">5.2 Browser Settings</h3>
            <p>Most browsers allow you to control cookies through their settings:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
              <li>
                <strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies
              </li>
            </ul>

            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-4 mt-4">
              <p className="text-yellow-300">
                <strong>⚠️ Warning:</strong> Disabling essential cookies will prevent you from using PulseMate's 
                core features, including authentication and payment processing.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-6">5.3 Opt-Out of Analytics</h3>
            <p>To opt-out of Google Analytics across all websites:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>
                Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Do Not Track Signals</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want 
              your online activities tracked. Currently, there is no industry consensus on how to respond to DNT signals.
            </p>
            <p className="mt-3">
              PulseMate respects your privacy choices. You can manage your tracking preferences through our 
              Cookie Settings page, which provides granular control over different types of cookies.
            </p>
          </section>

          {/* Cookie Lifespan */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Cookie Lifespan Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-purple-500/30 mt-4">
                <thead>
                  <tr className="bg-purple-900/40">
                    <th className="border border-purple-500/30 p-3 text-left">Cookie Name</th>
                    <th className="border border-purple-500/30 p-3 text-left">Type</th>
                    <th className="border border-purple-500/30 p-3 text-left">Duration</th>
                    <th className="border border-purple-500/30 p-3 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-purple-500/30 p-3">__clerk_db_jwt</td>
                    <td className="border border-purple-500/30 p-3">Essential</td>
                    <td className="border border-purple-500/30 p-3">Session</td>
                    <td className="border border-purple-500/30 p-3">Authentication</td>
                  </tr>
                  <tr>
                    <td className="border border-purple-500/30 p-3">__session</td>
                    <td className="border border-purple-500/30 p-3">Essential</td>
                    <td className="border border-purple-500/30 p-3">14 days</td>
                    <td className="border border-purple-500/30 p-3">Session management</td>
                  </tr>
                  <tr>
                    <td className="border border-purple-500/30 p-3">cookieConsent</td>
                    <td className="border border-purple-500/30 p-3">Essential</td>
                    <td className="border border-purple-500/30 p-3">1 year</td>
                    <td className="border border-purple-500/30 p-3">Cookie preferences</td>
                  </tr>
                  <tr>
                    <td className="border border-purple-500/30 p-3">chat_history_*</td>
                    <td className="border border-purple-500/30 p-3">Functional</td>
                    <td className="border border-purple-500/30 p-3">30 days</td>
                    <td className="border border-purple-500/30 p-3">Chat continuity</td>
                  </tr>
                  <tr>
                    <td className="border border-purple-500/30 p-3">_ga</td>
                    <td className="border border-purple-500/30 p-3">Analytics</td>
                    <td className="border border-purple-500/30 p-3">2 years</td>
                    <td className="border border-purple-500/30 p-3">User identification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. 
              We will notify you of any significant changes by posting a notice on our website or updating the 
              "Last Updated" date at the top of this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <ul className="list-none space-y-2 mt-3 ml-4">
              <li><strong>Email:</strong> <a href="mailto:privacy@pulsemate-ai.com" className="text-pink-400 hover:underline">privacy@pulsemate-ai.com</a></li>
              <li><strong>Cookie Settings:</strong> <Link href="/cookie-settings" className="text-pink-400 hover:underline">Manage Preferences</Link></li>
            </ul>
          </section>

          {/* Quick Actions */}
          <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cookie-settings"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-center hover:brightness-110 transition"
              >
                Manage Cookie Preferences
              </Link>
              <Link 
                href="/legal/privacy-policy"
                className="px-6 py-3 bg-white/20 rounded-full font-bold text-center hover:bg-white/30 transition border border-white/30"
              >
                View Privacy Policy
              </Link>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-purple-500/30 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/privacy-policy" className="text-pink-400 hover:text-pink-300 transition">
              Privacy Policy
            </Link>
            <Link href="/legal/terms-of-service" className="text-pink-400 hover:text-pink-300 transition">
              Terms of Service
            </Link>
            <Link href="/cookie-settings" className="text-pink-400 hover:text-pink-300 transition">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
