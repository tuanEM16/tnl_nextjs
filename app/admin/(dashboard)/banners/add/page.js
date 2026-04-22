'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bannerService } from '@/services/bannerService';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdCloudUpload, MdLaptopMac, MdSettings, MdInfo } from 'react-icons/md';

export default function AddBannerPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        page: 'home',
        sort_order: 0,
        description: '',
        status: 1,
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);

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
        if (!imageFile) {
            toast.error('VUI LÒNG CHỌN FILE ẢNH BANNER');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('image', imageFile);
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));

            await bannerService.create(data);
            toast.success('ĐÃ CẤU HÌNH BANNER MỚI THÀNH CÔNG');
            router.push('/admin/banners');
        } catch (error) {
            toast.error('LỖI HỆ THỐNG - THÊM THẤT BẠI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Visual Asset Configuration</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        NEW BANNER<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors tracking-widest uppercase"
                >
                    <MdArrowBack size={20} /> QUAY LẠI
                </button>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: THÔNG SỐ CẤU HÌNH (2/3) */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-8">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm uppercase">
                            <MdSettings size={24}/> THÔNG SỐ KỸ THUẬT
                        </h2>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Tên định danh Banner</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Vd: Banner Khuyến Mãi Tháng 4..."
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-5 font-black text-xl outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] placeholder:text-gray-200" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Trang hiển thị mục tiêu</label>
                                <select 
                                    name="page" 
                                    value={formData.page} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-gray-50 focus:bg-orange-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                                >
                                    <option value="home">TRANG CHỦ (HOME)</option>
                                    <option value="product">DANH SÁCH SẢN PHẨM</option>
                                    <option value="product_detail">CHI TIẾT SẢN PHẨM</option>
                                    <option value="about">GIỚI THIỆU CÔNG TY</option>
                                    <option value="project">DỰ ÁN THI CÔNG</option>
                                    <option value="news">TRUYỀN THÔNG & TIN TỨC</option>
                                    <option value="contact">LIÊN HỆ TRỰC TUYẾN</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Thứ tự ưu tiên (Sort)</label>
                                <input 
                                    type="number" 
                                    name="sort_order" 
                                    value={formData.sort_order} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Đường dẫn liên kết (Redirect Link)</label>
                            <input 
                                type="text" 
                                name="link" 
                                placeholder="https://..."
                                value={formData.link} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] lowercase placeholder:normal-case" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Mô tả nội bộ (Internal Note)</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                                rows="3"
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: MEDIA PREVIEW (1/3) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white border-2 border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic uppercase">
                                <MdLaptopMac size={20}/> Display Preview
                            </h3>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase block text-center">Nạp file ảnh Banner</label>
                                <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 transition-all group overflow-hidden bg-gray-50/50">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        required={!preview}
                                    />
                                    {preview ? (
                                        <div className="space-y-2">
                                            <img src={preview} alt="Preview" className="w-full h-auto max-h-60 object-contain border border-black shadow-sm" />
                                            <p className="text-[9px] font-black text-orange-600 italic tracking-widest">[ FILE READY FOR UPLOAD ]</p>
                                        </div>
                                    ) : (
                                        <div className="py-16">
                                            <MdCloudUpload size={40} className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black uppercase">Click to Select Media File</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái vận hành</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer"
                                >
                                    <option value={1}>HIỂN THỊ CÔNG KHAI (LIVE)</option>
                                    <option value={0}>TẠM DỪNG (DISABLED)</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                            >
                                <MdSave size={24} />
                                {loading ? 'UPLOADING...' : 'LƯU BANNER →'}
                            </button>
                        </div>

                        <div className="p-6 border-2 border-black border-dashed bg-gray-50/50">
                            <p className="text-[9px] font-black flex items-center gap-2 leading-relaxed">
                                <MdInfo size={14} className="shrink-0 text-black"/> 
                                <span>TIP: KÍCH THƯỚC KHUYÊN DÙNG LÀ 1920x800px ĐỂ CÓ CHẤT LƯỢNG HIỂN THỊ TỐT NHẤT TRÊN PC.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}