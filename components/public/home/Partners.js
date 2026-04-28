'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { partnerService } from '@/services/partnerService';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';

const CARD_W = 280;
const CARD_H = 140;
const GAP = 60;
const ITEM_W = CARD_W + GAP;

export default function Partners() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await partnerService.getAll();
        const activeLogos = (res.data || res || []).filter(p => p.status === 1);
        setLogos(activeLogos);
      } catch (error) {
        console.error("LỖI:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const loopLogos = [...logos, ...logos];
  const rotX = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 35, damping: 25 });

  useEffect(() => {
    if (!logos.length) return;

    const interval = setInterval(() => {
      if (isInteractingRef.current) return;

      let current = rotX.get();
      current -= ITEM_W;

      const max = logos.length * ITEM_W;
      if (Math.abs(current) >= max) {
        current = 0;
      }
      rotX.set(current);
    }, 3500);

    return () => clearInterval(interval);
  }, [logos]);

  const ptr = useRef(null);

  const onPointerDown = (e) => {
    isInteractingRef.current = true;
    ptr.current = {
      startX: e.clientX,
      base: rotX.get()
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!ptr.current) return;
    const dx = e.clientX - ptr.current.startX;
    rotX.set(ptr.current.base + dx);
  };

  const onPointerUp = () => {
    ptr.current = null;
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 2000);
  };

  if (loading || !logos.length) return null;

  return (
    <section className="py-32 bg-white overflow-hidden">
      <Container>
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-[#e33127]"></span>
            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
              Global Network
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188]">
            ĐỐI TÁC <span className="text-zinc-300">CHIẾN LƯỢC</span>
          </h2>
        </div>
      </Container>

      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing bg-[#F8F9FA] py-24 border-y border-zinc-100"
        style={{ height: `${CARD_H + 160}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {loopLogos.map((partner, index) => (
            <PartnerCard
              key={index}
              index={index}
              total={logos.length}
              springX={springX}
            >
              <div className="w-full h-full bg-white rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-center p-8 group transition-all duration-500 hover:shadow-[0_20px_40px_rgba(14,33,136,0.08)]">
                <img
                  src={getImageUrl(partner.logo)}
                  alt={partner.name}
                  className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                />
              </div>
            </PartnerCard>
          ))}
        </div>
      </div>
      
      <Container>
        <div className="mt-12 flex justify-end">
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
             <span className="w-4 h-[1px] bg-zinc-300"></span>
             Drag to explore our ecosystem
           </p>
        </div>
      </Container>
    </section>
  );
}

function PartnerCard({ index, total, springX, children }) {
  const x = useTransform(springX, (v) => {
    const totalWidth = total * ITEM_W;
    let pos = index * ITEM_W + v;
    pos = ((pos % totalWidth) + totalWidth) % totalWidth;
    return pos - totalWidth / 2;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: CARD_W,
        height: CARD_H,
        left: '50%',
        top: '50%',
        x,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {children}
    </motion.div>
  );
}