// hooks/useMenus.js
import { useState, useEffect, useCallback } from 'react';
import { menuService } from '@/services/menuService';
import toast from 'react-hot-toast';

export const useMenus = () => {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [position, setPosition] = useState('mainmenu');

  const [formData, setFormData] = useState({
    name: '',
    link: '',
    type: 'custom',
    parent_id: 0,
    position: 'mainmenu',
    sort_order: 0,
  });

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await menuService.index(position);
      setMenus(res.data);
    } catch (error) {
      toast.error('KHÔNG THỂ TẢI HỆ THỐNG ĐIỀU HƯỚNG!');
    } finally {
      setLoading(false);
    }
  }, [position]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleAction = (type, menu = null) => {
    if (type === 'add') {
      setSelectedMenu(null);
      setFormData({
        name: '',
        link: '',
        type: 'custom',
        parent_id: 0,
        position: position,
        sort_order: 0,
      });
    } else if (menu) {
      setSelectedMenu(menu);
      setFormData({ ...menu });
    }
    setView(type);
  };

  const handleDelete = async (id) => {
    if (!confirm('XÁC NHẬN XÓA MỤC MENU NÀY?')) return;
    try {
      await menuService.destroy(id);
      toast.success('ĐÃ GỠ BỎ LIÊN KẾT!');
      fetchMenus();
    } catch (error) {
      toast.error('LỖI KHI XÓA!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'add') {
        await menuService.store(formData);
        toast.success('THÊM MENU THÀNH CÔNG!');
      } else {
        await menuService.update(selectedMenu.id, formData);
        toast.success('CẬP NHẬT THÀNH CÔNG!');
      }
      setView('list');
      fetchMenus();
    } catch (error) {
      toast.error(error.message || 'CÓ LỖI XẢY RA!');
    } finally {
      setLoading(false);
    }
  };

  return {
    view,
    setView,
    menus,
    loading,
    position,
    setPosition,
    selectedMenu,
    formData,
    setFormData,
    handleAction,
    handleDelete,
    handleSubmit,
    fetchMenus,
  };
};