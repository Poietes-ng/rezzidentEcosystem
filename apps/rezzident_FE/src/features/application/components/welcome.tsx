import { Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { cn } from "../../../shared/utils/cn";

const SLIDES = [
  {
    title: "Your residence, reimagined.",
    description: "Smart community living at your fingertips",
    image: "/assets/LoginHeroImageTest2.svg",
  },
  {
    title: "Stay connected, stay secure.",
    description: "Manage bills, visitors, and votes in one place",
    image: "/assets/LoginHeroImageTest2.svg",
  },
  {
    title: "Your community, in your pocket.",
    description: "Report issues, and chat instantly",
    image: "/assets/LoginHeroImageTest2.svg",
  },
];

export function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Drag state
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftState, setScrollLeftState] = React.useState(0);

  React.useEffect(() => {
    // Disable auto-scroll while dragging
    if (isDragging) return;

    const timer = setTimeout(() => {
      const nextSlide = (currentSlide + 1) % SLIDES.length;
      scrollToSlide(nextSlide);
    }, 3500);
    return () => clearTimeout(timer);
  }, [currentSlide, isDragging]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isDragging) return; // Don't update currentSlide while actively dragging
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      const newSlide = Math.round(scrollLeft / width);
      setCurrentSlide(newSlide);
    }
  };

  const scrollToSlide = (idx: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: width * idx, behavior: "smooth" });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeftState(e.currentTarget.scrollLeft);
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = "auto";
      scrollRef.current.style.scrollSnapType = "none";
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftState - walk;
    }
  };

  const handlePointerUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = "smooth";
      scrollRef.current.style.scrollSnapType = "x mandatory";

      const width = scrollRef.current.clientWidth;
      const currentScroll = scrollRef.current.scrollLeft;
      const newSlide = Math.round(currentScroll / width);
      scrollToSlide(newSlide);
      setCurrentSlide(newSlide);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Top half: Image Slider */}
      <div className="relative w-full pt-6 md:pt-12 shrink-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className="flex w-full snap-x snap-mandatory overflow-x-auto hide-scrollbar touch-pan-x select-none"
        >
          {SLIDES.map((slide, idx) => (
            <div key={idx} className="flex h-full w-full shrink-0 snap-center flex-col px-6">
              <div className="relative w-full aspect-[4/3] max-h-[350px] shrink-0 overflow-hidden rounded-t-[24px] bg-gray-100">
                <img
                  src={slide.image}
                  alt="Onboarding"
                  className="h-full w-full object-cover lg:object-[center_-80px] pointer-events-none"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(26, 26, 26, 0.35)" }}
                />


                {/* Logo overlay: Centered perfectly in the card */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="flex items-center gap-2 font-cabinet text-[28px] font-bold text-white shadow-sm">
                    <img src="/assets/logo.svg" alt="logo" className="h-[28px] w-auto text-actionYellow" /> rezzident
                  </h1>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators (Dots) placed between Image and Text */}
      <div className="flex justify-center gap-2 py-8 shrink-0">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={cn(
              "h-[4px] rounded-full transition-all duration-300",
              currentSlide === idx ? "w-[24px] bg-actionDark" : "w-[12px] bg-gray-200"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom half: Synchronized Text Carousel */}
      <div className="flex flex-1 flex-col overflow-hidden w-full px-6">
        <div
          className="flex w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {SLIDES.map((slide, idx) => (
            <div key={idx} className="w-full shrink-0 text-center px-4">
              <h2 className="mb-3 font-dmsans text-heading-1 text-actionDark">
                {slide.title}
              </h2>
              <p className="font-dmsans text-body-base text-gray-500">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex flex-col gap-4 bg-white px-6 pb-8">
        <Link to="/app/join" className="w-full">
          <Button variant="default" className="w-full">
            Join Estate
          </Button>
        </Link>
        <Link to="/app/login" className="w-full">
          <Button variant="secondary" className="w-full">
            I already have an account
          </Button>
        </Link>

        <Link to="/registration-criteria" className="mt-2 text-center font-dmsans text-body-base font-medium text-actionDark underline decoration-gray-300 underline-offset-4 hover:decoration-actionDark">
          Create Estate
        </Link>

        <p className="mt-4 text-center font-dmsans text-[10px] text-gray-400">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
