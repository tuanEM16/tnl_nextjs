'use client';
import { memo } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { usePublicContact } from '@/hooks/public/usePublicContact';
import Container from '@/components/public/ui/Container';
import { MdPhoneInTalk, MdMail, MdLocationOn, MdSend, MdBusiness } from 'react-icons/md';
import ContactBanner from '@/components/public/contact/ContactBanner';

const ContactMap = memo(({ embedCode }) => {
    if (!embedCode) return null;
    return (
        <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-sm shadow-2xl shadow-[#0e2188]/5 border border-zinc-100 group">
            <div
                className="w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
                dangerouslySetInnerHTML={{ __html: embedCode }}
            />
        </div>
    );
});
ContactMap.displayName = 'ContactMap';

export default function ContactPage() {
    const { formData: config } = useConfig();
    const { form, loading, handleChange, handleSubmit } = usePublicContact();

    return (
        <div className="bg-white font-sans overflow-hidden">
            <ContactBanner />
            
            <Container className="py-20 lg:py-32">
                {/* Section Header */}
                <div className="mb-20 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-[2px] bg-[#e33127]"></span>
                        <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                            Global Support
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.95] text-[#0e2188]">
                        LIÊN HỆ <span className="text-zinc-300">&</span> BÁO GIÁ
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    
                    {/* 🔵 LEFT COLUMN: INFO & MAP */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-10">
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 shrink-0 border border-zinc-100 flex items-center justify-center text-[#e33127] group-hover:bg-[#e33127] group-hover:text-white transition-all duration-500">
                                        <MdLocationOn size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Địa chỉ văn phòng</p>
                                        <p className="font-bold text-[#0e2188] text-sm uppercase leading-tight">{config.address || 'Đang cập nhật...'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 shrink-0 border border-zinc-100 flex items-center justify-center text-[#e33127] group-hover:bg-[#e33127] group-hover:text-white transition-all duration-500">
                                        <MdPhoneInTalk size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hotline báo giá 24/7</p>
                                        <p className="font-bold text-[#0e2188] text-2xl tracking-tighter">
                                            {config.hotline || config.phone || '0366.xxx.xxx'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 shrink-0 border border-zinc-100 flex items-center justify-center text-[#e33127] group-hover:bg-[#e33127] group-hover:text-white transition-all duration-500">
                                        <MdMail size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email kinh doanh</p>
                                        <p className="font-bold text-[#0e2188] text-sm lowercase tracking-tight">{config.email || 'info@tanngocluc.vn'}</p>
                                    </div>
                                </div>
                            </div>

                            <ContactMap embedCode={config.map_embed} />
                        </div>
                    </div>

                    {/* 🟠 RIGHT COLUMN: FORM */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-zinc-50 border border-zinc-100 p-8 lg:p-16 rounded-sm space-y-10 shadow-sm">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold uppercase tracking-tight text-[#0e2188]">Gửi yêu cầu báo giá</h3>
                                <div className="w-12 h-[2px] bg-[#e33127]"></div>
                                <p className="font-medium text-zinc-400 uppercase text-[10px] tracking-widest">Hệ thống tự động chuyển tiếp đến phòng kinh doanh</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Tên khách hàng *</label>
                                    <input required name="name" type="text" value={form.name} onChange={handleChange} 
                                        className="w-full bg-transparent border-b-2 border-zinc-200 py-3 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-all placeholder:text-zinc-200" 
                                        placeholder="NGUYỄN VĂN A" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Số điện thoại *</label>
                                    <input required name="phone" type="text" value={form.phone} onChange={handleChange} 
                                        className="w-full bg-transparent border-b-2 border-zinc-200 py-3 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-all placeholder:text-zinc-200" 
                                        placeholder="090XXXXXXXX" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Email nhận báo giá</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} 
                                    className="w-full bg-transparent border-b-2 border-zinc-200 py-3 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-all placeholder:text-zinc-200" 
                                    placeholder="CLIENT@GMAIL.COM" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Yêu cầu & Quy cách thép *</label>
                                <textarea required name="content" rows="4" value={form.content} onChange={handleChange} 
                                    className="w-full bg-transparent border-b-2 border-zinc-200 py-3 font-medium text-[#0e2188] outline-none focus:border-[#e33127] transition-all placeholder:text-zinc-200 resize-none" 
                                    placeholder="Vd: Cần báo giá thép tấm SS400 độ dày 10mm..." />
                            </div>

                            <button disabled={loading} type="submit" 
                                className="group relative w-full bg-[#e33127] text-white py-6 rounded-sm font-bold uppercase text-xs tracking-[0.4em] overflow-hidden transition-all shadow-xl shadow-red-500/10">
                                <div className="relative z-10 flex items-center justify-center gap-4 group-hover:gap-6 transition-all duration-500">
                                    {loading ? 'SYSTEM CONNECTING...' : <><MdSend size={20} /> Xác nhận gửi</>}
                                </div>
                                <div className="absolute inset-0 bg-[#0e2188] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}