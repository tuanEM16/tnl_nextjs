'use client';
import Container from '@/components/public/ui/Container';
import SectionTitle from '@/components/public/ui/SectionTitle';
import { MdVerified, MdEngineering, MdHistory, MdMilitaryTech } from 'react-icons/md';
import NewsBanner from '@/components/public/about/AboutBanner';
import AboutBanner from '../../../components/public/about/AboutBanner';
export default function AboutPage() {
  return (
    <div className=" bg-white">
        <AboutBanner/>
      <Container>
        {/* 🔴 PHẦN 1: HERO - TUYÊN NGÔN THƯƠNG HIỆU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <span className="text-orange-600 font-black tracking-[0.4em] uppercase text-xs">
              // THÉP XÂY DỰNG CHẤT LƯỢNG CAO
            </span>
            <h1 className="text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-black">
              TÂN NGỌC LỰC <br />
              <span className="text-orange-600">SINCE 2026.</span>
            </h1>
            <p className="text-xl font-bold text-gray-600 border-l-8 border-black pl-8 leading-relaxed italic">
              Chúng tôi không chỉ cung cấp thép, chúng tôi cung cấp nền móng vững chắc cho mọi công trình tầm cỡ quốc gia.
            </p>
          </div>
          <div className="relative">
            <div className="border-[10px] border-black shadow-[30px_30px_0_0_#000] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1000" 
                alt="Factory" 
                className="w-full grayscale hover:grayscale-0 transition-all duration-1000 scale-110" 
              />
            </div>
          </div>
        </div>

        {/* 🔵 PHẦN 2: GIÁ TRỊ CỐT LÕI (CORE VALUES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: <MdVerified size={40} />, title: "CHẤT LƯỢNG THÉP", desc: "Mọi sản phẩm đều đạt mác thép SS400, CB300V theo tiêu chuẩn quốc tế." },
            { icon: <MdEngineering size={40} />, title: "KỸ THUẬT CHÍNH XÁC", desc: "Hồ sơ thông số kỹ thuật (Specs) minh bạch cho từng lô hàng." },
            { icon: <MdMilitaryTech size={40} />, title: "UY TÍN HÀNG ĐẦU", desc: "Đối tác tin cậy của hàng nghìn nhà thầu xây dựng tại Việt Nam." }
          ].map((item, idx) => (
            <div key={idx} className="p-10 border-4 border-black bg-gray-50 shadow-[10px_10px_0_0_#000] hover:bg-black hover:text-white transition-all group">
              <div className="text-orange-600 group-hover:text-orange-400 mb-6">{item.icon}</div>
              <h3 className="text-2xl font-black italic uppercase mb-4">{item.title}</h3>
              <p className="font-bold opacity-70 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 🟠 PHẦN 3: LỊCH SỬ PHÁT TRIỂN (TIMELINE) */}
        <div className="bg-black text-white p-16 border-[10px] border-orange-600 shadow-[20px_20px_0_0_#000]">
          <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter text-center">// LỊCH SỬ HÌNH THÀNH</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-start border-b border-white/20 pb-8">
              <span className="text-5xl font-black italic text-orange-600">2026</span>
              <div className="space-y-2">
                <h4 className="text-2xl font-black italic uppercase">THÀNH LẬP TÂN NGỌC LỰC</h4>
                <p className="text-gray-400 font-bold">Bắt đầu hành trình cung ứng thép xây dựng chuyên nghiệp tại TP.HCM.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <span className="text-5xl font-black italic text-orange-600">TODAY</span>
              <div className="space-y-2">
                <h4 className="text-2xl font-black italic uppercase">DẪN ĐẦU THỊ TRƯỜNG</h4>
                <p className="text-gray-400 font-bold">Trở thành đơn vị số 1 về cung cấp thép tấm, thép hình và các giải pháp mác thép đặc chủng.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}