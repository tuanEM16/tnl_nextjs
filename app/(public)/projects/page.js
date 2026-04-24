'use client';
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import ProjectBanner from '@/components/public/project/ProjectBanner';

export default function ProjectPage() {
    const [project, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicService.getProjects()
            .then(res => {
                // 🟢 SOI ĐÚNG LOG CỦA ĐẠI CA: res là {success: true, data: Array(2)}
                // Vậy dữ liệu nằm trong res.data
                const dataArray = res?.data || []; 
                setProjects(Array.isArray(dataArray) ? dataArray : []);
            })
            .catch(err => console.error("LỖI BỐC DỰ ÁN:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-black text-white font-black animate-pulse">
            // ĐANG TRUY XUẤT CÔNG TRÌNH...
        </div>
    );

    return (
        <main className="bg-white min-h-screen">
            {/* 🔴 CÁI NÀY ĐANG ĐEN VÌ LỖI TÊN (XEM BƯỚC 2 BÊN DƯỚI) */}
            <ProjectBanner />
            
            <section className="py-24">
                <Container>
                    <div className="mb-20 border-l-8 border-orange-600 pl-8">
                        <span className="text-orange-600 font-black tracking-[0.3em] uppercase text-[10px]">
                            // KHÁCH HÀNG TIÊU BIỂU
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mt-4 leading-none">
                            DỰ ÁN ĐÃ <br/> THỰC HIỆN
                        </h1>
                    </div>

                    {project.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {project.map((item) => (
                                <Link key={item.id} href={`/project/${item.slug}`} className="group block">
                                    <div className="border-4 border-black overflow-hidden bg-gray-100 shadow-[12px_12px_0_0_#000] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                                        <div className="relative aspect-[16/10] overflow-hidden border-b-4 border-black">
                                            <img
                                                src={getImageUrl(item.image)}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                alt={item.title}
                                            />
                                        </div>
                                        <div className="p-10 space-y-4">
                                            <h2 className="text-4xl font-black italic uppercase leading-none">{item.title}</h2>
                                            <p className="font-bold text-gray-500 line-clamp-2 uppercase text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                            <div className="pt-6 border-t-2 border-black border-dashed flex justify-between items-center">
                                                <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">// VIEW_CASE_STUDY</span>
                                                <span className="text-3xl">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-4 border-dashed border-gray-100">
                            <p className="font-black italic text-gray-300 uppercase">KHÔNG CÓ DỰ ÁN NÀO ĐỂ HIỂN THỊ</p>
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}