'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { publicService } from '@/services/publicService';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import ProjectBanner from '@/components/public/project/ProjectBanner';
import { MdArrowForward, MdKeyboardArrowDown } from 'react-icons/md';

const generateSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-").replace(/^-|-$/g, "");
};

function ProjectContent() {
    const [allProjects, setAllProjects] = useState([]); // Kho tổng
    const [filteredProjects, setFilteredProjects] = useState([]); // Kho sau khi lọc category
    const [visibleCount, setVisibleCount] = useState(9); // 🟢 Mặc định hiện 3 hàng (3x3=9)
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    useEffect(() => {
        setLoading(true);
        publicService.getProjects()
            .then(res => {
                const dataArray = res?.data || []; 
                const projects = Array.isArray(dataArray) ? dataArray : [];
                setAllProjects(projects);
                
                if (categoryQuery) {
                    const filtered = projects.filter(item => {
                        const catSlug = item.category_slug || generateSlug(item.category_name);
                        return String(item.category_id) === categoryQuery || catSlug === categoryQuery;
                    });
                    setFilteredProjects(filtered);
                } else {
                    setFilteredProjects(projects);
                }
                setVisibleCount(9); // Reset về 9 khi đổi danh mục
            })
            .catch(err => console.error("LỖI BỐC DỰ ÁN:", err))
            .finally(() => setLoading(false));
    }, [categoryQuery]);

    // Hàm xử lý hiện thêm
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6); // Mỗi lần bấm hiện thêm 2 hàng (6 cái)
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-[#e33127] rounded-full animate-spin mb-4"></div>
            <p className="text-[#0e2188] font-bold uppercase tracking-[0.3em] text-xs">Truy xuất dữ liệu công trình...</p>
        </div>
    );

    return (
        <section className="py-24 lg:py-32">
            <Container>
                {/* Section Header */}
                <div className="mb-20 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-[2px] bg-[#e33127]"></span>
                        <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">Success Stories</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188] leading-[0.95]">
                        DỰ ÁN ĐÃ <br/> <span className="text-zinc-300">THỰC HIỆN</span>
                    </h1>
                </div>

                {filteredProjects.length > 0 ? (
                    <>
                        {/* 🟢 GRID 3 CỘT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProjects.slice(0, visibleCount).map((item) => (
                                <Link key={item.id} href={`/projects/${item.slug}`} className="group block">
                                    <div className="flex flex-col h-full bg-white transition-all duration-500">
                                        {/* Image Container - ĐÃ BỎ GRAYSCALE (MÀU NGUYÊN BẢN) */}
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-zinc-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                            <img
                                                src={getImageUrl(item.image)}
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                                alt={item.title}
                                            />
                                            <div className="absolute inset-0 bg-[#0e2188]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        </div>

                                        <div className="py-6 space-y-3 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-[1px] bg-[#e33127]"></span>
                                                <span className="text-[9px] font-bold text-[#e33127] uppercase tracking-[0.2em]">
                                                    {item.category_name || 'Steel Construction'}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold uppercase tracking-tight text-[#0e2188] group-hover:text-[#e33127] transition-colors duration-300 leading-tight line-clamp-2">
                                                {item.title}
                                            </h2>
                                            <p className="font-medium text-zinc-500 line-clamp-3 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* 🟢 NÚT XEM THÊM - CĂN GIỮA, STYLE THEO HÌNH CỦA ĐẠI CA */}
                        {visibleCount < filteredProjects.length && (
                            <div className="mt-20 flex justify-center">
                                <button 
                                    onClick={handleLoadMore}
                                    className="group flex items-center gap-4 bg-[#9d0a0e] hover:bg-[#0e2188] text-white pl-8 pr-2 py-2 rounded-full transition-all duration-500 shadow-xl shadow-red-900/20"
                                >
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Xem thêm</span>
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#9d0a0e] group-hover:text-[#0e2188] transition-colors">
                                        <MdKeyboardArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
                                    </div>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-32 text-center border border-dashed border-zinc-100 rounded-sm">
                        <p className="font-bold text-zinc-300 uppercase tracking-widest text-sm italic">
                            Chưa có hồ sơ dự án nào phù hợp
                        </p>
                    </div>
                )}
            </Container>
        </section>
    );
}

export default function ProjectPage() {
    return (
        <main className="bg-white min-h-screen font-sans">
            <ProjectBanner />
            <Suspense fallback={<div className="py-40 text-center font-bold tracking-widest uppercase text-[#0e2188] animate-pulse">ĐANG TẢI...</div>}>
                <ProjectContent />
            </Suspense>
        </main>
    );
}