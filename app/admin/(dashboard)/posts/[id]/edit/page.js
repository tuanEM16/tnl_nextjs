'use client';

import { useParams } from 'next/navigation';
import { usePostForm } from '@/hooks/usePosts'; 
import { POST_TYPES } from '@/types';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdSave, MdCloudUpload, MdArticle, MdSettings, MdInfo, MdOutlineDescription, MdHistoryEdu, MdPlace } from 'react-icons/md';

export default function EditPostPage() {
    const { id } = useParams();

    // 1. TRIỆU HỒI HOOK (Tự động Fetch dữ liệu theo ID)
    const {
        formData,
        preview,
        oldImage,
        categories,
        pageCategories, // 🟢 BỐC THÊM THẰNG NÀY ĐỂ HIỆN VỊ TRÍ CŨ
        fetching,
        loading,
        handleChange,
        handleImageChange,
        handleSubmit,
    } = usePostForm(id);

    // 2. MÀN HÌNH CHỜ (CỰC LÌ)
    if (fetching) return (
        <div className="p-32 text-center font-black italic animate-pulse uppercase tracking-[0.4em] text-black">
            REBUILDING CONTENT BUFFER...
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            <PageHeader 
                title="CHỈNH SỬA" 
                subTitle="Content Modification Unit" 
                isBack={true} 
                backHref="/admin/posts"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: KHÔNG GIAN BIÊN TẬP */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
                        <h2 className="flex items-center gap-3 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdHistoryEdu size={32} className="text-orange-600" /> TÁI CẤU TRÚC NỘI DUNG
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase">
                                <MdArticle /> TIÊU ĐỀ BÀI VIẾT
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border-4 border-black p-6 font-black text-3xl tracking-tighter outline-none focus:bg-orange-50 transition-all uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase">
                                <MdOutlineDescription /> MÔ TẢ TÓM TẮT (SAPO)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Nội dung chi tiết</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="18"
                                className="w-full border-4 border-black p-8 font-medium normal-case leading-relaxed outline-none focus:ring-8 focus:ring-orange-500/10 transition-all"
                                required
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: TECHNICAL CONFIG */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-4 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_#ea580c]">
                            
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                <MdSettings size={20} /> TECHNICAL CONFIG
                            </h3>

                            {/* LOẠI BÀI */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PHÂN LOẠI HỆ THỐNG</label>
                                <select
                                    name="post_type"
                                    value={formData.post_type}
                                    onChange={handleChange}
                                    className="w-full border-4 border-black p-4 font-black bg-gray-50 outline-none cursor-pointer"
                                >
                                    {Object.entries(POST_TYPES).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 🟢 DANH MỤC TRANG TĨNH (VỊ TRÍ SLOT) */}
                            {formData.post_type === 'page' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-orange-600 italic flex items-center gap-1">
                                        <MdPlace /> VỊ TRÍ HIỂN THỊ (SLOT)
                                    </label>
                                    <select
                                        name="page_category_id"
                                        value={formData.page_category_id}
                                        onChange={handleChange}
                                        className="w-full border-4 border-orange-600 p-4 font-black bg-white outline-none cursor-pointer"
                                        required
                                    >
                                        <option value="">-- CHỌN VỊ TRÍ --</option>
                                        {pageCategories.map((pc) => (
                                            <option key={pc.id} value={pc.id}>{pc.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* DANH MỤC TIN TỨC */}
                            {formData.post_type === 'post' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 italic">DANH MỤC PHÂN LOẠI</label>
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

                            {/* ẢNH ĐẠI DIỆN */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic flex justify-between uppercase">
                                    <span>COVER ASSET</span>
                                    {oldImage && !preview.includes('blob') && (
                                        <span className="text-orange-600">[ORIGINAL]</span>
                                    )}
                                </label>
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
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                <MdCloudUpload size={32} className="text-white mb-2" />
                                                <p className="text-white font-black text-[10px] tracking-widest border-2 border-white p-2">THAY ĐỔI ẢNH</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center group-hover:bg-orange-50 transition-colors">
                                            <MdCloudUpload size={40} className="mx-auto text-gray-300 group-hover:text-black transition-colors" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black uppercase mt-2">Upload New Cover</p>
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
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none shadow-[4px_4px_0_0_#000]"
                                >
                                    <option value={1}>HIỂN THỊ (LIVE)</option>
                                    <option value={0}>TẠM ẨN (DRAFT)</option>
                                </select>
                            </div>

                            {/* NÚT CẬP NHẬT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-8 text-sm font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <MdSave size={24} />
                                    {loading ? 'SYNCHRONIZING...' : 'CẬP NHẬT DỮ LIỆU →'}
                                </div>
                            </button>
                        </div>

                        <div className="p-6 border-4 border-black border-dashed bg-blue-50 flex gap-4 shadow-[6px_6px_0_0_#000]">
                            <MdInfo size={32} className="shrink-0 text-black" />
                            <p className="text-[9px] font-black leading-relaxed italic text-blue-900">
                                CẨN TRỌNG: MỌI THAY ĐỔI TRONG PHẦN NÀY SẼ GHI ĐÈ TRỰC TIẾP LÊN DỮ LIỆU CŨ TRÊN HỆ THỐNG THÉP TNL.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}