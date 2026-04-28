'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdPhoneInTalk } from 'react-icons/md';

export default function MobileMenu({ isOpen, onClose, links }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          <div className="flex flex-col h-full p-8 md:p-12">
            
            {/* 🔴 HEADER MENU */}
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#e33127]"></span>
                <span className="text-[#0e2188] font-bold text-xs tracking-[0.4em] uppercase">
                  Navigation
                </span>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-100 text-[#0e2188] hover:text-[#e33127] hover:border-[#e33127] transition-all duration-300"
              >
                <MdClose size={28} />
              </button>
            </div>

            {/* 🟢 NAVIGATION LINKS */}
            <nav className="flex flex-col space-y-6">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-4xl md:text-5xl font-bold text-[#0e2188] uppercase tracking-tighter hover:text-[#e33127] transition-colors inline-flex items-center gap-4 group"
                  >
                    {link.label}
                    <span className="h-[2px] w-0 bg-[#e33127] group-hover:w-8 transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* 🔵 FOOTER MENU */}
            <div className="mt-auto pt-10 border-t border-zinc-100">
              <div className="flex flex-col gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] block">
                    Support Center
                  </span>
                  <a 
                    href="tel:0366638969" 
                    className="inline-flex items-center gap-5 text-[#0e2188] group transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#0e2188] text-white flex items-center justify-center group-hover:bg-[#e33127] transition-colors shadow-lg shadow-[#0e2188]/10">
                      <MdPhoneInTalk size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Hotline 24/7</span>
                      <span className="text-2xl font-bold tracking-tight">0366.638.969</span>
                    </div>
                  </a>
                </div>

                <div className="flex gap-4">
                   <div className="text-[10px] font-bold text-[#0e2188] py-2 px-4 border border-[#0e2188]/10 rounded-sm uppercase tracking-widest">
                     Tân Ngọc Lực Co., Ltd
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}