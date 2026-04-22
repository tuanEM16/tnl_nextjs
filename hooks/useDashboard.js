import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { contactService } from '@/services/contactService';

export const useDashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    totalPosts: 0,
    contacts: 0,
    unreadContacts: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, postRes, contactRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        postService.getAll({ post_type: '' }),
        contactService.getAll()
      ]);

      const unreadCount = contactRes.data?.filter(c => Number(c.status) === 0).length || 0;

      setCounts({
        products: prodRes.data?.length || 0,
        categories: catRes.data?.length || 0,
        totalPosts: postRes.data?.length || 0,
        contacts: contactRes.data?.length || 0,
        unreadContacts: unreadCount
      });
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { counts, loading, refresh: fetchDashboardData };
};