import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import siteSettings from '../../content/settings/site.json';

export default function Footer() {
  const inquiryEmail = siteSettings.inquiry_email || siteSettings.email || 'contact@sadaf.art';
  const phone = siteSettings.phone || null;

  return (
    <footer className="py-16 bg-white border-t border-gray-100 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 text-sm">
        <div className="col-span-1 md:col-span-1">
           <h1 className="mb-4 font-sans text-lg font-light uppercase leading-none tracking-[0.2em] text-brand-ink sm:mb-6 sm:text-xl sm:tracking-[0.28em]">Sadaf Farasat</h1>
           <p className="text-brand-muted leading-relaxed">
             Bringing contemporary excellence to the forefront of the modern art market.
           </p>
        </div>
        
        <div className="col-span-1">
           <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Inquiry</h4>
           <ul className="space-y-4 text-brand-muted">
             <li className="flex items-center space-x-3">
               <Mail size={16} />
                <span>{inquiryEmail}</span>
              </li>
              {phone && (
                <li className="flex items-center space-x-3">
                  <Phone size={16} />
                  <span>{phone}</span>
                </li>
              )}
           </ul>
        </div>

        <div className="col-span-1">
           <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Explore</h4>
           <ul className="space-y-4 text-brand-muted uppercase tracking-widest text-[11px] font-medium">
             <li><Link to="/available" className="hover:text-brand-ink transition-colors">Available Works</Link></li>
             <li><Link to="/past-works" className="hover:text-brand-ink transition-colors">Past Works</Link></li>
             <li><Link to="/exhibitions" className="hover:text-brand-ink transition-colors">Exhibitions</Link></li>
             <li><Link to="/about" className="hover:text-brand-ink transition-colors">About</Link></li>
           </ul>
        </div>

        <div className="col-span-1">
           <h4 className="uppercase tracking-widest font-bold text-[11px] mb-6">Social</h4>
           <div className="flex space-x-6 text-brand-muted">
              {siteSettings.instagram && (
                <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-ink transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {siteSettings.facebook && (
                <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand-ink transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              <a href={`mailto:${inquiryEmail}`} aria-label="Email" className="hover:text-brand-ink transition-colors">
                <Mail size={20} />
              </a>
            </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase tracking-widest text-brand-muted font-bold md:mt-20 md:pt-8">
        <p>{siteSettings.footer_text || `© ${new Date().getFullYear()} Sadaf Farasat. All rights reserved.`}</p>
        <div className="flex flex-col gap-3 mt-4 md:mt-0 md:flex-row md:gap-8">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
