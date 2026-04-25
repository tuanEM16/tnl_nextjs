import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/postService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== HOOK DANH SÁCH BÀI VIẾT ====================
export const usePosts = (initialFilters = {
  post_type: 'post',
  category_id: '',
  page_category_id: '',
  keyword: ''
}) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // Danh mục cho Tin tức
  const [pageCategories, setPageCategories] = useState([]); // Danh mục cho Trang tĩnh (Slot)
  const [filters, setFilters] = useState(initialFilters);

  // 🟢 Triệu hồi các API cần thiết
  const { loading: postsLoading, request: fetchPostsRequest } = useApi(postService.getAll);
  const { request: fetchCategoriesRequest } = useApi(postService.getCategories);
  const { request: fetchPageCategoriesRequest } = useApi(postService.getPageCategories);
  const { request: deleteRequest } = useApi(postService.delete);

  // 1. HÀM LẤY DANH SÁCH BÀI VIẾT (Có lọc)
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetchPostsRequest(filters);
      setPosts(res?.data || res || []);
    } catch (error) {
      toast.error('KHÔNG THỂ TẢI DANH SÁCH BÀI VIẾT');
    }
  }, [filters, fetchPostsRequest]);

  // 2. HÀM LẤY TOÀN BỘ DANH MỤC (Tin tức + Vị trí Web)
  const fetchAllCategories = useCallback(async () => {
    try {
      const [resCat, resPageCat] = await Promise.all([
        fetchCategoriesRequest(),
        fetchPageCategoriesRequest()
      ]);
      setCategories(resCat?.data || resCat || []);
      setPageCategories(resPageCat?.data || resPageCat || []);
    } catch (error) {
      console.error('❌ LỖI TẢI DANH MỤC:', error.message);
    }
  }, [fetchCategoriesRequest, fetchPageCategoriesRequest]);

  // Chạy một lần khi khởi động để lấy "đạn" (danh mục)
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Chạy mỗi khi bộ lọc thay đổi
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. XỬ LÝ ĐỔI LOẠI BÀI VIẾT (Reset các bộ lọc con)
  const handleTypeChange = (type) => {
    setFilters({
      post_type: type,
      category_id: '',
      page_category_id: '',
      keyword: '', // Có thể giữ lại keyword nếu muốn
    });
  };

  // 4. CẬP NHẬT BỘ LỌC TỪNG CÁI
  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    posts,
    categories,
    pageCategories,
    loading: postsLoading,
    filters,
    setFilter,
    handleTypeChange,
    // Hàm xóa bài viết có xác nhận
    handleDelete: async (id, title) => {
      if (!window.confirm(`TIÊU HỦY VĨNH VIỄN: ${title.toUpperCase()}?`)) return;
      try {
        await deleteRequest(id);
        toast.success('ĐÃ TIÊU HỦY THÀNH CÔNG');
        fetchPosts(); // Load lại danh sách sau khi xóa
      } catch (error) {
        toast.error('XÓA THẤT BẠI');
      }
    },
    refreshPosts: fetchPosts,
  };
};

// ==================== HOOK CHI TIẾT BÀI VIẾT ====================
export const usePost = (id) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const { loading, request: fetchById } = useApi(postService.getById);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchById(id);
        // 🟢 Fix bốc dữ liệu phẳng
        setPost(res?.data || res);
      } catch (error) {
        toast.error('KHÔNG TÌM THẤY DỮ LIỆU BÀI VIẾT');
        router.push('/admin/posts');
      }
    };
    load();
  }, [id, fetchById, router]);

  return { post, loading };
};

// ==================== HOOK FORM ADD/EDIT BÀI VIẾT ====================
// hooks/usePosts.js (Phần usePostForm)
export const usePostForm = (id = null) => {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const [formData, setFormData] = useState({
    title: '',
    post_type: 'post',
    category_id: '',
    page_category_id: '', // 🟢 Thêm cột này để lưu vào DB
    description: '',
    content: '',
    status: 1,
  });

  const [categories, setCategories] = useState([]);
  const [pageCategories, setPageCategories] = useState([]); // 🟢 State chứa các slot trang tĩnh
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fetching, setFetching] = useState(!!id);

  const { loading: submitting, request: createRequest } = useApi(postService.create);
  const { loading: updating, request: updateRequest } = useApi(postService.update);
  const { request: fetchById } = useApi(postService.getById);

  // 🟢 Load toàn bộ danh mục để Admin chọn
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resCat, resPageCat] = await Promise.all([
          postService.getCategories(),
          postService.getPageCategories()
        ]);
        setCategories(resCat?.data || resCat || []);
        setPageCategories(resPageCat?.data || resPageCat || []);
      } catch (error) { console.error('Lỗi tải danh mục'); }
    };
    loadData();
  }, []);

  // 🟢 Load dữ liệu cũ khi Sửa
  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      try {
        const res = await fetchById(id);
        const post = res?.data || res;
        setFormData({
          title: post.title || '',
          post_type: post.post_type || 'post',
          category_id: post.category_id?.toString() || '',
          page_category_id: post.page_category_id?.toString() || '', // 🟢 Gán dữ liệu vị trí
          description: post.description || '',
          content: post.content || '',
          status: post.status ?? 1,
        });
        if (post.image) setPreview(`${imageUrl}/${post.image}`);
      } catch (error) { router.push('/admin/posts'); }
      finally { setFetching(false); }
    };
    loadPost();
  }, [id, fetchById, router, imageUrl]);

  return {
    formData,
    categories,
    pageCategories, // 🟢 Trả về để Form render Select Box
    fetching,
    loading: submitting || updating,
    preview,
    handleChange: (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })),
    handleImageChange: (e) => {
      const file = e.target.files?.[0];
      if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
    },
    handleSubmit: async (e) => {
      e.preventDefault();
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      try {
        id ? await updateRequest(id, data) : await createRequest(data);
        toast.success('THÀNH CÔNG!');
        router.push('/admin/posts');
      } catch (error) { }
    },
  };
};