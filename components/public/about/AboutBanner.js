'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';

export default function AboutBanner() {
    const { banners, loading } = usePublicBanners('about');
    
    if (loading || banners.length === 0) return <div className="h-[75vh] bg-[#0e2188] animate-pulse" />;
    const banner = banners[0];

    return (
        <section className="relative h-[75vh] min-h-[600px] w-full bg-[#0e2188] overflow-hidden flex items-center font-sans">
            {/* Background Image & Premium Overlay */}
            <div className="absolute inset-0">
                <img 
                    src={getImageUrl(banner.image)} 
                    alt={banner.name} 
                    className="w-full h-full object-cover transition-transform duration-[10000ms] scale-105 opacity-80" 
                />
                {/* Lớp phủ Navy Gradient đặc trưng của thương hiệu */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e2188] via-[#0e2188]/60 to-transparent"></div>
            </div>

            {/* Content Area - Dạt trái kịch khung theo style Armenia Travel */}
            <div className="relative w-full">
                <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                    <div className="max-w-5xl space-y-8 text-left">
                        
                        {/* Accent Label - Red #e33127 */}
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[2px] bg-[#e33127]"></span>
                            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                                {banner.name || 'About Us'}
                            </span>
                        </div>

                        {/* Main Heading - Bold, Uppercase, Tracking Tighter */}
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white uppercase leading-[1.05] tracking-tighter">
                            {banner.description || 'TẦM NHÌN & SỨ MỆNH'}
                        </h1>

                        {/* Highlighted Description - Border Red */}
                        <div className="max-w-2xl border-l-4 border-[#e33127] pl-8">
                            <p className="text-zinc-300 font-medium text-lg md:text-xl leading-relaxed uppercase opacity-90 italic">
                                Hơn 20 năm khẳng định vị thế dẫn đầu <br/> 
                                trong ngành thép xây dựng tại Việt Nam.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Decorative Background Text (Premium Vibe) */}
            <div className="absolute bottom-12 right-12 hidden xl:block pointer-events-none z-10 select-none">
                <p className="text-white/5 font-bold text-[120px] leading-none uppercase tracking-tighter">
                    HISTORY
                </p>
            </div>
        </section>
    );
}