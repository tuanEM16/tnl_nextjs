'use client';
import Container from '../ui/Container';
import { MdArrowForward } from 'react-icons/md';
import Link from 'next/link';

export default function Contact({ config }) {
    const mapIframe = config?.map_iframe || config?.map_embed || "";

    return (
        <section className="py-32 bg-white font-sans overflow-hidden border-t border-zinc-100">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    
                    {/* LEFT COLUMN: CONTENT & CTA */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-[#e33127]"></span>
                                <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                                    Global Support
                                </span>
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.95] text-[#0e2188]">
                                LIÊN HỆ <br /> 
                                <span className="text-zinc-300">BÁO GIÁ</span>
                            </h2>
                            
                            <p className="max-w-md text-zinc-500 text-lg leading-relaxed">
                                Kết nối với đội ngũ kỹ thuật <span className="text-[#0e2188] font-semibold">Tân Ngọc Lực</span> để nhận giải pháp và báo giá tối ưu nhất cho công trình của bạn.
                            </p>
                        </div>

                        {/* CTA BUTTON - Premium Style */}
                        <div>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-8 bg-[#e33127] text-white px-10 py-6 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#0e2188] hover:gap-12 shadow-xl shadow-red-500/10 group"
                            >
                                Gửi yêu cầu ngay
                                <MdArrowForward size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="pt-8 border-t border-zinc-100 grid grid-cols-2 gap-8">
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Hotline</span>
                                <span className="text-[#0e2188] font-bold">{config?.hotline || "0900.xxx.xxx"}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Email</span>
                                <span className="text-[#0e2188] font-bold">{config?.email || "contact@tanngocluc.vn"}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: MAP */}
                    <div className="lg:col-span-7 relative">
                        {/* Subtle Background Accent */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0e2188]/5 rounded-full -z-10 blur-3xl" />
                        
                        <div className="relative aspect-video w-full rounded-sm overflow-hidden bg-zinc-50 shadow-2xl shadow-[#0e2188]/10 border border-zinc-100 group">
                            {/* Map Overlay for Style */}
                            <div className="absolute inset-0 border-[12px] border-white pointer-events-none z-10" />
                            
                            <div
                                className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
                                dangerouslySetInnerHTML={{ __html: mapIframe }}
                            />
                            
                            {/* Decorative Corner */}
                            <div className="absolute bottom-6 right-6 z-20 bg-[#0e2188] p-4 text-white hidden md:block">
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Văn phòng đại diện</p>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}