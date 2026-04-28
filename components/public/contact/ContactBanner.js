'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';

export default function ContactBanner() {
    const { banners, loading } = usePublicBanners('contact');
    
    if (loading || banners.length === 0) return <div className="h-[75vh] bg-[#0e2188] animate-pulse" />;
    const banner = banners[0];

    return (
        <section className="relative h-[75vh] min-h-[600px] w-full bg-[#0e2188] overflow-hidden flex items-center font-sans">
            {/* Background Image & Premium Overlay */}
            <div className="absolute inset-0">
                <img 
                    src={getImageUrl(banner.image)} 
                    alt={banner.name} 
                    className="w-full h-full object-cover transition-transform duration-[10000ms] scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e2188] via-[#0e2188]/70 to-transparent"></div>
            </div>

            {/* Content Area - Left Aligned */}
            <div className="relative w-full">
                <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                    <div className="max-w-4xl space-y-8 text-left">
                        {/* Accent Tag */}
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[2px] bg-[#e33127]"></span>
                            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                                {banner.name || 'Contact Us'}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white uppercase leading-[1.05] tracking-tighter">
                            {banner.description || 'KẾT NỐI VỚI CHÚNG TÔI'}
                        </h1>

                        {/* Minimalist Accent Line */}
                        <div className="relative pt-4">
                            <div className="w-24 h-[4px] bg-[#e33127] rounded-sm"></div>
                        </div>

                        <p className="max-w-2xl text-zinc-300 text-lg md:text-xl font-medium leading-relaxed opacity-90 italic">
                            Đội ngũ chuyên gia Tân Ngọc Lực luôn sẵn sàng lắng nghe <br />
                            và giải đáp mọi thắc mắc về giải pháp thép tối ưu.
                        </p>
                    </div>
                </Container>
            </div>

            {/* Bottom Decorative Text */}
            <div className="absolute bottom-12 right-12 hidden xl:block pointer-events-none z-10 select-none">
                <p className="text-white/5 font-bold text-[120px] leading-none uppercase tracking-tighter">
                    SUPPORT
                </p>
            </div>
        </section>
    );
}