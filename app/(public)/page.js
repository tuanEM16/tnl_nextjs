import HeroBanner from '@/components/public/home/HeroBanner';
import IntroSection from '@/components/public/home/IntroSection';
import SEO from '@/components/public/shared/SEO';
import CategoryGrid from '@/components/public/home/CategoryGrid';
import FeaturedProducts from '@/components/public/home/FeaturedProducts';
import Partners from '@/components/public/home/Partners';
import LatestNews from '@/components/public/home/LatestNews';
import Certificates from '@/components/public/home/Certificates';
import Projects from '@/components/public/home/Projects';
import Contact from '@/components/public/home/Contact';
import VideoScrollSection from '@/components/public/home/VideoScrollSection';
import { postService } from '@/services/postService';
import { configService } from '@/services/configService';
import { categoryService } from '@/services/categoryService'; 

export default async function HomePage() {
    // 🟢 1. TỔNG LỰC BỐC DỮ LIỆU (Thêm sản phẩm, đối tác, chứng chỉ)
    const [
        introRes, 
        allProjectsRes, 
        configRes, 
        newsRes, 
        categoryRes,
        productRes, // Hàng mới
        partnerRes, // Hàng mới
        certRes     // Hàng mới
    ] = await Promise.all([
        postService.getAll({ post_type: 'page', page_slug: 'trang_chu' }),
        postService.getAll({ post_type: 'project', limit: 10 }), // Lấy nhiều chút để quay 3D cho sướng
        configService.getAll(),
        postService.getAll({ post_type: 'post', limit: 3 }),
        categoryService.getAll({ limit: 10 }), // Lấy hết danh mục để chạy Side-Scroll
        postService.getAll({ post_type: 'product', limit: 8 }),
        postService.getAll({ post_type: 'partner' }),
        postService.getAll({ post_type: 'certificate' })
    ]);

    // 🟢 2. GIẢI MÃ DỮ LIỆU
    const config = configRes?.data || {};
    const introData = introRes?.data?.[0] || null;
    const projectData = allProjectsRes?.data || [];
    const newsData = newsRes?.data || [];
    const catData = categoryRes?.data || [];
    const productData = productRes?.data || [];
    const partnerData = partnerRes?.data || [];
    const certData = certRes?.data || [];

    // Tìm video intro từ config_meta
    const introVideo = config.meta?.find(m => m.meta_key === 'intro_video')?.meta_value || "";

    // Chia ảnh đối xứng cho VideoScrollSection
    const leftImages = [projectData[0]?.image, newsData[0]?.image, catData[0]?.image].filter(Boolean);
    const rightImages = [projectData[1]?.image, newsData[1]?.image, catData[1]?.image].filter(Boolean);

    return (
        <>
            <SEO title="Trang chủ - Tân Ngọc Lực Steel" config={config} />
            
            <div className="space-y-0">
                <HeroBanner config={config} />

                {/* VIDEO GIÃN NỞ */}
                <VideoScrollSection 
                    description={config.meta_description} 
                    videoUrl={introVideo} 
                    leftImages={leftImages}
                    rightImages={rightImages}
                />

                {/* INTRO TĨNH */}
                {introData && (
                    <IntroSection
                        data={introData}
                        config={config}
                        projectsCount={allProjectsRes?.total || projectData.length}
                    />
                )}

                {/* 🟢 CATEGORY: Đổ data trực tiếp vào để trượt ngang vô tận */}
                <CategoryGrid data={catData} />

                {/* 🟢 PRODUCTS: Đổ data sản phẩm tiêu biểu */}
                <FeaturedProducts data={productData} />

                {/* 🟢 PROJECTS: Vòng quay 3D đại ca vừa siết */}
                <Projects data={projectData} />

                {/* 🟢 CERTIFICATES: Chứng chỉ năng lực */}
                <Certificates data={certData} />

                <LatestNews data={newsData} />
                
                <Partners data={partnerData} />
                
                <Contact config={config} />

                {/* FOOTER DECOR */}
                <section className="py-24 bg-gray-50 border-t-8 border-black">
                    <p className="text-center font-black italic text-gray-200 text-7xl md:text-9xl opacity-10 tracking-tighter uppercase select-none">
                        Tan Ngoc Luc . 2026
                    </p>
                </section>
            </div>
        </>
    );
}