// hooks/public/usePublicBanners.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

export const usePublicBanners = (page = 'home') => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await publicService.getBanners({ page });
        // Chỉ lấy banner đang hoạt động (status = 1)
        const activeBanners = (res.data || res || []).filter(b => b.status == 1);
        setBanners(activeBanners);
      } catch (error) {
        console.error("LỖI TẢI BANNER CHIẾN DỊCH:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [page]);

  return { banners, loading };
};