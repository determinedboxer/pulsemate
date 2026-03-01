'use client';

import { useState } from 'react';
// import { sendWaitlistEmail } from '../src/api/resend';

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [ageAgreed, setAgeAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: Check environment variables
    console.log('=== FORM DEBUG ===');
    console.log('process.env keys (filtered):', Object.keys(process.env).filter(key => key.includes('RESEND')));
    console.log('NEXT_PUBLIC_RESEND_API_KEY:', process.env.NEXT_PUBLIC_RESEND_API_KEY || 'NOT FOUND!');
    console.log('==================');

    const email = (e.target as HTMLFormElement).email.value.trim();
    if (!email) {
      setError('Please enter email');
      return;
    }

    try {
      // await sendWaitlistEmail(email);
      setSuccess(true);
      setEmail('');
      setAgeAgreed(false);
    } catch (err: any) {
      console.error(err);
      setError('Error: ' + (err.message || 'Please try again later'));
    }
  };

  if (success) {
    return (
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-green-500/30">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">You're on the list!</h2>
            <p className="text-gray-300 text-lg mb-2">Thanks for joining the PulseMate waitlist</p>
            <p className="text-pink-400 font-medium">Check your email for confirmation 💕</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full font-semibold text-white hover:from-pink-400 hover:to-cyan-300 transition-all duration-300"
            >
              Join Another Email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-background">
      <div className="container mx-auto max-w-2xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Join the Waitlist
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Get early access and <span className="text-pink-400 font-semibold">bonus gems</span> when we launch!
          </p>
        </div>

        {/* Form container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700">
          <form onSubmit={onSubmit} className="space-y-6 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1A1A2E] border-[#2A2A4A] text-white placeholder:text-gray-500 rounded-md"
              required
            />
            
            {/* Debug button to test env vars */}
            <button 
              type="button" 
              onClick={() => {
                console.log('=== DEBUG BUTTON CLICKED ===');
                console.log('process.env keys (filtered):', Object.keys(process.env).filter(key => key.includes('RESEND')));
                console.log('NEXT_PUBLIC_RESEND_API_KEY:', process.env.NEXT_PUBLIC_RESEND_API_KEY || 'NOT FOUND!');
                console.log('=============================');
              }}
              className="w-full p-2 bg-gray-700 text-white rounded text-sm"
            >
              Debug: Check API Key
            </button>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="age"
                checked={ageAgreed}
                onChange={(e) => setAgeAgreed(e.target.checked)}
                required
              />
              <label htmlFor="age" className="text-sm text-gray-300">
                I'm 18+ and agree to <a href="/tos" className="text-[#FF69B4] hover:underline">TOS</a> & <a href="/privacy" className="text-[#FF69B4] hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-black font-bold rounded-full"
            >
              {loading ? 'Sending...' : 'Get Early Access'}
            </button>

            {success && <p className="text-green-500 text-sm">Thanks! Check your email 💕</p>}
          </form>

          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="text-gray-400">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm">Early Adopters</div>
              </div>
              <div className="text-gray-400">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm">Daily Active Users</div>
              </div>
              <div className="text-gray-400">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
