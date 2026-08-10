import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const animStyle = (delay: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s ease-out ${delay}s`,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-20 bg-gradient-to-br from-[#1a1a1a] via-[#2a2020] to-[#1a1a1a] overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6730]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#fdc60a]/10 rounded-full blur-[100px]" />

        <div className="relative z-10  mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
            style={animStyle(0)}
          >
            <span className="text-[#FF6730] text-xs font-cabinet font-medium">About Us</span>
          </div>

          <h1
            className="font-cabinet font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white leading-tight mb-6"
            style={animStyle(0.1)}
          >
            We Engineer <span className="text-[#FF6730]">Growth</span> Through Software
          </h1>

          <p
            className="text-white/60 text-sm sm:text-base mx-auto font-satoshi leading-relaxed"
            style={animStyle(0.2)}
          >
            Poietes is a software development and growth engineering company that builds
            its own products and helps ambitious businesses grow through technology,
            data-driven strategy, and conversion-focused digital experiences.
          </p>
        </div>
      </section>
    </div>
  );
}
