// hooks/useConfig.js
'use client';

import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/utils'; // 🟢 1. PHẢI DÙNG MÁY HÀN CHUẨN NÀY

export const useConfig = () => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({ logo: null, favicon: null });
  const [previews, setPreviews] = useState({ logo: '', favicon: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🟢 2. HÀM CẬP NHẬT PREVIEW THÔNG MINH
  const updatePreviews = (data) => {
    setPreviews({
      logo: getImageUrl(data?.logo),
      favicon: getImageUrl(data?.favicon),
    });
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await configService.show();
        const data = res.data || res;
        setFormData(data);
        // 🟢 3. Dùng hàm thông minh để hiện ảnh cũ từ server
        updatePreviews(data);
      } catch (error) {
        toast.error('LỖI TRUY XUẤT THÔNG SỐ HỆ THỐNG');
      } finally {
        setFetching(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      // 🟢 4. Xem trước ảnh mới ngay lập tức từ máy tính
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      
      // 🟢 5. CHỈ ĐẨY DỮ LIỆU CHỮ, KHÔNG ĐẨY TÊN FILE CŨ TRÁNH LỖI SERVER
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && key !== 'favicon' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Chỉ append file nếu người dùng có chọn file mới
      if (files.logo) data.append('logo', files.logo);
      if (files.favicon) data.append('favicon', files.favicon);

      await configService.update(data);
      toast.success('HỆ THỐNG ĐÃ ĐƯỢC TÁI CẤU HÌNH THÀNH CÔNG');

      // Refresh lại để lấy tên file mới từ Database
      const res = await configService.show();
      const updatedData = res.data || res;
      setFormData(updatedData);
      updatePreviews(updatedData);
      setFiles({ logo: null, favicon: null });
    } catch (error) {
      toast.error('CẤU HÌNH THẤT BẠI - KIỂM TRA LẠI SERVER');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, previews, loading, fetching,
    handleChange, handleFileChange, handleSubmit,
  };
};