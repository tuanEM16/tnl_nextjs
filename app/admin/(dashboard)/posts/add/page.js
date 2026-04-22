'use client';

import { usePostForm } from '@/hooks/usePosts'; // 🟢 Dùng Hook đã đúc
import { POST_TYPES, GLOBAL_STATUS } from '@/types';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';

import { MdSave, MdCloudUpload, MdArticle, MdSettings, MdInfo, MdOutlineDescription, MdHistoryEdu } from 'react-icons/md';

export default function AddPostPage() {
    // 1. TRIỆU HỒI HOOK (Dọn sạch đống useState rườm rà)
    const {
        formData,
        preview,
        categories,
        loading,
        handleChange,
        handleImageChange,
        handleSubmit,
    } = usePostForm(); // Truyền id nếu là trang Edit, không truyền là trang Add

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER NICKELBRONX */}
            <PageHeader 
                title="VIẾT BÀI" 
                subTitle="Content Editorial Station" 
                isBack={true} 
                backHref="/admin/posts"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: KHÔNG GIAN SÁNG TẠO (NẶNG ĐÔ) */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
                        <h2 className="flex items-center gap-3 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdHistoryEdu size={32} className="text-orange-600" /> NỘI DUNG BIÊN TẬP
                        </h2>

                        {/* TIÊU ĐỀ */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdArticle /> TIÊU ĐỀ BÀI VIẾT (BẮT BUỘC)
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="NHẬP TIÊU ĐỀ THU HÚT..."
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border-4 border-black p-6 font-black text-3xl tracking-tighter outline-none focus:bg-orange-50 transition-all placeholder:text-gray-200"
                                required
                            />
                        </div>

                        {/* SAPO */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdOutlineDescription /> MÔ TẢ NGẮN (SAPO)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Tóm tắt ngắn gọn nội dung để thu hút người đọc..."
                                className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            ></textarea>
                        </div>

                        {/* NỘI DUNG CHÍNH */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Chi tiết nội dung</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="18"
                                placeholder="Bắt đầu viết những điều tuyệt vời tại đây..."
                                className="w-full border-4 border-black p-8 font-medium normal-case leading-relaxed outline-none focus:ring-8 focus:ring-orange-500/10 transition-all"
                                required
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: CẤU HÌNH HỆ THỐNG (STICKY) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        
                        {/* CARD CẤU HÌNH */}
                        <div className="bg-white border-4 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_#ea580c]">
                            
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                <MdSettings size={20} /> PUBLISHING CONTROL
                            </h3>

                            {/* LOẠI BÀI */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PHÂN LOẠI NỘI DUNG</label>
                                <select
                                    name="post_type"
                                    value={formData.post_type}
                                    onChange={handleChange}
                                    className="w-full border-4 border-black p-4 font-black bg-gray-50 outline-none cursor-pointer hover:bg-orange-50 transition-colors"
                                >
                                    {Object.entries(POST_TYPES).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* DANH MỤC */}
                            {formData.post_type === 'post' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-gray-400 italic">CHỦ ĐỀ TIN TỨC</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="w-full border-4 border-black p-4 font-black bg-white outline-none cursor-pointer"
                                    >
                                        <option value="">-- CHỌN DANH MỤC --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ẢNH BÌA */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic">FEATURED IMAGE</label>
                                <div className="relative border-4 border-dashed border-black group overflow-hidden bg-gray-50">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                    />
                                    {preview ? (
                                        <div className="relative h-48 w-full">
                                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-black text-[10px] tracking-widest border-2 border-white p-2">THAY ĐỔI ẢNH</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center space-y-2 group-hover:bg-orange-50 transition-colors">
                                            <MdCloudUpload size={40} className="mx-auto text-gray-300 group-hover:text-black transition-colors" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black uppercase">Click or Drag Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* TRẠNG THÁI */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">VISIBILITY STATUS</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none"
                                >
                                    <option value={1}>HIỂN THỊ CÔNG KHAI</option>
                                    <option value={0}>LƯU NHÁP (DRAFT)</option>
                                </select>
                            </div>

                            {/* NÚT XUẤT BẢN */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-8 text-sm font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:grayscale"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <MdSave size={24} />
                                    {loading ? 'XỬ LÝ DỮ LIỆU...' : 'XUẤT BẢN NGAY →'}
                                </div>
                            </button>
                        </div>

                        {/* TIPBOX */}
                        <div className="p-6 border-4 border-black border-dashed bg-yellow-50 flex gap-4 shadow-[6px_6px_0_0_#000]">
                            <MdInfo size={32} className="shrink-0 text-black" />
                            <p className="text-[9px] font-black leading-relaxed italic">
                                LƯU Ý: TIÊU ĐỀ NÊN DƯỚI 70 KÝ TỰ ĐỂ TỐI ƯU SEO. NỘI DUNG CẦN CÓ ÍT NHẤT MỘT ẢNH MINH HỌA ĐỂ TĂNG TƯƠNG TÁC.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}