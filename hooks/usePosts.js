import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/postService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== HOOK DANH SÁCH BÀI VIẾT ====================
export const usePosts = (initialFilters = { post_type: 'post', category_id: '', keyword: '' }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  
  const { loading: postsLoading, request: fetchPostsRequest } = useApi(postService.getAll);
  const { loading: categoriesLoading, request: fetchCategoriesRequest } = useApi(postService.getCategories);
  const { request: deleteRequest } = useApi(postService.delete);

  const loading = postsLoading || categoriesLoading;

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetchPostsRequest(filters);
      // 🟢 Bốc dữ liệu lì lợm: Ưu tiên res.data, không thì lấy res
      setPosts(res?.data || res || []);
    } catch (error) {
      toast.error('KHÔNG THỂ TẢI DANH SÁCH BÀI VIẾT');
    }
  }, [filters, fetchPostsRequest]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetchCategoriesRequest();
      const data = res?.data || res || [];
      // 🚩 FIX: Đổ dữ liệu vào State thì bộ lọc mới hiện chữ được!
      setCategories(data); 
    } catch (error) {
      console.error('Lỗi tải danh mục');
    }
  }, [fetchCategoriesRequest]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      post_type: type,
      category_id: '',
    }));
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`XÁC NHẬN XÓA: ${title.toUpperCase()}?`)) return;
    try {
      await deleteRequest(id);
      toast.success('ĐÃ XÓA BÀI VIẾT');
      fetchPosts();
    } catch (error) {
      toast.error('XÓA THẤT BẠI');
    }
  };

  return {
    posts,
    categories,
    loading,
    filters,
    setFilter,
    handleTypeChange,
    handleDelete,
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
export const usePostForm = (id = null) => {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const [formData, setFormData] = useState({
    title: '',
    post_type: 'post',
    category_id: '',
    description: '',
    content: '',
    status: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [oldImage, setOldImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(!!id);

  const { loading: submitting, request: createRequest } = useApi(postService.create);
  const { loading: updating, request: updateRequest } = useApi(postService.update);
  const { request: fetchById } = useApi(postService.getById);
  const { request: fetchCategories } = useApi(postService.getCategories);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        // 🟢 Fix bốc dữ liệu cho Form
        setCategories(res?.data || res || []);
      } catch (error) {
        console.error('Lỗi tải danh mục');
      }
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!id) {
      setFetching(false);
      return;
    }
    const loadPost = async () => {
      try {
        const res = await fetchById(id);
        const post = res?.data || res; // 🟢 Fix bốc dữ liệu
        
        setFormData({
          title: post.title || '',
          post_type: post.post_type || 'post',
          category_id: post.category_id?.toString() || '',
          description: post.description || '',
          content: post.content || '',
          status: post.status ?? 1,
        });
        if (post.image) {
          setOldImage(post.image);
          setPreview(`${imageUrl}/${post.image}`);
        }
      } catch (error) {
        toast.error('Không tìm thấy bài viết');
        router.push('/admin/posts');
      } finally {
        setFetching(false);
      }
    };
    loadPost();
  }, [id, fetchById, router, imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Vui lòng nhập tiêu đề');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      if (id) {
        await updateRequest(id, data);
        toast.success('CẬP NHẬT THÀNH CÔNG');
      } else {
        await createRequest(data);
        toast.success('THÊM MỚI THÀNH CÔNG');
      }
      router.push('/admin/posts');
    } catch (error) { /* useApi handle */ }
  };

  return {
    formData,
    imageFile,
    preview,
    categories,
    fetching,
    loading: submitting || updating,
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};