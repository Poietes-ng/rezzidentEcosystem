import { Link } from '@tanstack/react-router'
import type React from 'react'
import { Button } from '#/shared/components/ui'

export function HeroSection(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
        {/* Star Badge */}
        <div
          className="border-actionYellow/30 bg-actionYellow/10 text-actionDark animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium"
          style={{ animationDelay: '100ms' }}
        >
          <span className="material-symbols-outlined text-actionYellow text-[18px]">star</span>
          Smart community living at your fingertips
        </div>

        {/* Heading */}
        <h1
          className="font-cabinet text-actionDark animate-fade-in-up text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ animationDelay: '200ms' }}
        >
          Your residence, <span className="text-actionYellow">reimagined.</span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in-up mt-6 text-lg leading-8 text-gray-500"
          style={{ animationDelay: '300ms' }}
        >
          Stay connected, stay secure. Manage bills, visitors, and votes in one place. Report
          issues, and chat instantly with your community.
        </p>

        {/* Actions */}
        <div
          className="animate-fade-in-up mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          style={{ animationDelay: '400ms' }}
        >
          <Link to="/app/splash" className="w-full sm:w-auto">
            <Button variant="primary" className="h-[56px] w-full px-8 text-lg sm:w-auto">
              Create Account
            </Button>
          </Link>
          <Link to="/registration-criteria" className="w-full sm:w-auto">
            <Button variant="secondary" className="h-[56px] w-full px-8 text-lg sm:w-auto">
              Create Estate
            </Button>
          </Link>
        </div>
      </div>

      {/* Graphic / App Preview */}
      <div
        className="animate-fade-in-up mt-16 flex w-full justify-center px-6 sm:mt-24"
        style={{ animationDelay: '500ms' }}
      >
        <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-3xl bg-gray-100/50 shadow-2xl ring-1 ring-gray-900/10 md:aspect-[21/9]">
          <img
            src="/assets/LoginHeroImageTest2.svg"
            alt="App preview"
            className="pointer-events-none h-full w-full object-cover opacity-80"
          />
          {/* Central Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/10 to-transparent">
            <h2 className="font-cabinet flex items-center gap-3 text-4xl font-bold text-white drop-shadow-md sm:text-6xl">
              <img src="/assets/logo.svg" alt="logo" className="h-[48px] w-auto sm:h-[64px]" />{' '}
              rezzident
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
  )
}
