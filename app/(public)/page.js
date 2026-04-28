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
    const [
        introRes,
        allProjectsRes,
        configRes,
        newsRes,
        categoryRes,
        productRes,
        partnerRes,
        certRes
    ] = await Promise.all([
        postService.getAll({ post_type: 'page', page_slug: 'trang_chu' }),
        postService.getAll({ post_type: 'project', limit: 10 }),
        configService.getAll(),
        postService.getAll({ post_type: 'post', limit: 3 }),
        categoryService.getAll({ limit: 10 }),
        postService.getAll({ post_type: 'product', limit: 8 }),
        postService.getAll({ post_type: 'partner' }),
        postService.getAll({ post_type: 'certificate' })
    ]);

    const config      = configRes?.data || {};
    const introData   = introRes?.data?.[0] || null;
    const projectData = allProjectsRes?.data || [];
    const newsData    = newsRes?.data || [];
    const catData     = categoryRes?.data || [];
    const productData = productRes?.data || [];
    const partnerData = partnerRes?.data || [];
    const certData    = certRes?.data || [];

    const introVideo   = config.meta?.find(m => m.meta_key === 'intro_video')?.meta_value || '';
    const leftImages   = [projectData[0]?.image, newsData[0]?.image, catData[0]?.image].filter(Boolean);
    const rightImages  = [projectData[1]?.image, newsData[1]?.image, catData[1]?.image].filter(Boolean);

    return (
        <>
            <SEO title="Trang chủ - Tân Ngọc Lực Steel" config={config} />

            <div className="space-y-0">

                {/* 1 ── ẤN TƯỢNG ĐẦU TIÊN */}
                <HeroBanner config={config} />

                {/* 2 ── GIỚI THIỆU CÔNG TY (đẩy lên ngay sau banner)
                    Khách hàng vừa thấy visual đẹp → muốn biết đây là ai ngay */}
                {introData && (
                    <IntroSection
                        data={introData}
                        config={config}
                        projectsCount={allProjectsRes?.total || projectData.length}
                    />
                )}

                {/* 3 ── VIDEO KỂ CHUYỆN THƯƠNG HIỆU
                    Sau khi đọc intro, video củng cố cảm xúc và tăng thời gian ở lại trang */}
                <VideoScrollSection
                    description={config.meta_description}
                    videoUrl={introVideo}
                    leftImages={leftImages}
                    rightImages={rightImages}
                />

                {/* 4 ── DỰ ÁN NỔI BẬT
                    Bằng chứng thực tế: "chúng tôi đã làm được điều này" */}
                <Projects data={projectData} />

                {/* 5 ── CHỨNG CHỈ NĂNG LỰC
                    Ngay sau dự án → đóng dấu uy tín, xây dựng niềm tin */}
                <Certificates data={certData} />

                {/* 6 ── ĐỐI TÁC
                    Những thương hiệu lớn đã tin tưởng → social proof mạnh */}
                <Partners data={partnerData} />

                {/* 7 ── DANH MỤC SẢN PHẨM
                    Sau khi tin tưởng, khách bắt đầu tìm hiểu sản phẩm/dịch vụ */}
                <CategoryGrid data={catData} />

                {/* 8 ── SẢN PHẨM TIÊU BIỂU
                    Đẩy các sản phẩm nổi bật để kích thích khám phá sâu hơn */}
                <FeaturedProducts data={productData} />

                {/* 9 ── TIN TỨC MỚI NHẤT
                    Cho thấy công ty đang hoạt động tích cực, nội dung luôn cập nhật */}
                <LatestNews data={newsData} />

                {/* 10 ── LIÊN HỆ
                    CTA cuối trang — sau khi đã hiểu và tin tưởng */}
                <Contact config={config} />

  

            </div>
        </>
    );
}
