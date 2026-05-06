'use client';
import { useAboutData, useCertificates, usePartners } from '@/hooks/public/usePublicPosts';
import { getImageUrl } from '@/lib/utils';

import AboutIntro from '@/components/public/about/AboutIntro';
import VisionMission from '@/components/public/about/VisionMission';
import CoreValues from '@/components/public/about/CoreValues';
import Timeline from '@/components/public/about/Timeline';
import AboutBanner from '@/components/public/about/AboutBanner';
import Certificates from '@/components/public/home/Certificates';
import Partners from '@/components/public/home/Partners';
import LoadingScreen from '@/components/public/ui/LoadingScreen';
import Container from '@/components/public/ui/Container';
import { useTrackView } from '@/hooks/public/useTrackView';

export default function AboutPage() {
    const { sections, loading: ldSections } = useAboutData();
    const { data: certs, loading: ldCerts } = useCertificates();
    const { data: partners, loading: ldPartners } = usePartners();

    useTrackView({ page_type: 'about' });

    if (ldSections || ldCerts || ldPartners) return <LoadingScreen />;

    // 🟢 Chuyển key ra thẻ bọc bên ngoài, chỗ này chỉ return component thôi
    const renderSection = (s) => {
        switch (s.layout) {
            case 'hero': return <AboutIntro data={s} meta={s.meta} />;
            case 'core_values': return <CoreValues data={s.meta?.values || []} />;
            case 'vision_mission': return <VisionMission data={s.meta} />;
            case 'timeline': return <Timeline data={s.meta?.events || []} />;
            default: return null;
        }
    };

    const hero = sections.find(s => s.layout === 'hero');

    return (
        <div className="bg-white font-sans">
            <AboutBanner 
                title={hero?.title} 
                image={getImageUrl(hero?.image)} 
                slogan={hero?.meta?.slogan} 
            />

            <div className="space-y-0">
                {/* 🟢 ĐÂY RỒI: Tự động gán id bằng slug từ Database */}
                {/* scroll-mt-24: Để khi trượt xuống không bị cái Header đè lên che mất */}
                {sections.map(s => (
                    <div key={s.id} id={s.slug} className="scroll-mt-24">
                        {renderSection(s)}
                    </div>
                ))}
            </div>

            <div className="py-24 space-y-32">
                {certs.length > 0 && <Certificates data={certs} />}
                {partners.length > 0 && <Partners data={partners} />}
            </div>
        </div>
    );
}