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
    const videoScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1.2]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 0.5, 0]);

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-zinc-950 font-archivo">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">

                    <motion.div style={{ opacity: textOpacity }} className="text-center mb-10">
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
                            {description || "KIẾN TẠO CÔNG TRÌNH VỮNG CHÃI"}
                        </h2>
                    </motion.div>

                    <div className="relative flex items-center justify-center">

                        {/* 🔵 RÈM TRÁI — 2 cột: ngoài (ảnh cao tràn mép) + trong (2 ảnh chồng) */}
                        <motion.div
                            style={{ x: leftX }}
                            className="absolute left-0 z-20 w-[48%] hidden xl:flex items-center gap-2"
                        >
                            <div className="w-[42%] flex-shrink-0 -ml-[18%]">
                                <div className="border-4 border-black bg-zinc-900 shadow-2xl p-1">
                                    <img
                                        src={getImageUrl(leftImages[0])}
                                        className="w-full h-[380px] object-cover grayscale"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                {leftImages.slice(1, 3).map((img, i) => (
                                    <div key={i} className="border-4 border-black bg-zinc-900 shadow-2xl p-1">
                                        <img src={getImageUrl(img)} className="w-full aspect-video object-cover grayscale" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 🟢 VIDEO TRUNG TÂM */}
                        <motion.div
                            style={{ scale: videoScale }}
                            className="z-10 w-full max-w-5xl aspect-video bg-black border-[8px] border-orange-600 shadow-[0_0_100px_rgba(234,88,12,0.4)]"
                        >
                            {videoUrl ? (
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                    <source src={getImageUrl(videoUrl)} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black italic uppercase">
                                    Chưa cấu hình video
                                </div>
                            )}
                        </motion.div>

                        {/* 🔵 RÈM PHẢI — 2 cột: trong (2 ảnh chồng) + ngoài (ảnh cao tràn mép) */}
                        <motion.div
                            style={{ x: rightX }}
                            className="absolute right-0 z-20 w-[48%] hidden xl:flex items-center gap-2"
                        >
                            <div className="flex-1 space-y-2">
                                {rightImages.slice(0, 2).map((img, i) => (
                                    <div key={i} className="border-4 border-black bg-zinc-900 shadow-2xl p-1">
                                        <img src={getImageUrl(img)} className="w-full aspect-video object-cover grayscale" />
                                    </div>
                                ))}
                            </div>
                            <div className="w-[42%] flex-shrink-0 -mr-[18%]">
                                <div className="border-4 border-black bg-zinc-900 shadow-2xl p-1">
                                    <img
                                        src={getImageUrl(rightImages[2])}
                                        className="w-full h-[380px] object-cover grayscale"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}