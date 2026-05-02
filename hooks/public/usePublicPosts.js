import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

// 1. Hook lấy danh sách bài viết chung (Tin tức, Dự án, v.v.)
export const usePublicPosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await publicService.getPosts(params);
        setPosts(res?.data || res || []);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, loading };
};

export const useAboutData = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await publicService.getPosts({ post_type: 'page', page_slug: 'gioi_thieu' });
        if (res.data || res) {
          const data = res.data || res;
          const processed = [...data].sort((a, b) => a.sort_order - b.sort_order).map(item => ({
            ...item,
            meta: typeof item.content === 'string' ? JSON.parse(item.content) : (item.content || {})
          }));
          setSections(processed);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchAboutData();
  }, []);
  return { sections, loading };
};

// 2. Hook lấy Certificates (Gọi đúng Service chuyên biệt)
export const useCertificates = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicService.getCertificates().then(res => {
      setData(res?.data || res || []);
      setLoading(false);
    });
  }, []);
  return { data, loading };
};

// 3. Hook lấy Partners
export const usePartners = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicService.getPartners().then(res => {
      setData(res?.data || res || []);
      setLoading(false);
    });
  }, []);
  return { data, loading };
};

// 3. Hook lấy chi tiết dự án theo Slug
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