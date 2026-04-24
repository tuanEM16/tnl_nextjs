'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Link from 'next/link';

// 🟢 Triệu hồi động cơ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function ProductBanner() {
    const { banners, loading } = usePublicBanners('product');

    if (loading || banners.length === 0) return <div className="h-[85vh] bg-black animate-pulse" />;

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={banners.length > 1} // Chỉ lặp nếu có từ 2 banner
                className="h-full w-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative overflow-hidden bg-black">
                        
                        {/* Background Image từ DB */}
                        <div className="absolute inset-0">
                            <img 
                                src={getImageUrl(banner.image)} 
                                alt={banner.name} 
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent"></div>
                        </div>

                        {/* 🔴 CONTENT - DẠT TRÁI MAX TẦM */}
                        <div className="relative h-full w-full flex items-center justify-start">
                            <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                                <div className="max-w-4xl space-y-10 text-left">
                                    <div className="inline-block bg-orange-600 text-white px-5 py-2 font-black text-xs tracking-[0.4em] uppercase shadow-[4px_4px_0_0_#fff]">
                                        // {banner.name}
                                    </div>
                                    
                                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white italic uppercase leading-tight tracking-tighter drop-shadow-2xl">
                                        {banner.description}
                                    </h1>

                                    <p className="text-gray-300 font-bold text-lg md:text-xl max-w-xl leading-relaxed border-l-8 border-orange-600 pl-8 uppercase italic">
                                        CHUYÊN CUNG ỨNG THÉP XÂY DỰNG CHẤT LƯỢNG CAO CHO MỌI CÔNG TRÌNH TẠI TÂY NINH.
                                    </p>

                                    {/* 🔘 NÚT BẤM CHỐT CHẾT - LINK ADMIN QUYẾT ĐỊNH */}
                                    <div className="flex flex-wrap gap-8 pt-6">
                                        <Link href={banner.link || '#'}>
                                            <Button variant="primary" className="!px-14 !py-7 font-black uppercase italic shadow-[10px_10px_0_0_#000]">
                                                XEM CHI TIẾT
                                            </Button>
                                        </Link>

                                        <Link href="/contact">
                                            <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black !px-14 !py-7 font-black uppercase italic shadow-[10px_10px_0_0_#ea580c]">
                                                BÁO GIÁ NGAY
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 right-10 hidden xl:block pointer-events-none z-10">
                <div className="border-4 border-white/10 p-10 backdrop-blur-sm">
                    <p className="text-white font-black text-6xl italic opacity-10 tracking-tighter uppercase">
                        TNL_PRODUCT_CORE
                    </p>
                </div>
            </div>
        </section>
    );
}