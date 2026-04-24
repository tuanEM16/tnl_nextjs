'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';

export default function AboutBanner() {
    const { banners, loading } = usePublicBanners('about');
    if (loading || banners.length === 0) return <div className="h-[85vh] bg-black animate-pulse" />;
    const banner = banners[0];

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden flex items-center">
            <div className="absolute inset-0">
                <img src={getImageUrl(banner.image)} alt={banner.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent"></div>
            </div>
            <div className="relative w-full">
                <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                    <div className="max-w-4xl space-y-8 text-left">
                        <div className="inline-block bg-orange-600 text-white px-5 py-2 font-black text-xs tracking-[0.4em] uppercase shadow-[4px_4px_0_0_#fff]"> // ABOUT_US </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white italic uppercase leading-tight tracking-tighter drop-shadow-2xl">
                            {banner.description || 'TẦM NHÌN & SỨ MỆNH'}
                        </h1>
                        <p className="text-gray-300 font-bold text-lg md:text-xl max-w-xl leading-relaxed border-l-8 border-orange-600 pl-8 uppercase italic">
                            Hơn 20 năm khẳng định vị thế dẫn đầu <br/> trong ngành thép xây dựng tại Việt Nam.
                        </p>
                    </div>
                </Container>
            </div>
        </section>
    );
}