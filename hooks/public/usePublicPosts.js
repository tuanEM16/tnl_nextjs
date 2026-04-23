// hooks/public/usePublicPosts.js
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

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