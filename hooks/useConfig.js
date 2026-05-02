// hooks/useConfig.js
'use client';

import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/utils';

export const useConfig = () => {
  const [formData, setFormData] = useState({});
  // 🟢 1. Thêm intro_video vào bộ ba quản lý file
  const [files, setFiles] = useState({ logo: null, favicon: null, intro_video: null });
  const [previews, setPreviews] = useState({ logo: '', favicon: '', intro_video: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🟢 2. CẬP NHẬT PREVIEW (Hỗ trợ bốc video từ mảng Meta)
  const updatePreviews = (data) => {
    // Tìm tên file video trong mảng meta trả về từ DB
    const videoFilename = data?.meta?.find(m => m.meta_key === 'intro_video')?.meta_value;

    setPreviews({
      logo: getImageUrl(data?.logo),
      favicon: getImageUrl(data?.favicon),
      intro_video: videoFilename ? getImageUrl(videoFilename) : '', 
    });
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await configService.show();
        const data = res.data || res;
        setFormData(data);
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
      // Xem trước ảnh hoặc video mới ngay lập tức
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      
      // 🟢 3. DỌN RÁC TUYỆT ĐỐI KHI GỬI LÊN SERVER
      // Loại bỏ các trường file cũ, mảng meta và timestamp để tránh lỗi Unknown Column
      const blackList = ['logo', 'favicon', 'intro_video', 'meta', 'created_at', 'updated_at', 'id'];
      
      Object.keys(formData).forEach(key => {
        if (!blackList.includes(key) && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // 🟢 4. NÃ LỆNH APPEND FILE MỚI (Nếu có)
      if (files.logo) data.append('logo', files.logo);
      if (files.favicon) data.append('favicon', files.favicon);
      if (files.intro_video) data.append('intro_video', files.intro_video);

      await configService.update(data);
      toast.success('HỆ THỐNG ĐÃ ĐƯỢC TÁI CẤU HÌNH THÀNH CÔNG');

      // Refresh dữ liệu để đồng bộ tên file mới
      const res = await configService.show();
      const updatedData = res.data || res;
      setFormData(updatedData);
      updatePreviews(updatedData);
      setFiles({ logo: null, favicon: null, intro_video: null });
    } catch (error) {
      console.error("Submit Error:", error);
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