// hooks/public/usePublicConfig.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

export const usePublicConfig = () => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // 🟢 Gọi service lấy cấu hình global
                const res = await publicService.getConfig();
                const data = res.data || res || {};
                setConfig(data);
            } catch (error) {
                console.error("LỖI TRUY XUẤT CẤU HÌNH HỆ THỐNG:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return { config, loading };
};