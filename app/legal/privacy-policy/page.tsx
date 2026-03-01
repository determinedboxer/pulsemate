import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <Link href="/" className="inline-block mb-6 text-pink-400 hover:text-pink-300 transition">
          ← Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <p className="text-gray-400 mb-8">Last Updated: February 28, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to PulseMate ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our AI companion services. 
              <strong className="text-pink-400"> PulseMate is an adult-oriented platform for users 18 years and older.</strong>
            </p>
            <p className="mt-3">
              By using PulseMate, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Account information (email address, username, password)</li>
              <li>Profile information (optional display name, preferences)</li>
              <li>Payment information (cryptocurrency wallet addresses, transaction IDs)</li>
              <li>Communication data (chat messages with AI companions, support inquiries)</li>
              <li>Age verification confirmation (18+ acknowledgment)</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <p>When you access our services, we automatically collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Session information and authentication tokens</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">2.3 Chat Content</h3>
            <p>
              Your conversations with AI companions are stored to provide continuity in your experience. 
              <strong className="text-white"> All chat content is encrypted and stored securely.</strong> We do not 
              share, sell, or use your private conversations for any purpose other than providing and improving the service.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Provide, maintain, and improve our AI companion services</li>
              <li>Process your transactions and manage your virtual currency (gems)</li>
              <li>Send you technical notices, updates, and security alerts</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              <li>Personalize your experience with AI companions</li>
              <li>Enforce our Terms of Service and comply with legal obligations</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and store certain information. 
              You can manage your cookie preferences through our <Link href="/cookie-settings" className="text-pink-400 hover:underline">Cookie Settings</Link> page.
            </p>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">Types of Cookies We Use:</h3>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Marketing Cookies:</strong> Deliver personalized content and offers</li>
            </ul>
            
            <p className="mt-3">
              For more details, please review our <Link href="/legal/cookie-policy" className="text-pink-400 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Payment Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Payment and Transaction Data</h2>
            <p>
              PulseMate uses <strong className="text-pink-400">NOWPayments</strong> as our cryptocurrency payment processor. 
              When you make a purchase:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>We do not store your cryptocurrency wallet private keys</li>
              <li>Payment processing is handled securely by NOWPayments</li>
              <li>We store transaction IDs and payment status for order fulfillment</li>
              <li>All cryptocurrency transactions are non-refundable as per blockchain technology</li>
              <li>We retain transaction records for legal and accounting purposes</li>
            </ul>
            <p className="mt-3">
              Please review <a href="https://nowpayments.io/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">NOWPayments Privacy Policy</a> for 
              information about how they handle payment data.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. How We Share Your Information</h2>
            <p>
              <strong className="text-white">We do not sell or rent your personal information to third parties.</strong> We may share 
              your information only in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">6.1 Service Providers</h3>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li><strong>Clerk:</strong> Authentication and user management</li>
              <li><strong>Supabase:</strong> Database and backend services</li>
              <li><strong>NOWPayments:</strong> Cryptocurrency payment processing</li>
              <li><strong>Cloudinary:</strong> Image hosting and delivery</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">6.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">6.3 Business Transfers</h3>
            <p>If PulseMate is involved in a merger, acquisition, or asset sale, your information may be transferred.</p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Row-level security policies on database access</li>
              <li>Regular security audits and monitoring</li>
              <li>Secure authentication with industry-standard protocols</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
              outlined in this Privacy Policy. We will retain and use your information to the extent necessary to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
              <li>Maintain transaction records for accounting purposes</li>
            </ul>
            <p className="mt-3">
              When you delete your account, we will delete or anonymize your personal information within 30 days, 
              except where we are required to retain it for legal or security purposes.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            
            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.1 GDPR Rights (EU Users)</h3>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            </ul>

            <h3 className="text-xl font-semibold text-pink-400 mb-2 mt-4">9.2 CCPA Rights (California Users)</h3>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>

            <p className="mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@pulsemate-ai.com" className="text-pink-400 hover:underline">privacy@pulsemate-ai.com</a>
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Children's Privacy</h2>
            <p className="text-red-400 font-semibold">
              PulseMate is STRICTLY for users 18 years of age or older. We do not knowingly collect personal information 
              from anyone under 18.
            </p>
            <p className="mt-3">
              If we become aware that we have collected personal information from someone under 18, we will take steps 
              to delete that information immediately. If you believe we have collected information from a minor, 
              please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of your country, 
              where data protection laws may differ. By using PulseMate, you consent to the transfer of your 
              information to our facilities and service providers.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">12. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites (e.g., social media profiles, payment processors). 
              We are not responsible for the privacy practices of these external sites. We encourage you to review 
              their privacy policies.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">13. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="mt-3">
              You are advised to review this Privacy Policy periodically for any changes. Changes are effective 
              when posted on this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">14. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-none space-y-2 mt-3 ml-4">
              <li><strong>Email:</strong> <a href="mailto:privacy@pulsemate-ai.com" className="text-pink-400 hover:underline">privacy@pulsemate-ai.com</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@pulsemate-ai.com" className="text-pink-400 hover:underline">support@pulsemate-ai.com</a></li>
            </ul>
          </section>

          {/* Adult Content Notice */}
          <section className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-red-400 mb-3">⚠️ Adult Content Notice</h2>
            <p className="text-white">
              PulseMate contains adult-oriented content and is intended solely for users 18 years of age or older. 
              By using this service, you confirm that you are of legal age to access adult content in your jurisdiction. 
              We take age restrictions seriously and reserve the right to terminate accounts that violate this requirement.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-purple-500/30 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/legal/terms-of-service" className="text-pink-400 hover:text-pink-300 transition">
              Terms of Service
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
