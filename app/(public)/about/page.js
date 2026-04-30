'use client';
import { useState, useEffect } from 'react';
import Container from '@/components/public/ui/Container';
import AboutBanner from '@/components/public/about/AboutBanner';

// 🟢 IMPORT CÁC COMPONENT DÙNG CHUNG CỦA ĐẠI CA VÀO ĐÂY
import IntroSection from '@/components/public/home/IntroSection';
import Certificates from '@/components/public/home/Certificates';
import Partners from '@/components/public/home/Partners';

// Nếu đại ca đã tách VisionMission, CoreValues, Timeline ra component riêng thì import luôn
import VisionMission from '@/components/public/about/VisionMission';
import CoreValues from '@/components/public/about/CoreValues';
import Timeline from '@/components/public/about/Timeline';

export default function AboutPage() {
  const [sections, setSections] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 CALL API LẤY DỮ LIỆU ĐỘNG (Giữ nguyên logic của đại ca)
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 
        const safeFetch = async (endpoint) => {
          try {
            const res = await fetch(`${baseUrl}${endpoint}`);
            if (!res.ok) return []; 
            const text = await res.text(); 
            if (text.trim().startsWith('<')) return [];
            return JSON.parse(text);
          } catch (e) { return []; }
        };

        const [resSections, resCerts, resPartners] = await Promise.all([
          safeFetch('/about-sections'),
          safeFetch('/certificates'),
          safeFetch('/partners')
        ]);

        const rawSections = resSections?.data || resSections || [];
        
        const activeAndSortedSections = rawSections
          .filter(s => s.status === 1 || s.status === true)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(section => {
             let parsedMeta = section.meta;
             if (typeof section.meta === 'string') {
               try { parsedMeta = JSON.parse(section.meta); } 
               catch (e) { parsedMeta = {}; }
             }
             return { ...section, meta: parsedMeta || {} };
          });

        setSections(activeAndSortedSections);
        setCertificates(resCerts?.data || resCerts || []);
        setPartners(resPartners?.data || resPartners || []);

      } catch (error) {
        console.error('Lỗi tải dữ liệu trang Giới thiệu:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAboutData();
  }, []);

  // 🟢 RENDER SWITCH: LẮP RÁP CÁC COMPONENT DÙNG CHUNG
  const renderDynamicSection = (section) => {
    const { meta } = section;
    if (!meta) return null;

    switch (section.name) {
      case 'hero':
        // Truyền thẳng data vào component IntroSection đại ca đã code sẵn
        // Lưu ý: Đảm bảo component IntroSection nhận prop tương ứng (vd: data)
        return <IntroSection key={section.id} data={meta} />;

      // Nếu đại ca đã tạo các component tương ứng, chỉ việc gọi ra:
      case 'vision_mission':
        return <VisionMission key={section.id} data={meta} />;
      case 'core_values':
        return <CoreValues key={section.id} data={meta.values} />;
      case 'timeline':
        return <Timeline key={section.id} data={meta.events} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-orange-600 font-black italic uppercase tracking-widest text-2xl animate-pulse">
          // ĐANG NUNG CHẢY DỮ LIỆU THÉP...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans">
      <AboutBanner />
      
      {/* 🟢 KHU VỰC RENDER CÁC SECTIONS (Hero, Vision, CoreValues...) */}
      <Container className="py-24 space-y-32">
        {sections.map(section => renderDynamicSection(section))}
      </Container>

      {/* 🟢 KHU VỰC RENDER CHỨNG CHỈ (Dùng component có sẵn) */}
      {certificates.length > 0 && (
        <Certificates data={certificates} />
      )}

      {/* 🟢 KHU VỰC RENDER ĐỐI TÁC (Dùng component có sẵn) */}
      {partners.length > 0 && (
        <Partners data={partners} />
      )}
    </div>
  );
}