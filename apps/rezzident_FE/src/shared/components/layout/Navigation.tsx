import { Link } from "@tanstack/react-router";
import { Button } from "#/shared/components/ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-cabinet text-[24px] font-bold text-actionDark">
          <img src="/assets/logo.svg" alt="logo" className="h-[24px] w-auto text-actionYellow" /> rezzident
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-body-small font-medium text-gray-500 hover:text-actionDark">Home</Link>
          <Link to="/" className="text-body-small font-medium text-gray-500 hover:text-actionDark">Features</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/app/splash">
            <Button variant="ghost" className="hidden sm:inline-flex px-4 py-2 h-auto min-h-0 text-sm">
              Log in
            </Button>
          </Link>
          <Link to="/registration-criteria">
            <Button variant="secondary" className="hidden sm:inline-flex h-[40px] min-h-[40px] px-4 py-2 text-sm rounded-[8px]">
              Create Estate
            </Button>
          </Link>
          <Link to="/app/splash">
            <Button variant="default" className="h-[40px] min-h-[40px] px-4 py-2 text-sm rounded-[8px]">
              Join Estate
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}