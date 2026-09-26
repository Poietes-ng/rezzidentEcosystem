import { Outlet, Link } from '@tanstack/react-router'
import { Slider } from './Slider'

export function RegAuthLayout() {
  return (
    <div className="font-dmsans flex h-screen w-full overflow-hidden bg-[#FAFAF5]">
      {/* ═══ Left Column — Hero image with dark overlay ═══ */}
      <div className="relative hidden h-full w-[45%] flex-shrink-0 lg:block">
        {/* Hero background image — bleeds to all edges */}
        <img
          src="/assets/LoginHeroImageTest2.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(26, 26, 26, 0.65)' }} />

        {/* Content layered on top */}
        <div className="pl-web-2xl pr-web-lg pt-web-lg pb-web-2xl relative z-10 flex h-full flex-col">
          {/* Logo — top */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <img src="/assets/logo-white.svg" alt="logo" className="h-[24px] w-auto" />
            <span className="font-dmsans text-web-h2 font-web-bold">rezzident</span>
          </Link>

          {/* Spacer — pushes carousel + badge to bottom */}
          <div className="flex-1" />
          <Slider />

          {/* 80px gap between carousel and badge */}
          <div className="h-[80px] shrink-0" />

          {/* Footer badge — anchored at bottom */}
          <div>
            <div className="bg-inputBg inline-flex items-center gap-1 rounded-sm px-3 py-1.5">
              <span className="font-dmsans text-web-xs font-web-medium text-actionDark">
                Powered
              </span>
              <span className="text-actionDark/40 mx-0.5">|</span>
              <img src="/assets/LogoIcon.svg" alt="" className="h-[12px] w-auto" />
              <span className="font-dmsans text-web-xs font-web-semibold text-actionDark">
                Poietes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Right Column — Form content (vertically centered) ═══ */}
      <div className="bg-menuHover flex flex-1 [scrollbar-width:none] flex-col items-center justify-center [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="px-web-lg sm:px-web-2xl mt-web-xl w-full [scrollbar-width:none] overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
