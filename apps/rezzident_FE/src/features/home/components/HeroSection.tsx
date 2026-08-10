import { Link } from "@tanstack/react-router";
import { Button } from "#/shared/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Star Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-actionYellow/30 bg-actionYellow/10 px-3 py-1 text-sm font-medium text-actionDark mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="material-symbols-outlined text-actionYellow" style={{ fontSize: '18px' }}>star</span>
          Smart community living at your fingertips
        </div>

        {/* Heading */}
        <h1 className="font-cabinet text-5xl font-bold tracking-tight text-actionDark sm:text-7xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Your residence, <span className="text-actionYellow">reimagined.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg leading-8 text-gray-500 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          Stay connected, stay secure. Manage bills, visitors, and votes in one place.
          Report issues, and chat instantly with your community.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to="/app/splash" className="w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto h-[56px] px-8 text-lg">
              Join Estate
            </Button>
          </Link>
          <Link to="/registration-criteria" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto h-[56px] px-8 text-lg">
              Create Estate
            </Button>
          </Link>
        </div>
      </div>

      {/* Graphic / App Preview */}
      <div className="mt-16 sm:mt-24 w-full flex justify-center px-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="relative mx-auto w-full max-w-5xl rounded-3xl bg-gray-100/50 shadow-2xl ring-1 ring-gray-900/10 overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <img
            src="/assets/LoginHeroImageTest2.svg"
            alt="App preview"
            className="w-full h-full object-cover pointer-events-none opacity-80"
          />
          {/* Central Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/10 to-transparent">
            <h2 className="flex items-center gap-3 font-cabinet text-4xl sm:text-6xl font-bold text-white drop-shadow-md">
              <img src="/assets/logo.svg" alt="logo" className="h-[48px] sm:h-[64px] w-auto" /> rezzident
            </h2>
          </div>
        </div>
      </div>

      {/* Simple fade-in-up animation styles */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </section>
  );
}