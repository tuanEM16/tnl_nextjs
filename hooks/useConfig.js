// hooks/useConfig.js
import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import toast from 'react-hot-toast';

export const useConfig = () => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({ logo: null, favicon: null });
  const [previews, setPreviews] = useState({ logo: '', favicon: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await configService.show();
        setFormData(res.data || {});
        if (res.data?.logo) {
          setPreviews(prev => ({ ...prev, logo: `${imageUrl}/${res.data.logo}` }));
        }
        if (res.data?.favicon) {
          setPreviews(prev => ({ ...prev, favicon: `${imageUrl}/${res.data.favicon}` }));
        }
      } catch (error) {
        toast.error('LỖI TRUY XUẤT THÔNG SỐ HỆ THỐNG');
      } finally {
        setFetching(false);
      }
    };
    fetchConfig();
  }, [imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      if (files.logo) data.append('logo', files.logo);
      if (files.favicon) data.append('favicon', files.favicon);

      await configService.update(data);
      toast.success('HỆ THỐNG ĐÃ ĐƯỢC TÁI CẤU HÌNH THÀNH CÔNG');
      // Refresh lại dữ liệu sau khi cập nhật để hiển thị ảnh mới từ server
      const res = await configService.show();
      setFormData(res.data || {});
      setPreviews({
        logo: res.data?.logo ? `${imageUrl}/${res.data.logo}` : '',
        favicon: res.data?.favicon ? `${imageUrl}/${res.data.favicon}` : '',
      });
      setFiles({ logo: null, favicon: null });
    } catch (error) {
      toast.error('CẤU HÌNH THẤT BẠI - KIỂM TRA LẠI SERVER');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    files,
    previews,
    loading,
    fetching,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};