// app/(public)/page.js
import HeroBanner from '@/components/public/home/HeroBanner';
import IntroSection from '@/components/public/home/IntroSection';
import SEO from '@/components/public/shared/SEO';
import CategoryGrid from '@/components/public/home/CategoryGrid';
import FeaturedProducts from '@/components/public/home/FeaturedProducts';
import Partners from '@/components/public/home/Partners'; // 🟢 Mới thêm
import LatestNews from '@/components/public/home/LatestNews';
export default function HomePage() {
    return (
        <>
            {/* 🔴 Cấu hình SEO cho trang chủ */}
            <SEO
                title="Trang chủ"
                description="Chào mừng đến với Tân Ngọc Lực - Đơn vị cung cấp thép xây dựng hàng đầu tại Tây Ninh."
            />

            <div className="space-y-0">
                {/* 1. Phần Banner lớn */}
                <HeroBanner />

                {/* 2. Phần giới thiệu công ty */}
                <IntroSection />
                <CategoryGrid />
                <FeaturedProducts />
                <LatestNews />
                <Partners />
                <section className="py-24 bg-gray-50">
                    {/* Má sẽ đúc tiếp ở bước sau */}
                    <p className="text-center font-black italic text-gray-200 text-9xl opacity-5">PRODUCTS_LOADING...</p>
                </section>
            </div>
        </>
    );
}