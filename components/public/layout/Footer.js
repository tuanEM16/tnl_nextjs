// components/public/layout/Footer.js
import Container from '../ui/Container';
import Link from 'next/link';
import { MdLocationOn, MdPhone, MdEmail, MdArrowForward } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* CỘT 1: THÔNG TIN CÔNG TY */}
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-5xl font-black italic uppercase tracking-tighter leading-none">Tân Ngọc Lực</span>
              <span className="text-xs font-black tracking-[0.4em] text-orange-600 mt-2">// INDUSTRIAL_STEEL_SOLUTIONS</span>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="flex gap-4 items-start">
                <MdLocationOn size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm leading-relaxed">
                  ĐỊA CHỈ: 304/4, ĐƯỜNG 30/4, KHU PHỐ NINH AN, BÌNH MINH, TỈNH TÂY NINH [cite: 9]
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <MdPhone size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm uppercase tracking-widest">HOTLINE: 0366.638.969 </p>
              </div>
              <div className="flex gap-4 items-center">
                <MdEmail size={24} className="text-orange-600 shrink-0" />
                <p className="font-bold text-sm uppercase tracking-widest">EMAIL: TANNGOCLUC@GMAIL.COM</p>
              </div>
            </div>
          </div>

          {/* CỘT 2: QUICK LINKS & NEWSLETTER */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-black text-xs tracking-[0.3em] text-gray-500 uppercase">// DANH MỤC</h4>
              <ul className="space-y-3 font-bold text-sm uppercase">
                <li><Link href="/products" className="hover:text-orange-600 transition-colors italic">Sản phẩm thép</Link></li>
                <li><Link href="/du-an" className="hover:text-orange-600 transition-colors italic">Dự án tiêu biểu</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-orange-600 transition-colors italic">Tin tức ngành</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black text-xs tracking-[0.3em] text-gray-500 uppercase">// HỖ TRỢ</h4>
              <ul className="space-y-3 font-bold text-sm uppercase">
                <li><Link href="/gioi-thieu" className="hover:text-orange-600 transition-colors italic">Giới thiệu</Link></li>
                <li><Link href="/lien-he" className="hover:text-orange-600 transition-colors italic">Liên hệ báo giá</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <p>© 2026 TÂN NGỌC LỰC. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">DEVELOPED_BY: <span className="text-white italic">LUU CONG TUAN EM</span></p>
        </div>
      </Container>
    </footer>
  );
}