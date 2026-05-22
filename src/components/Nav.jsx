import { motion as Motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const leftNavItems = [
    { label: 'Available Works', href: '/available' },
    { label: 'Past Works', href: '/past-works' },
    { label: 'Exhibitions', href: '/exhibitions' },
  ];

  const rightNavItems = [
    { label: 'Collectors Edit', href: '/collectors-edit' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:gap-8">
        {/* Left nav (desktop) / spacer (mobile) */}
        <div className="flex flex-1 items-center">
          <div className="hidden w-full items-center justify-around text-[10px] font-medium uppercase tracking-[0.18em] text-brand-muted lg:flex xl:text-[11px] xl:tracking-[0.2em]">
            {leftNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="whitespace-nowrap transition-colors hover:text-brand-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="min-w-0 flex-shrink-0 text-center">
          <Link to="/" className="block truncate font-sans text-[0.92rem] font-light uppercase leading-none tracking-[0.18em] text-brand-ink sm:text-lg sm:tracking-[0.24em] md:text-[1.35rem] md:tracking-[0.32em]">
            Sadaf Farasat
          </Link>
        </div>

        {/* Right nav (desktop) / hamburger (mobile) */}
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden w-full items-center justify-around text-[10px] font-medium uppercase tracking-[0.18em] text-brand-muted lg:flex xl:text-[11px] xl:tracking-[0.2em]">
            {rightNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="whitespace-nowrap transition-colors hover:text-brand-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="-mr-2 p-2 text-brand-ink lg:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-200 bg-white lg:hidden"
          >
            <div className="flex flex-col space-y-4 p-6 text-[11px] font-medium uppercase tracking-widest">
              {[...leftNavItems, ...rightNavItems].map((item) => (
                <Link key={item.label} to={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
