'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/postService';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdCloudUpload, MdArticle, MdSettings, MdInfo } from 'react-icons/md';

export default function AddPostPage() {
    const router = useRouter();
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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await postService.getCategories();
                setCategories(res.data || []);
            } catch (error) {
                toast.error('LỖI TẢI DANH MỤC HỆ THỐNG');
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
        if (!formData.title.trim()) {
            toast.error('VUI LÒNG NHẬP TIÊU ĐỀ BÀI VIẾT');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('post_type', formData.post_type);
            data.append('description', formData.description || '');
            data.append('content', formData.content);
            data.append('status', formData.status);

            if (formData.post_type === 'post' && formData.category_id) {
                data.append('category_id', formData.category_id);
            }

            if (imageFile) {
                data.append('image', imageFile);
            }

            await postService.create(data);
            toast.success('BÀI VIẾT ĐÃ ĐƯỢC XUẤT BẢN');
            router.push('/admin/posts');
        } catch (error) {
            toast.error(error.response?.data?.message || 'LỖI HỆ THỐNG - THÊM THẤT BẠI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Edition */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Content Editorial Station</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        BÀI VIẾT<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors tracking-widest"
                >
                    <MdArrowBack size={20} /> QUAY LẠI
                </button>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: NỘI DUNG SÁNG TẠO */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm">
                            <MdArticle size={24} /> NỘI DUNG CHÍNH
                        </h2>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Tiêu đề bài viết</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="NHẬP TIÊU ĐỀ THU HÚT..."
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-6 font-black text-2xl tracking-tighter outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] placeholder:text-gray-200"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Mô tả ngắn (Sapo)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Tóm tắt nội dung bài viết..."
                                className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-orange-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                            ></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Nội dung chi tiết</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="15"
                                placeholder="Viết nội dung bài viết tại đây..."
                                className="w-full border-2 border-black p-6 font-medium normal-case leading-relaxed outline-none focus:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                required
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: CẤU HÌNH & XUẤT BẢN - ĐÃ FIX LỖI BỂ */}
                <div className="relative">
                    <div className="sticky top-10 space-y-6">
                        {/* Khối nội dung chính */}
                        <div className="bg-white border-2 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">

                            {/* THÔNG TIN PHÂN LOẠI */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic uppercase">
                                    <MdSettings size={20} /> Cấu hình bài viết
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 italic uppercase">Loại nội dung</label>
                                        <select
                                            name="post_type"
                                            value={formData.post_type}
                                            onChange={handleChange}
                                            className="w-full border-2 border-black p-4 font-black outline-none bg-gray-50 focus:bg-orange-50 transition-all cursor-pointer"
                                        >
                                            <option value="post">TIN TỨC / BLOG</option>
                                            <option value="page">TRANG TĨNH (GIỚI THIỆU...)</option>
                                            <option value="project">DỰ ÁN CÔNG TRÌNH</option>
                                        </select>
                                    </div>

                                    {formData.post_type === 'post' && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Danh mục tin</label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="w-full border-2 border-black p-4 font-black outline-none bg-white focus:bg-orange-50 transition-all"
                                            >
                                                <option value="">-- CHỌN DANH MỤC --</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* HÌNH ẢNH ĐẠI DIỆN */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic uppercase">
                                    <MdCloudUpload size={20} /> Ảnh bìa (Cover)
                                </h3>
                                <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 transition-all group">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="mx-auto max-h-40 object-cover border border-black shadow-sm" />
                                    ) : (
                                        <div className="py-10">
                                            <MdCloudUpload size={32} className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black">CHỌN ẢNH ĐẠI DIỆN</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* TRẠNG THÁI */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái xuất bản</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer"
                                >
                                    <option value={1}>HIỂN THỊ CÔNG KHAI</option>
                                    <option value={0}>LƯU NHÁP (DRAFT)</option>
                                </select>
                            </div>

                            {/* NÚT LƯU */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                            >
                                <MdSave size={24} />
                                {loading ? 'STORING...' : 'LƯU BÀI VIẾT →'}
                            </button>
                        </div>

                        {/* Khối TIP - Đã tách biệt và thêm Margin để không bị shadow đè */}
                        <div className="p-6 border-2 border-black border-dashed bg-gray-50/50 mt-4">
                            <p className="text-[9px] font-black flex items-center gap-2 leading-relaxed">
                                <MdInfo size={14} className="text-black shrink-0" />
                                <span>TIP: NÊN CHỌN ẢNH CÓ TỈ LỆ 16:9 ĐỂ HIỂN THỊ ĐẸP NHẤT TRÊN WEBSITE.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}