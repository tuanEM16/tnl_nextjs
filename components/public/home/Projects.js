'use client';
import { motion, useMotionValue, useSpring, useMotionValueEvent, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

const CARD_W = 320;
const CARD_H = 460;

function normalizeAngle(angle) {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

function ProjectCard({ item, isActive }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm bg-white">
      <img
        src={getImageUrl(item.image)}
        alt={item.title}
        className={`w-full h-full object-cover transition-all duration-700 pointer-events-none ${
          isActive ? 'scale-105 grayscale-0' : 'scale-100 grayscale brightness-75'
        }`}
      />
      {/* Overlay: subtle gradient consistent with armenia.travel style */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-black/20' : 'bg-black/40'}`} />
      
      <div className="absolute inset-x-0 bottom-0 p-8 text-white z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-[1px] bg-[#e33127]"></span>
          <p className="text-[#e33127] font-bold text-[10px] uppercase tracking-[0.2em]">
            {item.category_name || 'ENGINEERING'}
          </p>
        </div>
        
        <h3 className="text-2xl font-bold uppercase tracking-tight leading-tight mb-4">
          {item.title}
        </h3>

        <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <Link
            href={`/du-an/${item.slug}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase py-2 border-b border-white/50 hover:border-[#e33127] hover:text-[#e33127] transition-all"
          >
            Explore Project
            <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FanCard({ angle, radius, springRot, onClick, children }) {
  const deltaAngle = useTransform(springRot, (rot) => normalizeAngle(angle + rot));
  const x = useTransform(deltaAngle, (a) => radius * Math.sin(a * Math.PI / 180));
  const scale = useTransform(deltaAngle, (a) => 0.6 + 0.4 * Math.cos(a * Math.PI / 180));
  const opacity = useTransform(deltaAngle, (a) => {
    const abs = Math.abs(a);
    return abs < 60 ? 1 : Math.max(0.1, 1 - (abs - 60) / 50);
  });
  const zIndex = useTransform(deltaAngle, (a) => 100 - Math.floor(Math.abs(a)));

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${CARD_W}px`,
        height: '100%',
        left: '50%',
        top: 0,
        x,
        scale,
        opacity,
        zIndex,
        translateX: '-50%',
        transformOrigin: 'center center',
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

export default function Projects({ data }) {
  if (!data || data.length === 0) return null;

  const total = data.length;
  const ANGLE = 360 / total;
  const radius = Math.max(CARD_W * total / 4.5, 400);

  const rotY = useMotionValue(0);
  const springRot = useSpring(rotY, { stiffness: 45, damping: 20, mass: 1.2 });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(springRot, 'change', (v) => {
    const idx = ((Math.round(-v / ANGLE) % total) + total) % total;
    setActiveIndex(idx);
  });

  const ptr = useRef(null);

  const onPointerDown = (e) => {
    ptr.current = {
      startX: e.clientX,
      base: rotY.get(),
      lastX: e.clientX,
      lastT: Date.now(),
      vel: 0,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!ptr.current) return;
    const dt = Date.now() - ptr.current.lastT;
    if (dt > 0) ptr.current.vel = (e.clientX - ptr.current.lastX) * 0.3 / dt;
    ptr.current.lastX = e.clientX;
    ptr.current.lastT = Date.now();
    rotY.set(ptr.current.base + (e.clientX - ptr.current.startX) * 0.2);
  };

  const onPointerUp = () => {
    if (!ptr.current) return;
    const projected = rotY.get() + ptr.current.vel * 250;
    const snapped = Math.round(projected / ANGLE) * ANGLE;
    rotY.set(snapped);
    ptr.current = null;
  };

  const goTo = (i) => {
    const idx = ((i % total) + total) % total;
    rotY.set(-idx * ANGLE);
  };

  return (
    <section className="relative py-32 bg-white text-[#0e2188] overflow-hidden font-sans select-none">
      {/* Header Section */}
      <div className="container mx-auto px-6 md:px-12 mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-[#e33127]"></span>
            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
              Portfolio
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.95]">
            DỰ ÁN <span className="text-zinc-300">TIÊU BIỂU</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:block text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Drag to browse</p>
            <div className="h-[1px] w-24 bg-zinc-200 relative overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 w-1/2 bg-[#0e2188]"
               />
            </div>
          </div>
          <div className="text-6xl font-light text-zinc-100 hidden md:block">
            {String(activeIndex + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Fan Area */}
      <div
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        style={{ height: `${CARD_H + 120}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { ptr.current = null; }}
      >
        <div style={{ position: 'relative', width: `${CARD_W}px`, height: `${CARD_H}px`, margin: '0 auto' }}>
          {data.map((item, index) => {
            const angle = ANGLE * index;
            return (
              <FanCard
                key={item.id}
                angle={angle}
                radius={radius}
                springRot={springRot}
                onClick={() => goTo(index)}
              >
                <ProjectCard item={item} isActive={index === activeIndex} />
              </FanCard>
            );
          })}
        </div>
      </div>

      {/* Modern Pagination Dots */}
      <div className="flex justify-center items-center gap-4 mt-12">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === activeIndex 
              ? 'w-12 h-[2px] bg-[#e33127]' 
              : 'w-2 h-[2px] bg-zinc-200 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-12 mt-12 md:hidden">
        <button onClick={() => goTo(activeIndex - 1)} className="text-[#0e2188] hover:text-[#e33127] transition-colors">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => goTo(activeIndex + 1)} className="text-[#0e2188] hover:text-[#e33127] transition-colors">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}