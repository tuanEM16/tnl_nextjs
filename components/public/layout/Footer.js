'use client';

import Container from '../ui/Container';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdLocationOn, MdPhone, MdEmail, MdArrowUpward,MdArrowForward  } from 'react-icons/md';
import { FaFacebook, FaYoutube, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { usePublicConfig } from '@/hooks/public/usePublicConfig';

export default function Footer() {
  const { config, loading } = usePublicConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <footer className="bg-[#0e2188] h-40"></footer>;

  return (
    <footer className="bg-[#0e2188] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-[#e33127]" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* 🔴 BRANDING & VISION (5 columns) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
                {config.site_name || 'TÂN NGỌC LỰC'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#e33127]"></span>
                <p className="text-[10px] font-bold tracking-[0.4em] text-[#e33127] uppercase">
                  {config.slogan || 'Bền vững qua từng thập kỷ'}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-white/70">
              <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 shrink-0 border border-white/10 flex items-center justify-center group-hover:border-[#e33127] transition-colors">
                  <MdLocationOn size={18} className="text-[#e33127]" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40">Trụ sở chính</span>
                  <p className="text-sm font-medium leading-relaxed uppercase">{config.address}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 shrink-0 border border-white/10 flex items-center justify-center group-hover:border-[#e33127] transition-colors">
                  <MdPhone size={18} className="text-[#e33127]" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40">Hotline hỗ trợ</span>
                  <p className="text-sm font-bold tracking-widest">{config.hotline || config.phone}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 shrink-0 border border-white/10 flex items-center justify-center group-hover:border-[#e33127] transition-colors">
                  <MdEmail size={18} className="text-[#e33127]" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40">Hòm thư điện tử</span>
                  <p className="text-sm font-medium lowercase tracking-wider">{config.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔵 NAVIGATION LINKS (4 columns) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Khám phá</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link href="/products" className="hover:text-[#e33127] transition-colors">Sản phẩm</Link></li>
                <li><Link href="/projects" className="hover:text-[#e33127] transition-colors">Dự án</Link></li>
                <li><Link href="/news" className="hover:text-[#e33127] transition-colors">Tin tức</Link></li>
                <li><Link href="/about" className="hover:text-[#e33127] transition-colors">Về chúng tôi</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Dịch vụ</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link href="/contact" className="hover:text-[#e33127] transition-colors">Báo giá</Link></li>
                <li><Link href="#" className="hover:text-[#e33127] transition-colors">Kỹ thuật</Link></li>
                <li><Link href="#" className="hover:text-[#e33127] transition-colors">Bảo hành</Link></li>
              </ul>
            </div>
          </div>

          {/* 🟢 NEWSLETTER & SOCIAL (3 columns) */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Bản tin công trình</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="w-full bg-white/5 border border-white/10 py-4 px-5 text-sm focus:outline-none focus:border-[#e33127] transition-colors rounded-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#e33127] p-2 hover:bg-white hover:text-[#0e2188] transition-all">
                  <MdArrowForward />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase">Mạng xã hội</h4>
              <div className="flex gap-4">
                {config.facebook && (
                  <a href={config.facebook} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e33127] hover:border-[#e33127] transition-all duration-300">
                    <FaFacebook size={20} />
                  </a>
                )}
                {config.youtube && (
                  <a href={config.youtube} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e33127] hover:border-[#e33127] transition-all duration-300">
                    <FaYoutube size={20} />
                  </a>
                )}
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e33127] hover:border-[#e33127] transition-all duration-300">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ⚪ FOOTER BOTTOM */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            © 2026 {config.site_name}. ALL RIGHTS RESERVED.
          </div>
          
          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Quay lại đầu trang</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#e33127] transition-all">
              <MdArrowUpward />
            </div>
          </button>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            DESIGNED_BY <span className="text-[#e33127]">TUANEM</span> x <span className="text-white">GMN</span>
          </div>
        </div>
      </Container>
      
      {/* Visual Background Pattern */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[200px] font-bold leading-none uppercase tracking-tighter">STEEL</span>
      </div>
    </footer>
  );
}