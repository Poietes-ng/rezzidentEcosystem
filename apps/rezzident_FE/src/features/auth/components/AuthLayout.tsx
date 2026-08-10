import { Outlet, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

const SLIDES = [
  { lines: ["Manage Your", "Estate with", "Confidence"] },
  { lines: ["Smarter", "Security for", "your estate"] },
  { lines: ["Simplify", "Everyday Estate", "Operations"] },
  { lines: ["Create a Better", "Living", "Experience for", "Residents"] },
  { lines: ["Make Better", "Decisions with", "Real-Time", "Insights"] },
];

const AUTOPLAY_MS = 4000;
const SWIPE_CONFIDENCE_THRESHOLD = 8000;

const EASE_IN = [0.22, 1, 0.36, 1] as const;
const EASE_OUT = [0.4, 0, 1, 1] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE_IN },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.32, ease: EASE_OUT },
  }),
};

const textContainer = {
  enter: {},
  center: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const textLine = {
  enter: { opacity: 0, y: 22, filter: "blur(6px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_IN },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(4px)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
};

export function AuthLayout() {
  const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [isInteracting, setIsInteracting] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    setSlide(([current]) => {
      const next = (current + newDirection + SLIDES.length) % SLIDES.length;
      return [next, newDirection];
    });
  }, []);

  const goToSlide = useCallback(
    (idx: number) => {
      setSlide(([current]) => [idx, idx > current ? 1 : -1]);
    },
    []
  );

  useEffect(() => {
    if (isInteracting) return;
    const timer = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [currentSlide, isInteracting, paginate]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsInteracting(false);
    const swipePower = info.offset.x * info.velocity.x;
    if (swipePower < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1);
    } else if (swipePower > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1);
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAF5] font-dmsans">
      {/* ═══ Left Column — Hero image with dark overlay ═══ */}
      <div className="hidden lg:block w-[45%] h-full flex-shrink-0 relative">
        {/* Hero background image — bleeds to all edges */}
        <img
          src="/assets/LoginHeroImageTest2.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(26, 26, 26, 0.65)" }}
        />

        {/* Content layered on top */}
        <div className="relative z-10 flex h-full flex-col pl-web-2xl pr-web-lg pt-web-lg pb-web-2xl">
          {/* Logo — top */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white"
          >
            <img src="/assets/logo-white.svg" alt="logo" className="h-[24px] w-auto" />
            <span className="font-dmsans text-web-h2 font-web-bold">
              rezzident
            </span>
          </Link>

          {/* Spacer — pushes carousel + badge to bottom */}
          <div className="flex-1" />

          {/* Carousel text */}
          <div className="flex flex-col gap-web-md">
            {/* Slide track */}
            <div className="relative w-full overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragStart={() => setIsInteracting(true)}
                  onDragEnd={handleDragEnd}
                  className="w-full cursor-grab active:cursor-grabbing"
                >
                  <motion.h2
                    variants={textContainer}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="font-dmsans text-[64px] font-web-bold leading-[72px] text-white"
                  >
                    {slide.lines.map((line, lineIdx) => (
                      <motion.span key={lineIdx} variants={textLine} className="block">
                        {line}
                      </motion.span>
                    ))}
                  </motion.h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsInteracting(true);
                    goToSlide(idx);
                    setIsInteracting(false);
                  }}
                  className="relative h-[3px] w-[28px]"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span className="absolute inset-0 rounded-full bg-white/25" />
                  {currentSlide === idx && (
                    <motion.span
                      layoutId="active-dot"
                      className="absolute inset-0 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 80px gap between carousel and badge */}
          <div className="h-[80px] shrink-0" />

          {/* Footer badge — anchored at bottom */}
          <div>
            <div className="inline-flex items-center gap-1 rounded-sm bg-inputBg px-3 py-1.5">
              <span className="font-dmsans text-web-xs font-web-medium text-actionDark">
                Powered
              </span>
              <span className="mx-0.5 text-actionDark/40">|</span>
              <img src="/assets/LogoIcon.svg" alt="" className="h-[12px] w-auto" />
              <span className="font-dmsans text-web-xs font-web-semibold text-actionDark">
                Poietes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Right Column — Form content (vertically centered) ═══ */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto">
        <div className="w-full sm:px-web-2xl py-web-xl px-web-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
