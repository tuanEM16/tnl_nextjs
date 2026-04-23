// components/public/layout/MobileMenu.js
import Link from 'next/link';
import { MdClose, MdPhoneInTalk } from 'react-icons/md';

export default function MobileMenu({ isOpen, onClose, links }) {
  return (
    <div className={`fixed inset-0 z-[100] bg-black transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full p-8">
        <div className="flex justify-between items-center mb-16">
          <span className="text-white font-black italic text-2xl tracking-tighter">NAVIGATION_SYS</span>
          <button onClick={onClose} className="text-white p-2 border-2 border-white hover:bg-white hover:text-black transition-all">
            <MdClose size={32} />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-4xl font-black text-white uppercase italic tracking-tighter hover:text-orange-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t-2 border-white/20">
          <p className="text-gray-500 font-black text-[10px] tracking-widest mb-4 uppercase">// EMERGENCY_CONTACT</p>
          <a href="tel:0366638969" className="text-white text-3xl font-black italic flex items-center gap-4">
            <MdPhoneInTalk className="text-orange-600" /> 0366.638.969
          </a>
        </div>
      </div>
    </div>
  );
}