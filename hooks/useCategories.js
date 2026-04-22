import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== HOOK DANH SÁCH CATEGORIES ====================
export const useCategories = (params = { tree: true }) => {
  const [categories, setCategories] = useState([]);
  const { loading, request: fetchRequest } = useApi(categoryService.getAll);

  // 🟢 KỸ THUẬT KHÓA MỤC TIÊU: 
  // Biến object thành chuỗi JSON để React không bị nhầm lẫn khi so sánh tham chiếu
  const paramsKey = JSON.stringify(params);

  const fetchCategories = useCallback(async () => {
    try {
      // Parse ngược lại để gửi đi
      const res = await fetchRequest(JSON.parse(paramsKey));
      setCategories(res?.data || res || []);
    } catch (error) {
      console.error('Lỗi tải danh mục');
    }
  }, [fetchRequest, paramsKey]); // 🚩 Chỉ phụ thuộc vào chuỗi String, không sợ bị lặp

  const deleteCategory = async (id, name) => {
    if (!confirm(`XÓA DANH MỤC "${name.toUpperCase()}"?`)) return;
    try {
      await categoryService.delete(id);
      toast.success('ĐÃ LOẠI BỎ PHÂN LOẠI');
      fetchCategories();
    } catch (error) {
      toast.error('XÓA THẤT BẠI');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, deleteCategory, refresh: fetchCategories };
};

// ==================== HOOK CHI TIẾT CATEGORY ====================
export const useCategory = (id) => {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const { loading, request: fetchById } = useApi(categoryService.getById);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchById(id);
        setCategory(res?.data || res);
      } catch (error) {
        toast.error('KHÔNG TÌM THẤY DANH MỤC');
        router.push('/admin/categories');
      }
    };
    load();
  }, [id, fetchById, router]);

  return { category, loading };
};

// ==================== HOOK FORM ADD/EDIT CATEGORY ====================
export const useCategoryForm = (id = null) => {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const [formData, setFormData] = useState({
    name: '', parent_id: '0', sort_order: 0, description: '', status: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const { loading: submitLoading, request: createRequest } = useApi(categoryService.create);
  const { loading: updateLoading, request: updateRequest } = useApi(categoryService.update);
  const { request: fetchById } = useApi(categoryService.getById);

  // 🟢 QUAN TRỌNG: Dùng useMemo để giữ cho object params này luôn đứng yên, không gây lặp
  const categoryParams = useMemo(() => ({ tree: true }), []);
  const { categories: parentOptions } = useCategories(categoryParams);

  useEffect(() => {
    if (!id) { setFetching(false); return; }
    const load = async () => {
      try {
        const res = await fetchById(id);
        const cat = res?.data || res;
        setFormData({
          name: cat.name || '',
          parent_id: cat.parent_id?.toString() || '0',
          sort_order: cat.sort_order ?? 0,
          description: cat.description || '',
          status: cat.status ?? 1,
        });
        if (cat.image) setPreview(`${imageUrl}/${cat.image}`);
      } catch (error) {
        toast.error('DỮ LIỆU DANH MỤC BỊ LỖI');
        router.push('/admin/categories');
      } finally {
        setFetching(false);
      }
    };
    load();
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
    if (!formData.name.trim()) return toast.error('VUI LÒNG NHẬP TÊN');
    
    setSubmitting(true);
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
      router.push('/admin/categories');
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm render options đệ quy (Dùng cho Select cha-con)
  const renderParentOptions = (nodes, prefix = '') => {
    let options = [];
    for (const node of nodes) {
      if (node.id == id) continue; // Không cho chọn chính nó làm cha
      options.push(
        <option key={node.id} value={node.id}>
          {prefix}{node.name.toUpperCase()}
        </option>
      );
      if (node.children?.length > 0) {
        options.push(...renderParentOptions(node.children, prefix + '↳ '));
      }
    }
    return options;
  };

  return {
    formData, preview, imageFile,
    loading: submitting || submitLoading || updateLoading,
    fetching, parentOptions, handleChange, handleImageChange, handleSubmit, renderParentOptions,
  };
};