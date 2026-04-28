'use client';
import { useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import { MdArrowForward } from 'react-icons/md';

export default function CategoryGrid({ data }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  if (!data || data.length === 0) return null;

  const CARD_W = 450;
  const GAP = 48;

  const totalWidth = data.length * (CARD_W + GAP);
  const viewportWidth = 1200;

  // ✅ FIX: Dùng px thay vì %
  // % được tính theo width của motion.div — nhưng motion.div chưa có width tường minh
  // nên trình duyệt fallback về viewport width → cards bị thu nhỏ và chồng lên nhau
  const scrollDistance = totalWidth - viewportWidth;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0px', `-${scrollDistance}px`]
  );

  const sectionHeight = useMemo(() => `${data.length * 100}vh`, [data.length]);

  return (
    <section
      ref={targetRef}
      className="relative bg-white font-sans"
      style={{ height: sectionHeight }} // ✅ áp sectionHeight thay vì hardcode h-[400vh]
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

        {/* HEADER */}
        <div className="px-6 md:px-12 lg:px-20 mb-16 flex justify-between items-end z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-[#e33127]"></span>
              <span className="text-[#e33127] font-semibold text-xs tracking-[0.4em] uppercase">
                Product Categories
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-[#0e2188]">
              SẢN PHẨM <span className="text-gray-300">CHỦ LỰC</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-3 text-[#0e2188] font-bold tracking-widest text-xs uppercase hover:text-[#e33127] transition-colors"
          >
            TẤT CẢ SẢN PHẨM
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#e33127]">
              <MdArrowForward />
            </div>
          </Link>
        </div>

        {/* SCROLL HORIZONTAL
            ✅ w-max: đảm bảo motion.div rộng đúng bằng tổng các card
            Nếu thiếu w-max, flexbox sẽ wrap hoặc compress cards vào viewport */}
        <motion.div style={{ x }} className="flex gap-12 px-6 md:px-12 lg:px-20 w-max">

          {data.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group relative shrink-0 w-[350px] md:w-[450px] aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden transition-all duration-500"
            >
              <img
                src={getImageUrl(cat.image)}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0e2188]/80 via-[#0e2188]/20 to-transparent" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-white/60 text-[10px] font-semibold tracking-[0.3em] uppercase mb-2">
                  Category_ID: {cat.id}
                </span>

                <h3 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
                  {cat.name}
                </h3>

                <div className="w-12 h-[2px] bg-[#e33127] group-hover:w-full transition-all duration-700"></div>

                <div className="mt-6 flex items-center gap-2 text-white text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  EXPLORE <MdArrowForward />
                </div>
              </div>
            </Link>
          ))}

        </motion.div>

        {/* PROGRESS */}
        <div className="absolute bottom-16 left-6 md:left-20 right-6 md:right-20">
          <div className="flex justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest">01</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest">
              {data.length < 10 ? `0${data.length}` : data.length}
            </span>
          </div>

          <div className="h-[2px] w-full bg-gray-100">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full bg-[#0e2188] origin-left"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
