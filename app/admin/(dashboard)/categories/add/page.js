'use client';

import React, { useState, useEffect } from 'react'; // Phải có React để dùng Fragment
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { MdCloudUpload, MdArrowBack, MdSave } from 'react-icons/md';

export default function AddCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '0',
    sort_order: 0,
    description: '',
    status: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll({ tree: true });
        setCategories(res.data || []);
      } catch (error) {
        console.error('Lỗi lấy danh sách danh mục');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('VUI LÒNG NHẬP TÊN DANH MỤC');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      if (imageFile) data.append('image', imageFile);
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      await categoryService.create(data);
      toast.success('THÊM DANH MỤC THÀNH CÔNG');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'THÊM THẤT BẠI');
    } finally {
      setLoading(false);
    }
  };


  const renderOptions = (nodes, prefix = '') => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <option value={node.id}>
          {prefix}{node.name.toUpperCase()}
        </option>
        {node.children?.length > 0 && renderOptions(node.children, prefix + '↳ ')}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-12 pb-20 font-archivo uppercase">
      {/* HEADER NickelBronx */}
      <header className="border-b-4 border-black pb-8 flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic">New Taxonomy Entry</p>
          <h1 className="text-7xl font-black tracking-tighter leading-none">
            THÊM DANH MỤC<span className="text-orange-600">.</span>
          </h1>
        </div>
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 border-2 border-black px-6 py-4 text-[10px] font-black hover:bg-gray-100 transition-colors"
        >
          <MdArrowBack size={18} /> QUAY LẠI
        </button>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* LEFT: MAIN FIELDS */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-gray-400">Tên danh mục thép mới</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-black p-5 text-2xl font-black outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
              placeholder="NHẬP TÊN DANH MỤC..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-gray-400 italic">Cấp bậc cha (Parent)</label>
              <select 
                name="parent_id" 
                value={formData.parent_id} 
                onChange={handleChange} 
                className="w-full border-2 border-black p-4 font-black text-sm outline-none bg-white appearance-none cursor-pointer hover:bg-gray-50"
              >
                <option value="0">-- DANH MỤC GỐC --</option>
                {renderOptions(categories)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400">Thứ tự</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-4 font-black outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400">Trạng thái</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full border-2 border-black p-4 font-black outline-none bg-white"
                >
                  <option value={1}>HIỂN THỊ</option>
                  <option value={0}>TẠM ẨN</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-gray-400">Ghi chú / Mô tả hệ thống</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border-2 border-black p-5 font-bold outline-none focus:bg-orange-50 min-h-[150px]"
              placeholder="MÔ TẢ NGẮN GỌN VỀ PHÂN LOẠI NÀY..."
            />
          </div>
        </div>

        {/* RIGHT: MEDIA SECTION */}
        <div className="space-y-10">
          <div className="bg-white border-[1.5px] border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-4">
              <label className="text-[10px] font-black tracking-widest text-gray-400 underline block">Visual Identity</label>
              <div className="relative border-4 border-dashed border-black p-10 hover:bg-black hover:text-white transition-all cursor-pointer group text-center">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="relative z-0">
                  <MdCloudUpload size={40} className="mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black italic">UPLOAD CATEGORY IMAGE</p>
                </div>
              </div>
              {preview && (
                <div className="mt-4 border-2 border-black p-1 bg-white grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="relative aspect-video w-full">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-black text-white py-6 text-xs font-black tracking-[0.3em] hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] active:scale-95 flex items-center justify-center gap-3"
              >
                <MdSave size={18} />
                {loading ? 'STORING DATA...' : 'LƯU DANH MỤC →'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}