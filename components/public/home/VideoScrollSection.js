'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';

export default function VideoScrollSection({ description, videoUrl, leftImages, rightImages }) {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const leftX = useTransform(scrollYProgress, [0, 0.4], ["-10%", "-120%"]);
    const rightX = useTransform(scrollYProgress, [0, 0.4], ["10%", "120%"]);
    const videoScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1]); // Tỉ lệ 1 để khớp khung hình chuẩn
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 0.5, 0]);

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-white font-sans">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">

                    <motion.div style={{ opacity: textOpacity }} className="text-center mb-12">
                        <div className="flex justify-center mb-4">
                            <span className="h-[2px] w-12 bg-[#e33127]"></span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-[#0e2188] max-w-4xl mx-auto leading-tight">
                            {description || "KIẾN TẠO CÔNG TRÌNH VỮNG CHÃI"}
                        </h2>
                    </motion.div>

                    <div className="relative flex items-center justify-center">

                        {/* 🔵 RÈM TRÁI */}
                        <motion.div
                            style={{ x: leftX }}
                            className="absolute left-0 z-20 w-[45%] hidden xl:flex items-center gap-4"
                        >
                            <div className="w-[45%] flex-shrink-0 -ml-[10%]">
                                <div className="bg-white shadow-xl p-2 rounded-sm overflow-hidden">
                                    <img
                                        src={getImageUrl(leftImages[0])}
                                        className="w-full h-[420px] object-cover"
                                        alt="Gallery left 1"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                {leftImages.slice(1, 3).map((img, i) => (
                                    <div key={i} className="bg-white shadow-xl p-2 rounded-sm overflow-hidden">
                                        <img 
                                            src={getImageUrl(img)} 
                                            className="w-full aspect-[4/3] object-cover" 
                                            alt={`Gallery left ${i + 2}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 🟢 VIDEO TRUNG TÂM */}
                        <motion.div
                            style={{ scale: videoScale }}
                            className="z-10 w-full max-w-5xl aspect-video bg-[#0e2188] overflow-hidden rounded-sm shadow-2xl border-none"
                        >
                            {videoUrl ? (
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                    <source src={getImageUrl(videoUrl)} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 font-bold uppercase tracking-widest text-sm">
                                    Video Content
                                </div>
                            )}
                            {/* Overlay mỏng để tăng độ sâu */}
                            <div className="absolute inset-0 bg-[#0e2188]/5 pointer-events-none" />
                        </motion.div>

                        {/* 🔵 RÈM PHẢI */}
                        <motion.div
                            style={{ x: rightX }}
                            className="absolute right-0 z-20 w-[45%] hidden xl:flex items-center gap-4"
                        >
                            <div className="flex-1 space-y-4">
                                {rightImages.slice(0, 2).map((img, i) => (
                                    <div key={i} className="bg-white shadow-xl p-2 rounded-sm overflow-hidden">
                                        <img 
                                            src={getImageUrl(img)} 
                                            className="w-full aspect-[4/3] object-cover" 
                                            alt={`Gallery right ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="w-[45%] flex-shrink-0 -mr-[10%]">
                                <div className="bg-white shadow-xl p-2 rounded-sm overflow-hidden">
                                    <img
                                        src={getImageUrl(rightImages[2])}
                                        className="w-full h-[420px] object-cover"
                                        alt="Gallery right 3"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                    
                    {/* Decorative Bottom Bar */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#0e2188]">Scroll to explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#0e2188] to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}