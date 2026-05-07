'use client';
import { MdVisibility, MdTrackChanges } from 'react-icons/md';
import Container from '../ui/Container';

export default function VisionMission({ data }) {
  if (!data) return null;

  return (
    <section className="py-24 md:py-32 bg-white font-sans overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* 🔴 TẦM NHÌN (Vision) - Premium Dark Style */}
          <div className="relative group p-10 md:p-16 bg-[#0e2188] rounded-sm shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Icon Block */}
            <div className="w-16 h-16 bg-white/10 rounded-sm flex items-center justify-center mb-10 group-hover:bg-[#e33127] transition-colors duration-500">
              <MdVisibility size={32} className="text-white" />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-[2px] bg-[#e33127]"></span>
                <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                  Future Goals
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">
                Tầm Nhìn
              </h2>

              <div 
                className="text-zinc-300 font-medium leading-relaxed text-base md:text-lg prose prose-invert prose-strong:text-[#e33127] prose-strong:font-bold" 
                dangerouslySetInnerHTML={{ __html: data.vision || '' }} 
              />
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rotate-45 pointer-events-none"></div>
          </div>

          {/* ⚪ SỨ MỆNH (Mission) - Premium Light Style */}
          <div className="relative group p-10 md:p-16 bg-zinc-50 border border-zinc-100 rounded-sm shadow-xl transition-all duration-500 hover:-translate-y-2">
            {/* Icon Block */}
            <div className="w-16 h-16 bg-[#0e2188]/5 rounded-sm flex items-center justify-center mb-10 group-hover:bg-[#e33127] transition-colors duration-500">
              <MdTrackChanges size={32} className="text-[#0e2188] group-hover:text-white" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-[2px] bg-[#e33127]"></span>
                <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                  Core Mission
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-[#0e2188]">
                Sứ Mệnh
              </h2>

              <div 
                className="text-zinc-500 font-medium leading-relaxed text-base md:text-lg prose prose-zinc prose-strong:text-[#0e2188] prose-strong:font-bold group-hover:prose-strong:text-[#e33127] transition-colors" 
                dangerouslySetInnerHTML={{ __html: data.mission || '' }} 
              />
            </div>

            {/* Decorative line bottom */}
            <div className="absolute bottom-0 left-0 w-0 h-[4px] bg-[#e33127] group-hover:w-full transition-all duration-700"></div>
          </div>

        </div>
      </Container>
    </section>
  );
}