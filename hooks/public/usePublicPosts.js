// hooks/public/usePublicPosts.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

export const usePublicPosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ✅ Truyền thẳng params — caller tự quyết limit
        // Không inject limit cứng ở đây nữa
        // Nếu caller không truyền limit → API trả hết (tuỳ backend)
        const res = await publicService.getPosts(params);
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

export const useProjectDetail = (slug) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      try {
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