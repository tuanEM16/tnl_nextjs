'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function ProjectBanner() {
    const { banners, loading } = usePublicBanners('project');
    if (loading || banners.length === 0) return <div className="h-[85vh] bg-black animate-pulse" />;

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden">
            <Swiper modules={[Autoplay, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }} autoplay={{ delay: 5000 }} loop={banners.length > 1} className="h-full w-full">
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative overflow-hidden bg-black">
                        <div className="absolute inset-0">
                            <img src={getImageUrl(banner.image)} alt={banner.name} className="w-full h-full object-cover opacity-75" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent"></div>
                        </div>
                        <div className="relative h-full w-full flex items-center justify-start">
                            <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                                <div className="max-w-4xl space-y-10 text-left">
                                    <div className="inline-block bg-orange-600 text-white px-5 py-2 font-black text-xs tracking-[0.4em] uppercase shadow-[4px_4px_0_0_#fff]"> // {banner.name} </div>
                                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white italic uppercase leading-tight tracking-tighter drop-shadow-2xl">
                                        {banner.description || 'CÔNG TRÌNH TIÊU BIỂU'}
                                    </h1>
                                    <div className="flex flex-wrap gap-8 pt-6">
                                        <Link href={banner.link || '#'}><Button variant="primary" className="!px-14 !py-7 font-black uppercase italic shadow-[10px_10px_0_0_#000]">XEM CHI TIẾT</Button></Link>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}