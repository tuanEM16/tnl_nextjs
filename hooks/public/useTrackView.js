'use client';
import { useEffect, useRef } from 'react';
import { publicService } from '@/services/publicService';

export const useTrackView = ({ page_type, ref_id, ref_slug } = {}) => {
    const tracked = useRef(false); // 🟢 Flag chống track 2 lần

    useEffect(() => {
        if (!page_type) return;
        if (page_type === 'product' && !ref_id) return;
        if (tracked.current) return; // 🟢 Đã track rồi → bỏ qua

        const track = async () => {
            tracked.current = true; // 🟢 Đánh dấu trước khi gọi API
            try {
                const referrer   = document.referrer || null;
                const params     = new URLSearchParams(window.location.search);
                const refCode    = params.get('ref') || null;
                const refMap     = { zl: 'Zalo', fb: 'Facebook', gg: 'Google', tt: 'TikTok', cp: 'Copy Link' };
                const utm_source = refMap[refCode] || refCode || null;

                await publicService.trackView({
                    page_type,
                    ref_id:   ref_id   || null,
                    ref_slug: ref_slug || null,
                    referrer,
                    utm_source
                });
            } catch {
                tracked.current = false; // Reset nếu thất bại để có thể thử lại
            }
        };

        const timer = setTimeout(track, 1000);
        return () => clearTimeout(timer);
    }, [page_type, ref_id, ref_slug]);
};