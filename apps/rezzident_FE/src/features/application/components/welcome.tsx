import { Link } from '@tanstack/react-router'
import { Button } from '../../../shared/components/ui/button'
import WelcomeSlider from './welcomeSlider'

/**
 * WelcomeScreen — rezzident_FE
 *
 * Layout: the screen is split into two equal rows (hero image / carousel + CTAs)
 * using CSS grid `grid-rows-2` (= repeat(2, minmax(0, 1fr))), so both halves are
 * always exactly the same height regardless of device height or content.
 *
 * Animation pattern mirrors rezzident_MB/WelcomeScreen.tsx:
 *  - On exit:  fade to 0 + slide up 12px (250ms ease)
 *  - On enter: fade to 1 + spring-slide from 12px below (tension 80, friction 12)
 * Implemented with Framer Motion AnimatePresence + motion.div.
 */

const HERO_IMAGE = '/assets/LoginHeroImageTest2.svg'

export function WelcomeScreen() {
  return (
    // h-dvh gives the grid a definite height; grid-rows-2 splits it into two equal halves.
    // If this component lives inside a parent with its own definite height, swap h-dvh for h-full.
    <div className="grid h-dvh w-full grid-rows-2 bg-white">
      {/* ── Top half: Static Hero Image ── */}
      <div className="min-h-0 px-4 pt-4 pb-4.25">
        <div className="relative h-full w-full overflow-hidden rounded-t-3xl bg-gray-100">
          <img
            src={HERO_IMAGE}
            alt="Rezzident hero"
            className="pointer-events-none h-full w-full object-cover object-center select-none"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(30, 30, 31, 0.4)' }} />
          {/* Centred logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-dmsans flex items-center text-[28px] font-bold text-white">
              <img src="/assets/logo.svg" alt="rezzident logo" className="h-7 w-auto" />
              rezzident
            </h1>
          </div>
        </div>
      </div>

      {/* ── Bottom half: Carousel + CTA (scrolls only if content is taller than its half) ── */}
      <div className="min-h-0 overflow-y-auto">
        <div className="flex flex-col">
          {/* ── Dots + Animated Text Carousel ── */}
          <WelcomeSlider />

          {/* ── CTA Buttons ── */}
          <div className="flex shrink-0 flex-col px-6">
            <div className="flex flex-col gap-4 bg-white">
              <Link to="/app/join" className="w-full">
                <Button variant="primary" className="w-full">
                  Create Account
                </Button>
              </Link>
              <Link to="/app/login" className="w-full">
                <Button variant="secondary" className="w-full">
                  I already have an account
                </Button>
              </Link>
              <Link
                to="/registration-criteria"
                className="font-dmsans text-body-base text-actionDark hover:decoration-actionDark! text-center font-medium underline decoration-gray-300 underline-offset-4"
              >
                <Button variant="ghost">Create Estate</Button>
              </Link>
            </div>

            <p className="font-dmsans pt-6 pb-3 text-center text-[12px] font-normal text-[#9A9488]">
              By continuing, you agree to our{' '}
              <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
                Terms
              </span>
              {' & '}
              <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
