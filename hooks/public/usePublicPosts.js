// hooks/public/usePublicPosts.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

// 🔵 HOOK 1: Lấy danh sách bài viết/dự án (Đại ca đã có)
export const usePublicPosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await publicService.getPosts({ ...params, limit: 3 });
        setPosts(res?.data || res || []);
      } catch (error) {
        console.error("Lỗi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, loading };
};

// 🟢 HOOK 2: Lấy CHI TIẾT một dự án/bài viết (Đại ca thêm đoạn này vào nhé)
export const useProjectDetail = (slug) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const fetchDetail = async () => {
      try {
        // Gọi service lấy chi tiết theo slug
        const res = await publicService.getProjectBySlug(slug);
        setProject(res.data || res);
      } catch (error) {
        console.error("LỖI TRUY XUẤT HỒ SƠ CÔNG TRÌNH:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  return { project, loading };
};