'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificateService } from '@/services/certificateService';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const THUMB_W = 110;
const THUMB_H = 150;
const GAP     = 12;
const STEP    = THUMB_W + GAP;
const AUTO_DELAY = 4000;

export default function Certificates() {
  const [certs, setCerts]       = useState([]);
  const [active, setActive]     = useState(0);
  const [loading, setLoading]   = useState(true);
  const [dir, setDir]           = useState(1);
  const timerRef                = useRef(null);
  const stripRef                = useRef(null);

  /* ── Fetch ──────────────────────────────────────────── */
  useEffect(() => {
    certificateService.getAll()
      .then(res => setCerts((res.data || []).filter(i => i.status === 1)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Auto-play ──────────────────────────────────────── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), AUTO_DELAY);
  };

  useEffect(() => {
    if (!certs.length) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [certs, active]);

  /* ── Navigate ───────────────────────────────────────── */
  const go = (step) => {
    setDir(step);
    setActive(prev => (prev + step + certs.length) % certs.length);
  };

  const pick = (i) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
    startTimer();
  };

  /* ── Scroll thumbnail strip ─────────────────────────── */
  useEffect(() => {
    if (!stripRef.current || !certs.length) return;
    const strip = stripRef.current;
    const targetScroll = active * STEP - strip.clientWidth / 2 + THUMB_W / 2;
    strip.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  }, [active, certs.length]);

  /* ── Drag trên thumbnail strip ──────────────────────── */
  const dragRef = useRef(null);
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, scroll: stripRef.current.scrollLeft };
    stripRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    stripRef.current.scrollLeft = dragRef.current.scroll - (e.clientX - dragRef.current.x);
  };
  const onPointerUp = () => { dragRef.current = null; };

  if (loading || !certs.length) return null;

  /* ── Framer Motion Variants ─────────────────────────── */
  const carouselVariants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: "easeOut" } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }
  };

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden font-sans border-t border-zinc-100">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-stretch">

          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex-1 flex flex-col justify-between py-4 min-w-0"
          >
            {/* Heading */}
            <div className="space-y-6">
              <motion.div variants={slideLeft} className="flex items-center gap-4">
                <span className="w-12 h-[2px] bg-[#e33127]" />
                <p className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                  Quality Assurance
                </p>
              </motion.div>
              
              <motion.h2 variants={slideLeft} className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188] leading-[0.95]">
                CHỨNG NHẬN <br />
                <span className="text-zinc-300">&amp; GIẢI THƯỞNG</span>
              </motion.h2>
              
              <motion.p variants={slideLeft} className="text-zinc-500 max-w-md text-lg leading-relaxed">
                Minh chứng cho năng lực và cam kết chất lượng trong từng dự án thép tiền chế.
              </motion.p>
            </div>

            {/* Thumbnail strip + controls */}
            <motion.div variants={slideUp} className="mt-16 space-y-6">
              
              {/* Nút điều hướng */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { go(-1); startTimer(); }}
                  className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-[#0e2188] hover:border-[#e33127] hover:text-[#e33127] transition-all duration-300"
                >
                  <MdArrowBack size={18} />
                </button>
                <button
                  onClick={() => { go(1); startTimer(); }}
                  className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-[#0e2188] hover:border-[#e33127] hover:text-[#e33127] transition-all duration-300"
                >
                  <MdArrowForward size={18} />
                </button>
              </div>

              {/* Strip */}
              <div
                ref={stripRef}
                className="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
                style={{ scrollbarWidth: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {certs.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => pick(i)}
                    className="relative shrink-0 rounded-sm overflow-hidden transition-all duration-500 focus:outline-none bg-zinc-50"
                    style={{
                      width:  THUMB_W,
                      height: THUMB_H,
                      opacity: i === active ? 1 : 0.4,
                      transform: i === active ? 'translateY(-4px)' : 'none',
                    }}
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name || 'Chứng nhận'}
                      className="w-full h-full object-cover transition-transform duration-700"
                      draggable={false}
                    />
                    <div className={`absolute inset-0 border-2 transition-colors duration-500 ${i === active ? 'border-[#e33127]' : 'border-transparent'}`} />
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="h-[2px] w-full bg-zinc-100 overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 bottom-0 bg-[#0e2188] origin-left"
                  animate={{ scaleX: (active + 1) / certs.length }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ width: '100%' }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ─────────────────────────────── */}
          <motion.div 
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full max-w-[500px] lg:h-[650px] shrink-0"
          >
            {/* Background accent */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0e2188]/5 rounded-full -z-10 blur-3xl" />

            <div className="w-full h-full bg-zinc-50 border border-zinc-100 shadow-2xl shadow-[#0e2188]/10 rounded-sm overflow-hidden p-8 flex items-center justify-center relative">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <img
                    src={getImageUrl(certs[active].image)}
                    alt={certs[active].name || 'Chứng nhận'}
                    className="max-w-full max-h-full object-contain drop-shadow-xl"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Corner Label */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex items-center gap-2 text-[#0e2188]">
                  <span className="w-4 h-[1px] bg-[#e33127]"></span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Certified</p>
                </div>
              </div>
            </div>

            {/* Large Watermark Number */}
            <div className="absolute -bottom-8 -right-4 text-8xl md:text-9xl font-bold text-zinc-50 select-none pointer-events-none leading-none z-[-1]">
              {String(active + 1).padStart(2, '0')}
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}