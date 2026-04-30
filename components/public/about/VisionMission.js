'use client';
import { MdVisibility, MdTrackChanges } from 'react-icons/md';

export default function VisionMission({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
      {/* CỘT TẦM NHÌN */}
      <div className="p-12 bg-black text-white border-l-8 border-orange-600 group hover:-translate-y-2 transition-transform duration-300">
        <MdVisibility size={48} className="text-orange-500 mb-6" />
        <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">Tầm Nhìn</h2>
        <div 
          className="text-gray-300 font-medium leading-relaxed text-lg prose prose-invert" 
          dangerouslySetInnerHTML={{ __html: data.vision || '' }} 
        />
      </div>

      {/* CỘT SỨ MỆNH */}
      <div className="p-12 bg-gray-100 text-black border-l-8 border-black shadow-[15px_15px_0_0_#000] group hover:-translate-y-2 transition-transform duration-300">
        <MdTrackChanges size={48} className="text-orange-600 mb-6" />
        <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">Sứ Mệnh</h2>
        <div 
          className="text-gray-700 font-bold leading-relaxed text-lg prose" 
          dangerouslySetInnerHTML={{ __html: data.mission || '' }} 
        />
      </div>
    </div>
  );
}