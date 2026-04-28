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
  const [dir, setDir]           = useState(1); // 1 = forward, -1 = backward
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

  /* ── Scroll thumbnail strip vào giữa ────────────────── */
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

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section className="py-32 bg-[#f9fafb] overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-stretch">

          {/* ── LEFT ─────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-between py-4 min-w-0">

            {/* Heading */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-10 h-[1px] bg-[#e33127]" />
                <p className="text-[#e33127] font-semibold text-xs tracking-[0.4em] uppercase">
                  Quality Assurance
                </p>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#0e2188] leading-[0.95]">
                CHỨNG NHẬN <br />
                <span className="text-gray-300">&amp; GIẢI THƯỞNG</span>
              </h2>
              <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                Minh chứng cho năng lực và cam kết chất lượng trong từng dự án thép tiền chế.
              </p>
            </div>

            {/* Thumbnail strip + arrows */}
            <div className="mt-12 space-y-5">

              {/* Nút điều hướng */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { go(-1); startTimer(); }}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#0e2188] hover:border-[#e33127] hover:text-[#e33127] transition-colors"
                >
                  <MdArrowBack size={16} />
                </button>
                <button
                  onClick={() => { go(1); startTimer(); }}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#0e2188] hover:border-[#e33127] hover:text-[#e33127] transition-colors"
                >
                  <MdArrowForward size={16} />
                </button>

              </div>

              {/* Strip */}
              <div
                ref={stripRef}
                className="flex gap-3 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
                style={{ scrollbarWidth: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {certs.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => pick(i)}
                    className="relative shrink-0 rounded-lg overflow-hidden transition-all duration-300 focus:outline-none"
                    style={{
                      width:  THUMB_W,
                      height: THUMB_H,
                      border: i === active ? '2px solid #e33127' : '2px solid transparent',
                      opacity: i === active ? 1 : 0.45,
                      transform: i === active ? 'translateY(-4px)' : 'none',
                    }}
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name || 'Chứng nhận'}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="h-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0e2188] rounded-full origin-left"
                  animate={{ scaleX: (active + 1) / certs.length }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT — ảnh lớn ──────────────────────────── */}
          <div className="relative w-full max-w-[480px] lg:h-[600px] shrink-0">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_20px_60px_rgba(14,33,136,0.09)] p-6 flex items-center justify-center"
              >
                <div className="relative w-full h-full group flex items-center justify-center">
                  <img
                    src={getImageUrl(certs[active].image)}
                    alt={certs[active].name || 'Chứng nhận'}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#e33127] to-[#0e2188]" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Số trang lớn trang trí */}
            <div className="absolute -bottom-6 -right-2 text-7xl font-black text-gray-100 select-none pointer-events-none leading-none">
              {String(active + 1).padStart(2, '0')}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}