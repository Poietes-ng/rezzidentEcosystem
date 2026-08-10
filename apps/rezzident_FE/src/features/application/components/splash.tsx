import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { cdnImage } from "../../../shared/lib/cdn";


export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto transition to welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigate({ to: "/app/welcome" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-between bg-actionDark px-6 py-12">
      {/* Top spacer */}
      <div />

      {/* Center Logo */}
      <div className="flex items-center justify-center">
        {/* The logo triangle bounces up from the bottom, followed by the text gliding in from the right */}
        <h1 className="flex items-center gap-2 font-cabinet text-[32px] font-bold text-white overflow-hidden">
          <img src="/assets/logo.svg" alt="logo" className="h-[32px] w-auto text-actionYellow animate-splashIcon opacity-0" />
          <span className="inline-block opacity-0 animate-splashText">rezzident</span>
        </h1>
      </div>

      {/* Bottom Watermark */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <p className="flex font-dmsans text-[12px] text-gray-400">
          Powered <span className="mx-1 opacity-50">|</span> <span className="flex items-center gap-1"><img src="/assets/LogoIcon.svg" className="text-[#FFE022]" /> <span>Poietes</span></span>
        </p>
      </div>
    </div>
  );
}
