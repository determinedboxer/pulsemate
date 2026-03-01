'use client';

import { useState } from 'react';

const ModelPreviews = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const models = [
    {
      id: 1,
      name: "Mia",
      bio: "Energetic Cheerleader – Flirty & Fun!",
      image: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png",
      tags: ["Sporty", "Outgoing", "Playful"]
    },
    {
      id: 2,
      name: "Sakura",
      bio: "Kawaii Cosplayer – Sweet & Mysterious!",
      image: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png",
      tags: ["Cosplayer", "Creative", "Kawaii"]
    },
    {
      id: 3,
      name: "Isabella",
      bio: "Luxury Escort – Sensual & Dominant!",
      image: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png",
      tags: ["Elegant", "Mysterious", "Confident"]
    },
    {
      id: 4,
      name: "Riley",
      bio: "Gamer Girl – Nerdy & Passionate!",
      image: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png",
      tags: ["Gamer", "Nerdy", "Teasing"]
    },
    {
      id: 5,
      name: "Aaliyah",
      bio: "Nightlife Queen – Wild & Seductive!",
      image: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770471473/Isabella1_ifwyap.png",
      tags: ["Dancer", "Nightlife", "Bold"]
    }
  ];

  return (
    <section id="models" className="py-20 px-4 bg-gradient-to-b from-background to-gray-900">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Companion
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Each AI has their own unique personality and style. Find the one that matches yours!
          </p>
        </div>

        {/* Models grid - responsive: horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto md:overflow-visible pb-6 md:pb-0">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 min-w-max md:min-w-fit">
            {models.map((model, index) => (
              <div 
                key={model.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  hoveredCard === index 
                    ? 'transform scale-105 z-10' 
                    : 'hover:scale-105'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredCard === index 
                    ? '0 0 30px rgba(255, 105, 180, 0.6)' 
                    : '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Card container */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-pink-400/50 transition-all duration-300 w-72 md:w-full">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${model.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Preview badge */}
                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Preview
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{model.bio}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {model.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-700/50 text-pink-300 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action button */}
                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-xl font-semibold text-white hover:from-pink-400 hover:to-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30">
                      Meet {model.name}
                    </button>
                  </div>
                </div>

                {/* Glow effect on hover */}
                {hoveredCard === index && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-cyan-400/30 rounded-2xl blur-xl -z-10 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">More amazing companions coming soon!</p>
          <button 
            onClick={() => {
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full font-semibold text-white hover:from-cyan-300 hover:to-pink-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Join Waitlist for More
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModelPreviews;