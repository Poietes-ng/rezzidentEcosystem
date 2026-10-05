import { Link } from '@tanstack/react-router'
import type React from 'react'

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="font-cabinet mt-auto w-full border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="hover:text-actionDark text-gray-400">
            <span className="sr-only">Website</span>
            <span className="material-symbols-outlined text-[20px]">language</span>
          </a>
          <a href="#" className="hover:text-actionDark text-gray-400">
            <span className="sr-only">Social</span>
            <span className="material-symbols-outlined text-[20px]">forum</span>
          </a>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 text-center text-xs leading-5 text-gray-500 md:order-1 md:mt-0 md:flex-row md:text-left">
          <p>&copy; {currentYear} Rezzident. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-actionDark hover:underline">
              Terms
            </Link>
            <Link to="/" className="hover:text-actionDark hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
