'use client';
import { MdVisibility, MdTrackChanges } from 'react-icons/md';

export default function VisionMission({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-32 font-archivo">
      {/* 🔴 CỘT TẦM NHÌN */}
      <div className="relative p-10 md:p-14 bg-black text-white border-4 border-black shadow-[12px_12px_0_0_#ea580c] group hover:-translate-y-2 transition-all duration-300">
        {/* Block Icon đính góc */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-600 flex items-center justify-center -mt-6 -mr-6 border-4 border-black group-hover:rotate-12 transition-transform shadow-[6px_6px_0_0_#000]">
            <MdVisibility size={40} className="text-black" />
        </div>
        
        <span className="text-orange-500 font-black tracking-widest uppercase text-sm border-b-2 border-orange-500 pb-1 mb-6 inline-block">
          // MỤC TIÊU TƯƠNG LAI
        </span>
        <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-8 tracking-tighter">
          Tầm Nhìn
        </h2>
        {/* Nội dung từ Quill */}
        <div 
          className="text-gray-300 font-bold leading-relaxed text-base md:text-lg [&>p]:mb-4 last:[&>p]:mb-0 [&_strong]:text-orange-500" 
          dangerouslySetInnerHTML={{ __html: data.vision || '' }} 
        />
      </div>

      {/* ⚪ CỘT SỨ MỆNH */}
      <div className="relative p-10 md:p-14 bg-white text-black border-4 border-black shadow-[12px_12px_0_0_#000] group hover:-translate-y-2 transition-all duration-300">
        {/* Block Icon đính góc */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-black flex items-center justify-center -mt-6 -mr-6 border-4 border-black group-hover:-rotate-12 transition-transform shadow-[6px_6px_0_0_#ea580c]">
            <MdTrackChanges size={40} className="text-white" />
        </div>

        <span className="text-gray-500 font-black tracking-widest uppercase text-sm border-b-2 border-black pb-1 mb-6 inline-block">
          // NHIỆM VỤ CỐT LÕI
        </span>
        <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-8 tracking-tighter">
          Sứ Mệnh
        </h2>
        {/* Nội dung từ Quill */}
        <div 
          className="text-gray-600 font-bold leading-relaxed text-base md:text-lg [&>p]:mb-4 last:[&>p]:mb-0 [&_strong]:text-black group-hover:[&_strong]:text-orange-600 transition-colors" 
          dangerouslySetInnerHTML={{ __html: data.mission || '' }} 
        />
      </div>
    </div>
  );
}