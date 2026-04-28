'use client';
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import ProjectBanner from '@/components/public/project/ProjectBanner';
import { MdArrowForward } from 'react-icons/md';

export default function ProjectPage() {
    const [project, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicService.getProjects()
            .then(res => {
                const dataArray = res?.data || []; 
                setProjects(Array.isArray(dataArray) ? dataArray : []);
            })
            .catch(err => console.error("LỖI BỐC DỰ ÁN:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-[#e33127] rounded-full animate-spin mb-4"></div>
            <p className="text-[#0e2188] font-bold uppercase tracking-[0.3em] text-xs">Truy xuất dữ liệu công trình...</p>
        </div>
    );

    return (
        <main className="bg-white min-h-screen font-sans">
            <ProjectBanner />
            
            <section className="py-24 lg:py-32">
                <Container>
                    {/* Section Header */}
                    <div className="mb-20 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-[2px] bg-[#e33127]"></span>
                            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                                Success Stories
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188] leading-[0.95]">
                            DỰ ÁN ĐÃ <br/> <span className="text-zinc-300">THỰC HIỆN</span>
                        </h1>
                    </div>

                    {project.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                            {project.map((item) => (
                                <Link key={item.id} href={`/project/${item.slug}`} className="group block">
                                    <div className="flex flex-col h-full bg-white transition-all duration-500">
                                        {/* Image Container */}
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-zinc-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                            <img
                                                src={getImageUrl(item.image)}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                                alt={item.title}
                                            />
                                            <div className="absolute inset-0 bg-[#0e2188]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="py-8 space-y-4 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-[1px] bg-[#e33127]"></span>
                                                <span className="text-[10px] font-bold text-[#e33127] uppercase tracking-[0.2em]">Steel Construction</span>
                                            </div>
                                            
                                            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#0e2188] group-hover:text-[#e33127] transition-colors duration-300 leading-tight">
                                                {item.title}
                                            </h2>
                                            
                                            <p className="font-medium text-zinc-500 line-clamp-2 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                            
                                            <div className="pt-6 mt-auto flex items-center justify-between border-t border-zinc-50 group">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#0e2188] group-hover:text-[#e33127] transition-colors">
                                                        View Case Study
                                                    </span>
                                                    <div className="w-8 h-[1px] bg-[#0e2188] group-hover:w-12 group-hover:bg-[#e33127] transition-all"></div>
                                                </div>
                                                <MdArrowForward className="text-2xl text-zinc-200 group-hover:text-[#e33127] group-hover:translate-x-2 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center border border-dashed border-zinc-100 rounded-sm">
                            <p className="font-bold text-zinc-300 uppercase tracking-widest text-sm italic">
                                Chưa có hồ sơ dự án nào để hiển thị
                            </p>
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}