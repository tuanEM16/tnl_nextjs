'use client';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-archivo">
      <div className="text-orange-600 font-black italic uppercase tracking-widest text-2xl animate-pulse text-center px-4">
        <span className="block mb-2">// ĐANG NUNG CHẢY DỮ LIỆU THÉP...</span>
        <div className="w-full h-2 bg-gray-100 border-2 border-black mt-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-orange-600 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}