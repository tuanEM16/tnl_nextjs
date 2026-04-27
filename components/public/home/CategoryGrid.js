'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import { MdArrowForward } from 'react-icons/md';

export default function CategoryGrid({ data }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Cuộn dọc 400vh thành trượt ngang -80%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  if (!data || data.length === 0) return null;

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-zinc-900 font-archivo">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-10 md:px-20 mb-12 flex justify-between items-end z-10">
          <div className="text-white">
            <span className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase">// Steel_Categories</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mt-4">
              SẢN PHẨM <span className="text-orange-600">CHỦ LỰC.</span>
            </h2>
          </div>
          <Link href="/products" className="text-white font-black italic border-b-4 border-orange-600 hover:text-orange-600 flex items-center gap-2">
            TẤT CẢ <MdArrowForward />
          </Link>
        </div>

        <motion.div style={{ x }} className="flex gap-10 px-10 md:px-20">
          {data.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`} className="group relative shrink-0 w-[400px] md:w-[500px] aspect-[4/5] bg-black border-[6px] border-black overflow-hidden shadow-[20px_20px_0_0_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-500">
              <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent">
                <h3 className="text-white text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">{cat.name}</h3>
                <div className="w-16 h-3 bg-orange-600 group-hover:w-full transition-all duration-700"></div>
              </div>
            </Link>
          ))}
          <div className="shrink-0 w-[400px] flex items-center justify-center border-8 border-black bg-zinc-800 rounded-3xl">
              <p className="text-zinc-700 font-black italic text-6xl uppercase -rotate-90">END OF LINE</p>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-20 right-20 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-orange-600 origin-left" />
        </div>
      </div>
    </section>
  );
}