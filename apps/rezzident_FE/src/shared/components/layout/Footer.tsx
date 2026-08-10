import { Link } from "@tanstack/react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto w-full font-cabinet">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-actionDark">
            <span className="sr-only">Website</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>language</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-actionDark">
            <span className="sr-only">Social</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>forum</span>
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row items-center gap-4 text-center md:text-left text-xs leading-5 text-gray-500">
          <p>&copy; {currentYear} Rezzident. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-actionDark hover:underline">Terms</Link>
            <Link to="/" className="hover:text-actionDark hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}