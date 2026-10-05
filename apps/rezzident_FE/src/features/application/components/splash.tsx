import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { cdnImage } from '../../../shared/lib/cdn'

export function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto transition to welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigate({ to: '/welcome' })
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="bg-actionDark flex h-dvh w-full flex-col items-center justify-between px-6 py-12">
      {/* Top spacer */}
      <div />

      {/* Center Logo */}
      <div className="flex items-center justify-center">
        {/* The logo triangle bounces up from the bottom, followed by the text gliding in from the right */}
        <h1 className="font-dmsans flex items-center gap-2 overflow-hidden text-[32px] font-bold text-white">
          <img
            src="/assets/logo.svg"
            alt="logo"
            className="text-actionYellow animate-splashIcon h-[32px] w-auto opacity-0"
          />
          <span className="animate-splashText inline-block opacity-0">
            rezzident
          </span>
        </h1>
      </div>

      {/* Bottom Watermark */}
      <div className="flex flex-col items-center gap-2 pb-6 text-white">
        <p className="font-dmsans flex text-[12px] text-white">
          Powered <span className="mx-1 opacity-50">|</span>{' '}
          <span className="flex items-center gap-1">
            <img src="/assets/LogoIcon.svg" className="text-[#FFE022]" />{' '}
            <span>Poietes</span>
          </span>
        </p>
      </div>
    </div>
  )
}
