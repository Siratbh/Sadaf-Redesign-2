import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { label: 'Catalog', href: isHome ? '#gallery' : '/collections' },
    { label: 'About', href: isHome ? '#about' : '/about' },
    { label: 'Exhibitions', href: isHome ? '#exhibitions' : '/exhibitions' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <div className="hidden flex-1 items-center space-x-8 text-[11px] font-medium uppercase tracking-widest text-brand-muted md:flex">
          {navItems.map((item) => (
            isHome && item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} className="transition-colors hover:text-brand-ink">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.href} className="transition-colors hover:text-brand-ink">
                {item.label}
              </Link>
            )
          ))}
        </div>

        <div className="min-w-0 flex-shrink text-center">
          <Link to="/" className="block truncate text-lg font-serif uppercase text-brand-ink sm:text-xl md:text-2xl md:tracking-[0.2em]">
            Sadaf Farasat
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4 sm:space-x-8">
          <div className="hidden items-center space-x-8 text-[11px] font-medium uppercase tracking-widest text-brand-muted md:flex">
            <Link to="/contact" className="uppercase tracking-[0.2em] underline underline-offset-4 transition-colors hover:text-brand-ink">
              Contact
            </Link>
          </div>

          <button
            className="-mr-2 p-2 text-brand-ink md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-200 bg-white md:hidden"
          >
            <div className="flex flex-col space-y-4 p-6 text-[11px] font-medium uppercase tracking-widest">
              {navItems.map((item) => (
                isHome && item.href.startsWith('#') ? (
                  <a key={item.label} href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                )
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
