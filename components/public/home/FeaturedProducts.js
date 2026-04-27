'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

export default function FeaturedProducts() {
    // 🟢 Dùng hook bốc hàng nổi bật
    const { products, loading } = usePublicProducts({ featured: 1 });
    const [hoveredProduct, setHoveredProduct] = useState(null);

    if (loading || !products?.length) return null;

    return (
        <section className="py-24 bg-white font-archivo border-y-8 border-black">
            <Container>
                <div className="flex flex-col lg:flex-row gap-10 items-start justify-between min-h-[600px]">
                    
                    {/* 🟠 CỘT 1 (TRÁI): BẢNG ENGINEERING_SPECS */}
                    <div className="lg:w-[48%] sticky top-32">
                        <AnimatePresence mode="wait">
                            {hoveredProduct ? (
                                <motion.div
                                    key={hoveredProduct.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Tiêu đề đúng icon và style */}
                                    <h2 className="flex items-center gap-4 text-3xl font-black italic uppercase tracking-tighter">
                                        <span className="text-orange-600 text-4xl">⫸</span> ENGINEERING_SPECS
                                    </h2>
                                    
                                    {/* 🟢 CÁI BẢNG ĐÚNG MẪU: 2 Cột, Viền đen dày, Shadow lỳ lợm */}
                                    <div className="grid grid-cols-2 bg-white border-[5px] border-black shadow-[15px_15px_0_0_#eeeeee] overflow-hidden">
                                        {hoveredProduct.attributes?.length > 0 ? (
                                            <>
                                                {hoveredProduct.attributes.map((attr, idx) => (
                                                    <div 
                                                        key={attr.id || idx} 
                                                        className={`flex items-center bg-white h-20
                                                            ${idx % 2 === 0 ? 'border-r-[5px] border-black' : ''} 
                                                            ${idx < hoveredProduct.attributes.length - (hoveredProduct.attributes.length % 2 === 0 ? 2 : 1) ? 'border-b-[5px] border-black' : ''}
                                                        `}
                                                    >
                                                        {/* Nửa trái: Attribute Name (// QUY CÁCH) */}
                                                        <div className="w-1/2 p-4 text-[10px] font-black text-gray-400 italic border-r-2 border-black/5 uppercase leading-tight">
                                                            // {attr.attribute_name}
                                                        </div>
                                                        {/* Nửa phải: Value (222) */}
                                                        <div className="w-1/2 p-4 font-black text-2xl tracking-tighter uppercase text-black">
                                                            {attr.value}
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {/* 🟢 Ô ĐEN LẤP ĐẦY (Nếu số lượng attribute lẻ) */}
                                                {hoveredProduct.attributes.length % 2 !== 0 && (
                                                    <div className="bg-black h-20 border-l-[5px] border-black"></div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="col-span-2 p-20 text-center font-black italic text-gray-300 uppercase tracking-widest bg-gray-50">
                                                // NO_TECHNICAL_DATA_FOUND
                                            </div>
                                        )}
                                    </div>

                                    <Link 
                                        href={`/products/${hoveredProduct.slug}`}
                                        className="inline-block mt-4 text-[11px] font-black border-b-2 border-orange-600 pb-1 hover:text-orange-500 transition-all uppercase tracking-widest"
                                    >
                                        View technical documentation →
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="h-[400px] border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-black italic uppercase text-xs tracking-[0.4em] text-center p-10">
                                    SELECT UNIT TO <br/> DECODE ENGINEERING DATA
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 🟢 CỘT 2 (GIỮA): HÌNH ẢNH TRUNG TÂM */}
                    <div className="lg:w-[25%] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {hoveredProduct && (
                                <motion.div
                                    key={`img-${hoveredProduct.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full aspect-square bg-black border-[10px] border-black shadow-[20px_20px_0_0_#ea580c] overflow-hidden"
                                >
                                    <img 
                                        src={getImageUrl(hoveredProduct.thumbnail)} 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                        alt="Unit Visual"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 🔵 CỘT 3 (PHẢI): DANH SÁCH TÊN SẢN PHẨM */}
                    <div className="lg:w-[25%] max-h-[650px] overflow-y-auto no-scrollbar">
                        <div className="space-y-1">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    onMouseEnter={() => setHoveredProduct(product)}
                                    className={`py-4 border-b border-black/5 cursor-crosshair group flex items-center justify-between transition-all px-4
                                        ${hoveredProduct?.id === product.id ? 'bg-orange-600 text-white shadow-[6px_6px_0_0_#000]' : 'text-zinc-800 hover:bg-zinc-100'}`}
                                >
                                    <span className="text-xl md:text-2xl font-black uppercase italic leading-none tracking-tighter">
                                        {product.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}