'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import Link from 'next/link';

// 🟢 Triệu hồi động cơ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function ProductBanner() {
    const { banners, loading } = usePublicBanners('product');

    if (loading || banners.length === 0) return (
        <div 
            className="h-[85vh] min-h-[600px] w-full animate-pulse" 
            style={{ background: 'linear-gradient(135deg, #0e2188 0%, #e33127 85%, #4a0000 100%)' }}
        />
    );

    return (
        <section 
            className="relative h-[85vh] min-h-[600px] w-full overflow-hidden font-sans"
            style={{ background: 'linear-gradient(135deg, #0e2188 0%, #e33127 85%, #4a0000 100%)' }}
        >
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={banners.length > 1}
                pagination={{ 
                    clickable: true,
                    bulletClass: 'product-bullet',
                    bulletActiveClass: 'product-bullet-active'
                }}
                className="h-full w-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative overflow-hidden">
                        
                        {/* Background Image - Phủ Gradient tương tự Footer để đồng bộ */}
                        <div className="absolute inset-0">
                            <img 
                                src={getImageUrl(banner.image)} 
                                alt={banner.name} 
                                className="w-full h-full object-cover opacity-60 transition-transform duration-[10000ms] scale-110 group-active:scale-100"
                            />
                            {/* Overlay Gradient theo phong cách Footer */}
                            <div 
                                className="absolute inset-0"
                                style={{ 
                                    background: 'linear-gradient(135deg, rgba(14,33,136,0.85) 0%, rgba(227,49,39,0.65) 85%, rgba(74,0,0,0.8) 100%)' 
                                }}
                            ></div>
                        </div>

                        {/* 🔴 CONTENT - Layout tối giản, tinh tế */}
                        <div className="relative h-full w-full flex items-center justify-start z-10">
                            <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                                <div className="max-w-5xl space-y-8 text-left">
                                    {/* Nhãn Tag */}
                                    <div className="flex items-center gap-4">
                                        <span className="w-12 h-[2px] bg-[#e33127]"></span>
                                        <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase drop-shadow-md">
                                            {banner.name}
                                        </span>
                                    </div>
                                    
                                    {/* Tiêu đề chính */}
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[1.1] tracking-tighter drop-shadow-lg">
                                        {banner.description}
                                    </h1>

                                    {/* Slogan mô tả */}
                                    <div className="max-w-2xl border-l-4 border-[#e33127] pl-8">
                                        <p className="text-zinc-200 font-medium text-lg md:text-xl leading-relaxed uppercase opacity-90 italic">
                                            Chuyên cung ứng thép xây dựng chất lượng cao <br/> 
                                            cho mọi công trình bền vững tại Tây Ninh.
                                        </p>
                                    </div>

                                    {/* 🔘 NÚT BẤM */}
                                    <div className="flex flex-wrap gap-6 pt-6">
                                        <Link href={banner.link || '#'}>
                                            <button className="bg-[#e33127] text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188] shadow-xl shadow-black/20">
                                                XEM CHI TIẾT
                                            </button>
                                        </Link>

                                        <Link href="/contact">
                                            <button className="border border-white/30 text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188] backdrop-blur-sm">
                                                BÁO GIÁ NGAY
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Decorative Elements - Text chạy chìm */}
            <div className="absolute bottom-12 right-12 hidden xl:block pointer-events-none z-10 select-none">
                <p className="text-white/5 font-bold text-9xl tracking-tighter uppercase leading-none">
                    TNL_CORE
                </p>
            </div>

            <style jsx global>{`
                .product-bullet {
                    width: 40px;
                    height: 2px;
                    background: rgba(255,255,255,0.3);
                    display: inline-block;
                    margin: 0 6px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                }
                .product-bullet-active {
                    background: #e33127;
                    width: 80px;
                }
                .swiper-pagination {
                    bottom: 40px !important;
                    text-align: right !important;
                    padding-right: 5% !important;
                    z-index: 20 !important;
                }
                @media (max-width: 768px) {
                    .swiper-pagination { text-align: center !important; padding-right: 0 !important; }
                }
            `}</style>
        </section>
    );
}