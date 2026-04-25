// app/(public)/page.js
import HeroBanner from '@/components/public/home/HeroBanner';
import IntroSection from '@/components/public/home/IntroSection';
import SEO from '@/components/public/shared/SEO';
import CategoryGrid from '@/components/public/home/CategoryGrid';
import FeaturedProducts from '@/components/public/home/FeaturedProducts';
import Partners from '@/components/public/home/Partners';
import LatestNews from '@/components/public/home/LatestNews';
import Certificates from '@/components/public/home/Certificates';
import { publicService } from '@/services/publicService';
import { postService } from '@/services/postService';
import { configService } from '@/services/configService';

export default async function HomePage() {
    // 1. Gọi API bốc Intro
    const introRes = await postService.getAll({
        post_type: 'page',
        page_slug: 'trang_chu'
    });

    // 🔴 LỖI TẠI ĐÂY: Phải là introRes.data[0] chứ không phải introRes[0]
    // Vì log Terminal của đại ca hiện: { success: true, data: Array(...) }
    const introData = introRes?.data?.[0] || null;

    // 2. Đếm dự án (Cũng phải chui vào .data)
    const projectRes = await postService.getAll({ post_type: 'project' });
    const projectsCount = projectRes?.data?.length || 0;

    // 3. Lấy config
    const configRes = await configService.getAll();
    const config = configRes?.data || configRes; // Tùy vào BE đại ca trả về cái gì

    return (
        <>
            <SEO title="Trang chủ" config={config} />
            <div className="space-y-0">
                <HeroBanner config={config} />

                {/* 🟢 GIỜ introData ĐÃ CÓ HÀNG, NÓ SẼ HIỆN LÊN! */}
                {introData && (
                    <IntroSection
                        data={introData}
                        config={config}
                        projectsCount={projectsCount}
                    />
                )}
                <Certificates/>
                <CategoryGrid />
                <FeaturedProducts />
                <LatestNews />
                <Partners />

                <section className="py-24 bg-gray-50">
                    <p className="text-center font-black italic text-gray-200 text-9xl opacity-5">PRODUCTS_LOADING...</p>
                </section>
            </div>
        </>
    );
}