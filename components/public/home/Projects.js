'use client';
import { motion, useMotionValue, useSpring, useMotionValueEvent, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

const CARD_W = 300;
const CARD_H = 420; // tỉ lệ 3/4

// Chuẩn hóa góc về khoảng -180..180
function normalizeAngle(angle) {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

// Card con (giao diện giữ nguyên)
function ProjectCard({ item, isActive }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      <img
        src={getImageUrl(item.image)}
        alt={item.title}
        className={`w-full h-full object-cover transition-all duration-500 pointer-events-none ${
          isActive ? 'grayscale-0 brightness-100' : 'grayscale brightness-50'
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
        <div className="w-7 h-7 bg-orange-600 rotate-45 mb-4 flex items-center justify-center">
          <span className="-rotate-45 font-black text-[7px]">TNL</span>
        </div>
        <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-1">
          {item.category_name || 'STEEL PROJECT'}
        </p>
        <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">{item.title}</h3>
        {isActive && (
          <Link
            href={`/du-an/${item.slug}`}
            onClick={e => e.stopPropagation()}
            className="mt-4 inline-block text-[10px] font-black border-b-2 border-orange-600 pb-0.5 hover:text-orange-400 transition-colors"
          >
            VIEW CASE STUDY →
          </Link>
        )}
      </div>
    </div>
  );
}

// Card nằm trên quạt 2D
function FanCard({ angle, radius, springRot, onClick, children }) {
  // deltaAngle: góc lệch của card so với hướng nhìn thẳng (0 = chính giữa)
  const deltaAngle = useTransform(springRot, (rot) => normalizeAngle(angle + rot));
  
  // Vị trí ngang: r * sin(delta)
  const x = useTransform(deltaAngle, (a) => radius * Math.sin(a * Math.PI / 180));
  
  // Scale: dựa vào cos(delta), card giữa to nhất (1), càng xa càng nhỏ
  const scale = useTransform(deltaAngle, (a) => 0.55 + 0.45 * Math.cos(a * Math.PI / 180));
  
  // Opacity: card trong khoảng ±60° rõ, ngoài mờ dần
  const opacity = useTransform(deltaAngle, (a) => {
    const abs = Math.abs(a);
    return abs < 60 ? 1 : Math.max(0.2, 1 - (abs - 60) / 40);
  });
  
  // zIndex: card gần trung tâm nằm trên
  const zIndex = useTransform(deltaAngle, (a) => 100 - Math.floor(Math.abs(a) / 5));

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${CARD_W}px`,
        height: '100%',
        left: '50%',               // đặt mép trái vào giữa
        top: 0,
        x,                         // dịch ngang theo góc
        scale,
        opacity,
        zIndex,
        translateX: '-50%',        // đưa tâm card về vị trí chính giữa
        transformOrigin: 'center center',
      }}
      onClick={onClick}
      whileTap={{ cursor: 'grabbing' }}
    >
      {children}
    </motion.div>
  );
}

export default function Projects({ data }) {
  if (!data || data.length === 0) return null;

  const total = data.length;
  const ANGLE = 360 / total;
  // Bán kính quạt – có thể chỉnh để các card xòe rộng hay hẹp
  const radius = Math.max(CARD_W * total / 4, 350);

  const rotY = useMotionValue(0);
  const springRot = useSpring(rotY, { stiffness: 65, damping: 16, mass: 1 });
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
    rotY.set(ptr.current.base + (e.clientX - ptr.current.startX) * 0.25);
  };

  const onPointerUp = () => {
    if (!ptr.current) return;
    const projected = rotY.get() + ptr.current.vel * 300;
    const snapped = Math.round(projected / ANGLE) * ANGLE;
    rotY.set(snapped);
    ptr.current = null;
  };

  const goTo = (i) => {
    const idx = ((i % total) + total) % total;
    rotY.set(-idx * ANGLE);
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  return (
    <section className=" relative py-24 bg-[#f0f0f0] text-black overflow-hidden font-archivo select-none">
      {/* Header */}
      <div className="px-6 md:px-20 mb-16 flex justify-between items-end">
        <div>
          <span className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase">
            // Selected_Works
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mt-2">
            DỰ ÁN <span className="text-orange-600">THÉP.</span>
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2 opacity-40">
          <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center text-2xl font-black">↻</div>
          <span className="text-[10px] font-black tracking-widest">SPIN</span>
        </div>
      </div>

      {/* Khu vực quạt */}
      <div
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none overflow-hidden"
        style={{ height: `${CARD_H + 100}px` }}
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

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-8 bg-orange-600' : 'w-1.5 bg-black/25'
            }`}
          />
        ))}
      </div>

      {/* Mobile arrows */}
      <div className="flex justify-center gap-6 mt-6 md:hidden">
        <button onClick={prev} className="w-12 h-12 rounded-full border-2 border-black/20 font-black text-lg flex items-center justify-center">←</button>
        <button onClick={next} className="w-12 h-12 rounded-full border-2 border-black/20 font-black text-lg flex items-center justify-center">→</button>
      </div>
    </section>
  );
}