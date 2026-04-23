// hooks/public/usePublicCategories.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

export const usePublicCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await publicService.getCategories({ parent_only: true });
        setCategories(res?.data || res || []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return { categories, loading };
};