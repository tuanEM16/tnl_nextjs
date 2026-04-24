'use client';

import Container from '../ui/Container';
import Link from 'next/link';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { FaFacebook, FaYoutube } from 'react-icons/fa'; // 🟢 Import thêm icon mạng xã hội
import { usePublicConfig } from '@/hooks/public/usePublicConfig';
import { getImageUrl } from '@/lib/utils';

export default function Footer() {
  const { config, loading } = usePublicConfig();

  if (loading) return <footer className="bg-black h-40"></footer>;

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          
          {/* 🔴 CỘT 1: THÔNG TIN CÔNG TY */}
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                {config.site_name || 'TÂN NGỌC LỰC'}
              </span>
              <span className="text-xs font-black tracking-[0.4em] text-orange-600 mt-2 lowercase italic">
                // {config.slogan || 'BỀN VỮNG - CHẤT LƯỢNG'}
              </span>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="flex gap-4 items-start">
                <MdLocationOn size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm leading-relaxed uppercase">
                  ĐỊA CHỈ: {config.address}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <MdPhone size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm uppercase tracking-widest">
                  HOTLINE: {config.hotline || config.phone}
                </p>
              </div>
              <div className="flex gap-4 items-center border-b border-white/10 pb-6">
                <MdEmail size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm uppercase tracking-widest lowercase">
                  EMAIL: {config.email}
                </p>
              </div>

              {/* 🟢 PHẦN MẠNG XÃ HỘI MỚI THÊM ĐÂY ĐẠI CA! */}
              <div className="flex gap-6 items-center pt-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kết nối:</span>
                
                {config.facebook && (
                  <a href={config.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-orange-600 transition-all hover:-translate-y-1">
                    <FaFacebook size={28} />
                  </a>
                )}

                {config.youtube && config.youtube !== 'done' && (
                  <a href={config.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-orange-600 transition-all hover:-translate-y-1">
                    <FaYoutube size={32} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 🔵 CỘT 2: QUICK LINKS (Giữ nguyên) */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-black text-xs tracking-[0.3em] text-gray-500 uppercase">// DANH MỤC</h4>
              <ul className="space-y-3 font-bold text-sm uppercase">
                <li><Link href="/products" className="hover:text-orange-600 transition-colors italic">Sản phẩm thép</Link></li>
                <li><Link href="/projects" className="hover:text-orange-600 transition-colors italic">Dự án tiêu biểu</Link></li>
                <li><Link href="/news" className="hover:text-orange-600 transition-colors italic">Tin tức ngành</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black text-xs tracking-[0.3em] text-gray-500 uppercase">// HỖ TRỢ</h4>
              <ul className="space-y-3 font-bold text-sm uppercase">
                <li><Link href="/about" className="hover:text-orange-600 transition-colors italic">Giới thiệu</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600 transition-colors italic">Liên hệ báo giá</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ⚪ FOOTER BOTTOM */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <p>© 2026 {config.site_name || 'TÂN NGỌC LỰC'}. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2 italic">
            DEVELOPED_BY: <span className="text-white">LUU CONG TUAN EM</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}