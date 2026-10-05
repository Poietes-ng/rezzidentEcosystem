import { Link } from '@tanstack/react-router'
import { Button } from '#/shared/components/ui/button'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-cabinet text-actionDark flex items-center gap-2 text-[24px] font-bold"
        >
          <img src="/assets/logo.svg" alt="logo" className="text-actionYellow h-[24px] w-auto" />{' '}
          rezzident
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/app/splash">
            <Button
              variant="ghost"
              className="hidden h-auto min-h-0 px-4 py-2 text-sm sm:inline-flex"
            >
              Log in
            </Button>
          </Link>
          <Link to="/registration-criteria">
            <Button
              variant="secondary"
              className="hidden h-[40px] min-h-[40px] rounded-[8px] px-4 py-2 text-sm sm:inline-flex"
            >
              Create Estate
            </Button>
          </Link>
          <Link to="/app/splash">
            <Button
              variant="default"
              className="h-[40px] min-h-[40px] rounded-[8px] px-4 py-2 text-sm"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
