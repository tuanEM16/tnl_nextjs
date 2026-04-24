'use client';
import { memo } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { usePublicContact } from '@/hooks/public/usePublicContact'; // 🟢 Triệu hồi hook mới
import Container from '@/components/public/ui/Container';
import { MdPhoneInTalk, MdMail, MdLocationOn, MdSend, MdBusiness } from 'react-icons/md';
import NewsBanner from '@/components/public/contact/ContactBanner';
import ContactBanner from '../../../components/public/contact/ContactBanner';
// 🟢 MAP ĐƯỢC CỐ ĐỊNH BÊN NGOÀI ĐỂ KHÔNG LOAD LẠI
const ContactMap = memo(({ embedCode }) => {
    if (!embedCode) return null;
    return (
        <div className="border-4 border-black shadow-[12px_12px_0_0_#000] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 aspect-video lg:aspect-square">
            <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: embedCode }}
            />
        </div>
    );
});
ContactMap.displayName = 'ContactMap';

export default function ContactPage() {
    const { formData: config } = useConfig();
    
    // 🟢 DÙNG HOOK ĐÃ TÁCH
    const { form, loading, handleChange, handleSubmit } = usePublicContact();

    return (
        <div className=" bg-white">
            <ContactBanner/>
            <Container>
                <div className="mb-16">
                    <span className="text-orange-600 font-black tracking-[0.4em] uppercase text-xs">// GLOBAL SUPPORT</span>
                    <h1 className="text-8xl font-black italic uppercase leading-none tracking-tighter">LIÊN HỆ <span className="text-gray-300">/</span> BÁO GIÁ</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* 🔵 CỘT TRÁI: INFO & MAP */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-black text-white p-10 border-[6px] border-black shadow-[12px_12px_0_0_#ea580c]">
                            <h2 className="text-2xl font-black italic uppercase border-b-2 border-white/20 pb-4 mb-8 flex items-center gap-3">
                                <MdBusiness className="text-orange-600" /> CORPORATE INFO
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <MdLocationOn className="text-orange-600 shrink-0" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Địa chỉ xưởng</p>
                                        <p className="font-bold text-sm leading-tight">{config.address || 'Đang cập nhật...'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <MdPhoneInTalk className="text-orange-600 shrink-0" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Hotline báo giá</p>
                                        <p className="font-bold text-xl">{config.hotline || config.phone || '0366.xxx.xxx'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <MdMail className="text-orange-600 shrink-0" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Email phòng kinh doanh</p>
                                        <p className="font-bold text-sm lowercase">{config.email || 'info@tanngocluc.vn'}</p>
                                    </div>
                                </div>
                                <ContactMap embedCode={config.map_embed} />
                            </div>
                        </div>
                    </div>

                    {/* 🟠 CỘT PHẢI: FORM */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-gray-50 border-[6px] border-black p-10 lg:p-16 space-y-8">
                            <div className="border-l-8 border-orange-600 pl-6 mb-10">
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">GỬI YÊU CẦU TRỰC TUYẾN</h3>
                                <p className="font-bold text-gray-500 uppercase text-xs mt-2">Phòng kinh doanh sẽ phản hồi trong vòng 15 phút</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên khách hàng *</label>
                                    <input required name="name" type="text" value={form.name} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-lg outline-none focus:bg-white focus:shadow-[6px_6px_0_0_#000] transition-all" placeholder="NGUYEN VAN A" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại *</label>
                                    <input required name="phone" type="text" value={form.phone} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-lg outline-none focus:bg-white focus:shadow-[6px_6px_0_0_#000] transition-all" placeholder="090XXXXXXXX" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-lg outline-none focus:bg-white focus:shadow-[6px_6px_0_0_#000] transition-all lowercase" placeholder="abc@gmail.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Thông tin quy cách thép cần báo giá *</label>
                                <textarea required name="content" rows="5" value={form.content} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold text-lg outline-none focus:bg-white focus:shadow-[6px_6px_0_0_#000] transition-all" placeholder="Ví dụ: Cần báo giá 10 tấn thép SS400 độ dày 5mm..." />
                            </div>

                            <button disabled={loading} type="submit" className="group relative w-full bg-black text-white py-8 font-black uppercase italic tracking-[0.4em] overflow-hidden transition-all hover:bg-orange-600">
                                <div className="relative z-10 flex items-center justify-center gap-4">
                                    {loading ? 'SYSTEM CONNECTING...' : <><MdSend size={28} /> XÁC NHẬN GỬI LỆNH</>}
                                </div>
                                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}