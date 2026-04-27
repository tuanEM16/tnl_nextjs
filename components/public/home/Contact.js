'use client';
import Container from '../ui/Container';
import { MdArrowForward } from 'react-icons/md';
import Link from 'next/link';

export default function Contact({ config }) {
    // Đại ca check kỹ key này trong DB là map_iframe hay map_embed nhé
    const mapIframe = config?.map_iframe || config?.map_embed || "";

    return (
        <section className="py-24 bg-white font-archivo">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* CỘT TRÁI (4 phần): TIÊU ĐỀ & NÚT CHUYỂN TRANG */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <span className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase">// Global_Support</span>
                            <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter mt-4 leading-none">
                                LIÊN HỆ <br /> <span className="text-orange-600">BÁO GIÁ.</span>
                            </h2>
                            <p className="mt-6 font-bold text-zinc-500 uppercase text-xs tracking-widest">
                                Kết nối với đội ngũ kỹ thuật Tân Ngọc Lực <br /> để nhận báo giá thép tối ưu nhất.
                            </p>
                        </div>

                        {/* NÚT CHUYỂN QUA TRANG LIÊN HỆ */}
                        <div>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-6 bg-black text-white px-10 py-6 font-black text-lg uppercase tracking-widest shadow-[10px_10px_0_0_#ea580c] hover:bg-orange-600 hover:shadow-[10px_10px_0_0_#000] transition-all duration-300 group"
                            >
                                GỬI YÊU CẦU NGAY
                                <MdArrowForward size={28} className="group-hover:translate-x-3 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    {/* CỘT PHẢI: BẢN ĐỒ */}
                    <div className="lg:col-span-7 relative">
                        {/* Đổ bóng thép */}
                        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 -z-10" />

                        <div className="aspect-video w-full border-4 border-black overflow-hidden bg-zinc-200">
                            {/* 🟢 CHIÊU ĐỘC: Cưỡng ép tất cả iframe bên trong phải rộng 100% cao 100% */}
                            <div
                                className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                                dangerouslySetInnerHTML={{ __html: mapIframe }}
                            />
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}