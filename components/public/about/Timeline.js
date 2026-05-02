'use client';
import { MdTrendingUp } from 'react-icons/md';

export default function Timeline({ data }) {
  const events = Array.isArray(data) ? data : [];
  if (events.length === 0) return null;

  return (
    <div className="bg-black text-white p-8 md:p-20 border-[8px] border-black shadow-[16px_16px_0_0_#ea580c] relative overflow-hidden mb-32 font-archivo">
      {/* Icon chìm trang trí */}
      <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
        <MdTrendingUp size={400} />
      </div>

      <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-16 tracking-tighter relative z-10 text-white flex flex-col">
        <span className="text-orange-600 text-xl md:text-2xl tracking-widest mb-4 block border-b-4 border-orange-600 w-fit pb-2">// HÀNH TRÌNH</span>
        LỊCH SỬ HÌNH THÀNH
      </h2>
      
      {/* Trục Timeline dọc */}
      <div className="space-y-0 relative z-10 border-l-8 border-orange-600 ml-4 md:ml-8">
        {events.map((item, idx) => (
          <div key={idx} className="relative pl-8 md:pl-16 pb-16 group">
            {/* Cục Node đánh dấu trên trục */}
            <div className="absolute -left-[20px] top-0 w-8 h-8 bg-black border-4 border-orange-600 group-hover:bg-orange-600 transition-colors" />

            <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start">
              {/* Hiệu ứng Text Rỗng Ruột (Stroke) cho Số Năm */}
              <span 
                className="text-6xl md:text-7xl font-black italic text-transparent group-hover:text-orange-600 transition-colors duration-300 shrink-0 min-w-[200px] leading-none" 
                style={{ WebkitTextStroke: '2px #ea580c' }}
              >
                {item.year}
              </span>

              <div className="space-y-4 mt-2">
                <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-300 text-white">
                  {item.title}
                </h4>
                {/* Ép CSS cho thẻ HTML sinh ra từ Quill */}
                <div 
                  className="text-gray-400 font-bold leading-relaxed text-base md:text-lg max-w-3xl [&>p]:mb-4 last:[&>p]:mb-0 [&_strong]:text-white group-hover:[&_strong]:text-orange-400 transition-colors"
                  dangerouslySetInnerHTML={{ __html: item.desc || '' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}