// hooks/public/usePublicProducts.js
import { useState, useEffect, useCallback } from 'react';
import { publicService } from '@/services/publicService';
// hooks/public/usePublicProducts.js (Bổ sung thêm)
export const useProductDetail = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      try {
        const res = await publicService.getProductBySlug(slug);
        setProduct(res?.data || res);
      } catch (error) {
        console.error("LỖI CHI TIẾT:", error.response?.data || error.message); // 🟢 In lỗi thật ra đây
        console.error("LỖI TRUY XUẤT HỒ SƠ THÉP");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  return { product, loading };
};
export const usePublicProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]); // Lấy để làm bộ lọc
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Gọi song song cả Sản phẩm và Định nghĩa thuộc tính
      const [prodRes, attrRes] = await Promise.all([
        publicService.getProducts(filters),
        publicService.getCategories({ tree: true }) // Hoặc lấy attributes riêng tùy API đại ca
      ]);

      setProducts(prodRes?.data || prodRes || []);
      // Giả sử API trả về attributes kèm theo hoặc gọi riêng
    } catch (error) {
      console.error("LỖI HỆ THỐNG PHÂN TÁCH DỮ LIỆU");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return { products, attributes, loading, filters, updateFilter };
};