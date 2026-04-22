import { useState, useEffect, useCallback } from 'react';
import { postService } from '@/services/postService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

export const usePostCategories = () => {
  const [categories, setCategories] = useState([]); // 🟢 State của mình là categories
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '0',
    sort_order: 0,
    status: 1,
  });

  const { loading: fetchLoading, request: fetchRequest } = useApi(postService.getCategories);
  const { loading: createLoading, request: createRequest } = useApi(postService.createCategory);
  const { loading: updateLoading, request: updateRequest } = useApi(postService.updateCategory);
  const { request: deleteRequest } = useApi(postService.deleteCategory);

  const loading = fetchLoading;
  const formLoading = createLoading || updateLoading;

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetchRequest();
      // 🟢 FIX Ở ĐÂY: Đổi setPosts thành setCategories
      setCategories(res?.data || res || []); 
    } catch (error) {
      toast.error('Lỗi truy xuất dữ liệu');
    }
  }, [fetchRequest]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Các hàm handleEdit, handleDelete, handleSubmit giữ nguyên ---
  const resetForm = () => {
    setFormData({ name: '', slug: '', parent_id: '0', sort_order: 0, status: 1 });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      parent_id: cat.parent_id?.toString() || '0',
      sort_order: cat.sort_order || 0,
      status: cat.status,
    });
    setEditingId(cat.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`XÁC NHẬN XÓA: ${name.toUpperCase()}?`)) return;
    try {
      await deleteRequest(id);
      toast.success('Đã xóa danh mục');
      fetchCategories();
    } catch (error) {
      toast.error('Xóa thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Chưa nhập tên danh mục');
      return;
    }
    try {
      if (editingId) {
        await updateRequest(editingId, formData);
        toast.success('Cập nhật thành công');
      } else {
        await createRequest(formData);
        toast.success('Thêm danh mục mới');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  return {
    categories,
    loading,
    showAddForm,
    setShowAddForm,
    editingId,
    formData,
    setFormData,
    formLoading,
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit,
    refresh: fetchCategories,
  };
};