import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <Link href="/" className="inline-block mb-6 text-pink-400 hover:text-pink-300 transition">
          ← Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <p className="text-gray-400 mb-8">Last Updated: February 28, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Agreement */}
          <section className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-3">⚠️ Important Notice</h2>
            <p className="text-white font-semibold mb-2">
              PulseMate is an ADULT-ORIENTED platform for users 18 years of age or older.
            </p>
            <p>
              By accessing or using PulseMate, you affirm that you are at least 18 years old and have the legal 
              capacity to enter into these Terms of Service. If you are under 18, you must immediately leave this website.
            </p>
          </section>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              Welcome to PulseMate! These Terms of Service ("Terms") govern your access to and use of PulseMate's 
              website, services, and AI companion platform (collectively, the "Service"). 
            </p>
            <p className="mt-3">
              By creating an account, accessing, or using the Service, you agree to be bound by these Terms and our 
              <Link href="/legal/privacy-policy" className="text-pink-400 hover:underline ml-1">Privacy Policy</Link>. 
              If you do not agree, you must not use the Service.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Eligibility</h2>
            <p>To use PulseMate, you must:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li className="text-white font-semibold">Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding contract</li>
              <li>Not be prohibited from accessing the Service under applicable laws</li>
              <li>Comply with the laws of your jurisdiction regarding adult content</li>
              <li>Provide accurate and complete registration information</li>
            </ul>
            <p className="mt-4 text-red-400 font-semibold">
              We reserve the right to verify your age at any time. False representation of your age will result 
              in immediate account termination.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">3.1 Account Creation</h3>
            <p>
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your password and account. We are not 
              liable for any loss or damage arising from your failure to protect your account information.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these Terms, 
              illegal activity, or at our sole discretion. You may also delete your account at any time through 
              account settings.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Service Description</h2>
            <p>
              PulseMate provides AI-powered companion chat services featuring virtual characters. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
              <li>Interactive conversations with AI companions</li>
              <li>Multiple conversation modes (Main Story, Sex Chat, Date)</li>
              <li>Pay-per-view (PPV) photo content</li>
              <li>Virtual currency system (Gems)</li>
              <li>Quest and achievement systems</li>
              <li>Gallery and content collections</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">4.1 AI-Generated Content</h3>
            <p>
              <strong className="text-white">All AI companions are fictional characters.</strong> Their responses 
              are generated by artificial intelligence and do not represent real people. Conversations are simulated 
              and should not be considered advice, counseling, or professional guidance.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">4.2 Adult Content</h3>
            <p className="text-white">
              PulseMate contains adult-oriented content including suggestive dialogue, flirtation, and adult imagery. 
              By using the Service, you acknowledge and accept exposure to such content.
            </p>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Payment Terms</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.1 Virtual Currency (Gems)</h3>
            <p>
              PulseMate uses a virtual currency called "Gems" to access premium content. Gems can be purchased 
              using cryptocurrency through our payment processor, NOWPayments.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Gems have no cash value and cannot be exchanged for real currency</li>
              <li>Gems are non-transferable between accounts</li>
              <li>Unused Gems do not expire</li>
              <li>Gem balances are tied to your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.2 Cryptocurrency Payments</h3>
            <p>
              We accept cryptocurrency payments via NOWPayments (supporting 200+ cryptocurrencies including Bitcoin, 
              Ethereum, USDT, and more). By making a payment:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>You authorize the payment amount in your chosen cryptocurrency</li>
              <li>Payments are processed by NOWPayments (third-party processor)</li>
              <li>Transaction fees may apply (blockchain network fees)</li>
              <li>Payment confirmation may take several minutes depending on blockchain</li>
              <li>You are responsible for ensuring correct wallet addresses</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.3 Pricing</h3>
            <p>
              All prices are displayed in USD and converted to cryptocurrency at current market rates. Prices may 
              change at any time without notice. Cryptocurrency conversion rates are determined by NOWPayments at 
              the time of transaction.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.4 Refund Policy</h3>
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-4 mt-3">
              <p className="text-white font-semibold">
                ALL CRYPTOCURRENCY PAYMENTS ARE FINAL AND NON-REFUNDABLE.
              </p>
              <p className="mt-2">
                Due to the nature of blockchain technology and digital content delivery, we cannot process refunds 
                once Gems have been credited to your account or content has been unlocked. Please review your 
                purchase carefully before completing payment.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">5.5 Failed Transactions</h3>
            <p>
              If a payment fails or is incomplete:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>No Gems will be credited to your account</li>
              <li>Contact our support if funds were deducted but Gems not received</li>
              <li>Provide transaction ID for investigation</li>
              <li>Resolution may take 24-48 hours</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. User Conduct and Prohibited Activities</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Use the Service if you are under 18 years of age</li>
              <li>Attempt to hack, exploit, or reverse-engineer the Service</li>
              <li>Use automated tools (bots, scrapers) to access the Service</li>
              <li>Share your account credentials with others</li>
              <li>Circumvent payment systems or attempt to obtain Gems fraudulently</li>
              <li>Upload or transmit viruses, malware, or harmful code</li>
              <li>Harass, abuse, or threaten other users or our staff</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Create multiple accounts to abuse promotions or features</li>
              <li>Attempt to impersonate other users or PulseMate staff</li>
              <li>Extract, scrape, or redistribute content without permission</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
            
            <p className="mt-4 text-red-400 font-semibold">
              Violation of these rules may result in immediate account termination and forfeiture of all Gems 
              without refund.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">7.1 Our Content</h3>
            <p>
              All content on PulseMate, including AI character designs, dialogue scripts, images, graphics, logos, 
              text, software, and source code, is owned by or licensed to PulseMate and protected by copyright, 
              trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">7.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the 
              Service for personal, non-commercial use. This license does not include the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Download, copy, or redistribute content (except for personal viewing)</li>
              <li>Modify, adapt, or create derivative works</li>
              <li>Use content for commercial purposes</li>
              <li>Remove or alter copyright notices</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">7.3 User Content</h3>
            <p>
              While you retain ownership of any content you submit (profile information, feedback), you grant us a 
              worldwide, royalty-free license to use, display, and process such content to provide and improve the Service.
            </p>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <Link href="/legal/privacy-policy" className="text-pink-400 hover:underline ml-1">Privacy Policy</Link>, 
              which is incorporated into these Terms by reference.
            </p>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">8.1 Chat Data</h3>
            <p>
              Your conversations with AI companions are stored securely to provide conversation continuity. We do not:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Share your private conversations with third parties</li>
              <li>Sell your chat data</li>
              <li>Use your conversations for advertising</li>
            </ul>
            <p className="mt-3">
              We may analyze aggregate, anonymized chat data to improve AI responses and user experience.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.1 Service "As Is"</h3>
            <div className="bg-gray-800/40 border border-gray-600 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
              </p>
              <p>
                We do not guarantee that the Service will be uninterrupted, error-free, secure, or free of viruses. 
                We disclaim all warranties, express or implied, including warranties of merchantability, fitness for 
                a particular purpose, and non-infringement.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.2 No Professional Advice</h3>
            <p className="text-white">
              <strong>PulseMate is for entertainment purposes only.</strong> AI companions do not provide professional 
              advice, therapy, counseling, or medical guidance. Do not rely on AI responses for critical decisions. 
              If you need professional help, consult qualified professionals.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.3 Third-Party Services</h3>
            <p>
              The Service integrates with third-party providers (Clerk, Supabase, NOWPayments, Cloudinary). We are 
              not responsible for their performance, availability, or data practices. Your use of these services is 
              subject to their respective terms and policies.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.4 Limitation of Liability</h3>
            <div className="bg-gray-800/40 border border-gray-600 rounded-xl p-4 mt-3">
              <p className="text-white font-semibold mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PULSEMATE SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages arising from use or inability to use the Service</li>
                <li>Unauthorized access to your account or data</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="mt-3">
                Our total liability shall not exceed the amount you paid to PulseMate in the 12 months preceding 
                the claim, or $100, whichever is greater.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless PulseMate, its officers, directors, employees, and 
              agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Your use of the Service</li>
              <li>Violation of these Terms</li>
              <li>Violation of any law or third-party rights</li>
              <li>Your content or account activity</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. Modifications to Service and Terms</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">11.1 Service Changes</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without 
              notice. We are not liable for any modification, suspension, or discontinuation.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">11.2 Terms Updates</h3>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by posting a notice 
              on the website or sending an email. Your continued use of the Service after changes take effect 
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">12. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">12.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">12.2 Informal Resolution</h3>
            <p>
              Before filing a claim, you agree to contact us at <a href="mailto:support@pulsemate-ai.com" className="text-pink-400 hover:underline">support@pulsemate-ai.com</a> to 
              attempt to resolve the dispute informally for at least 30 days.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">12.3 Arbitration</h3>
            <p>
              If informal resolution fails, disputes shall be resolved through binding arbitration rather than in court, 
              except where prohibited by law.
            </p>
          </section>

          {/* General */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">13. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">13.1 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement 
              between you and PulseMate regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">13.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain 
              in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">13.3 Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such 
              right or provision.
            </p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">13.4 Assignment</h3>
            <p>
              You may not assign or transfer these Terms without our written consent. We may assign our rights 
              and obligations without restriction.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">14. Contact Information</h2>
            <p>For questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-2 mt-3 ml-4">
              <li><strong>Email:</strong> <a href="mailto:legal@pulsemate-ai.com" className="text-pink-400 hover:underline">legal@pulsemate-ai.com</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@pulsemate-ai.com" className="text-pink-400 hover:underline">support@pulsemate-ai.com</a></li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-3">Your Acknowledgment</h2>
            <p className="text-white mb-3">
              BY USING PULSEMATE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE 
              TERMS OF SERVICE.
            </p>
            <p className="text-pink-400 font-semibold">
              You confirm that you are 18 years of age or older and legally able to enter into this agreement.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-purple-500/30 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/privacy-policy" className="text-pink-400 hover:text-pink-300 transition">
              Privacy Policy
            </Link>
            <Link href="/legal/cookie-policy" className="text-pink-400 hover:text-pink-300 transition">
              Cookie Policy
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
