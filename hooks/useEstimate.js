'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminEstimateService } from '@/services/adminEstimateService';
import toast from 'react-hot-toast';

export const useAdminEstimate = (type) => { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const service = adminEstimateService[type];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await service.getAll();
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('LỖI TẢI DỮ LIỆU DỰ TOÁN');
    } finally {
      setLoading(false);
    }
  }, [type, service]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = async (payload) => {
    try {
      const res = await service.create(payload);
      if (res.success) {
        toast.success('THÊM MỚI THÀNH CÔNG');
        fetchData();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'LỖI THÊM MỚI');
    }
    return false;
  };

  const updateItem = async (id, payload) => {
    try {
      const res = await service.update(id, payload);
      if (res.success) {
        toast.success('CẬP NHẬT THÀNH CÔNG');
        fetchData();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'LỖI CẬP NHẬT');
    }
    return false;
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Xác nhận xóa bản ghi này?')) return false;
    try {
      const res = await service.delete(id);
      if (res.success) {
        toast.success('ĐÃ XÓA');
        fetchData();
        return true;
      }
    } catch (error) {
      toast.error('LỖI XÓA DỮ LIỆU');
    }
    return false;
  };

  return { data, loading, fetchData, createItem, updateItem, deleteItem };
};