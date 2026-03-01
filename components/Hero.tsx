'use client';

import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Model teaser images - real model avatars
  const modelImages = [
    'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png', // Mia
    'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png', // Sakura
    'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png', // Isabella
    'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png', // Riley
    'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770471473/Isabella1_ifwyap.png' // Aaliyah
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % modelImages.length);
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Blurred carousel background */}
      <div className="absolute inset-0">
        {modelImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.4)'
            }}
          />
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-pink-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Feel the Pulse
            </span>
            <br />
            <span className="text-white">of Connection</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your AI companion that teases, listens and grows with you{' '}
            <span className="text-pink-400">💗</span>
          </p>
          
          {/* CTA Button */}
          <button
            onClick={() => {
              document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full text-xl font-bold text-white shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 hover:from-pink-400 hover:to-cyan-300"
          >
            <span className="flex items-center space-x-2">
              <span>Start Chatting Now</span>
              <svg 
                className="w-6 h-6 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-pink-400 flex justify-center">
          <div className="w-1 h-3 bg-pink-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;