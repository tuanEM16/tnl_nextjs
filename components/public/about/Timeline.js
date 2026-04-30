'use client';
import { MdTrendingUp } from 'react-icons/md';

export default function Timeline({ data }) {
  const events = Array.isArray(data) ? data : [];
  if (events.length === 0) return null;

  return (
    <div className="bg-black text-white p-12 md:p-20 border-[10px] border-orange-600 shadow-[20px_20px_0_0_#000] relative overflow-hidden mb-32">
      <div className="absolute -right-20 -top-20 opacity-5">
        <MdTrendingUp size={400} />
      </div>
      <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter relative z-10">
        // LỊCH SỬ HÌNH THÀNH
      </h2>
      
      <div className="space-y-12 relative z-10">
        {events.map((item, idx) => (
          <div key={idx} className={`flex flex-col md:flex-row gap-8 items-start ${idx !== events.length - 1 ? 'border-b border-white/10 pb-12' : ''}`}>
            <span className="text-5xl md:text-6xl font-black italic text-orange-600 shrink-0 min-w-[180px]">
              {item.year}
            </span>
            <div className="space-y-3 mt-2">
              <h4 className="text-2xl font-black italic uppercase tracking-wide">{item.title}</h4>
              <div 
                className="text-gray-400 font-medium leading-relaxed text-lg max-w-3xl prose prose-invert"
                dangerouslySetInnerHTML={{ __html: item.desc || '' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}