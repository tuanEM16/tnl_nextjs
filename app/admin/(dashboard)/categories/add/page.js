'use client';

import { useCategoryForm } from '@/hooks/useCategories'; // 🟢 Triệu hồi Hook "nội công"
import { MdCloudUpload, MdSave, MdLayers, MdDescription, MdSettings, MdInfo } from 'react-icons/md';
import PageHeader from '@/components/admin/ui/PageHeader';

export default function AddCategoryPage() {
    // 1. DÙNG HOOK (Dọn sạch đống code logic thừa thãi)
    const {
        formData,
        preview,
        loading,
        parentOptions,
        handleChange,
        handleImageChange,
        handleSubmit,
        renderParentOptions,
    } = useCategoryForm(); // Không truyền ID = Chế độ THÊM MỚI

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 font-archivo uppercase animate-in slide-in-from-right-8 duration-500">
            {/* 🔴 HEADER NICKELBRONX */}
            <PageHeader 
                title="THÊM MỚI" 
                subTitle="New Taxonomy Entry" 
                isBack={true} 
                backHref="/admin/categories"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: THÔNG TIN PHÂN LOẠI (2/3) */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-10">
                        <h2 className="text-2xl font-black italic border-b-4 border-black pb-4 flex items-center gap-4">
                            <MdLayers size={32} className="text-orange-600"/> CATEGORY IDENTITY
                        </h2>

                        {/* Tên Danh Mục */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Tên danh mục thép / nội thất</label>
                            <input 
                                name="name" 
                                type="text" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="NHẬP TÊN DANH MỤC..."
                                className="w-full border-4 border-black p-5 font-black text-2xl outline-none focus:bg-orange-50 transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" 
                                required 
                            />
                        </div>

                        {/* Danh Mục Cha */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Cấp bậc hệ thống (Hierarchy)</label>
                            <select 
                                name="parent_id" 
                                value={formData.parent_id} 
                                onChange={handleChange} 
                                className="w-full border-4 border-black p-5 font-black text-lg outline-none bg-white cursor-pointer hover:bg-gray-50 appearance-none"
                            >
                                <option value="0">-- THIẾT LẬP LÀ DANH MỤC GỐC --</option>
                                {renderParentOptions(parentOptions)}
                            </select>
                        </div>

                        {/* Mô Tả */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest flex items-center gap-2">
                                <MdDescription /> Mô tả chi tiết / Ghi chú
                            </label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="6"
                                placeholder="Mô tả ngắn gọn về nhóm sản phẩm này để hỗ trợ SEO..."
                                className="w-full border-4 border-black p-5 font-bold outline-none focus:bg-orange-50 transition-all normal-case leading-relaxed" 
                            />
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: MEDIA & ACTION (1/3) */}
                <aside className="space-y-8">
                    <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0_0_#ea580c] space-y-10 sticky top-10">
                        
                        {/* ẢNH ĐẠI DIỆN */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase italic border-b-2 border-black/5 pb-2">Visual Asset</label>
                            <div className="relative aspect-square border-4 border-dashed border-black group overflow-hidden bg-gray-50">
                                {preview ? (
                                    <div className="relative h-full w-full">
                                        <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-black text-[10px] border-2 border-white p-2">THAY ĐỔI ẢNH</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-6 text-center group-hover:bg-orange-50 transition-colors">
                                        <MdCloudUpload size={56} />
                                        <span className="text-[9px] font-black uppercase mt-4">Drop Image or Click</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            </div>
                        </div>

                        {/* CẤU HÌNH THỨ TỰ & TRẠNG THÁI */}
                        <div className="space-y-6 pt-6 border-t-2 border-black border-dashed">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic tracking-widest flex items-center gap-2">
                                    <MdSettings /> Ưu tiên hiển thị
                                </label>
                                <input 
                                    name="sort_order" 
                                    type="number" 
                                    value={formData.sort_order} 
                                    onChange={handleChange} 
                                    className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Tình trạng xuất bản</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none cursor-pointer"
                                >
                                    <option value={1}>ACTIVE / PUBLISHED</option>
                                    <option value={0}>DRAFT / HIDDEN</option>
                                </select>
                            </div>
                        </div>

                        {/* NÚT LƯU */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full bg-black text-white py-8 font-black text-xl uppercase tracking-[0.4em] transition-all hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[8px_8px_0_0_#ea580c] disabled:grayscale disabled:opacity-50"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <MdSave size={28} />
                                {loading ? 'SAVING...' : 'COMMIT DATA →'}
                            </div>
                        </button>
                    </div>

                    {/* TIPBOX */}
                    <div className="p-6 border-4 border-black border-dashed bg-yellow-50 flex gap-4 shadow-[8px_8px_0_0_#000]">
                        <MdInfo size={28} className="shrink-0 text-black" />
                        <p className="text-[9px] font-black leading-relaxed italic">
                            HỆ THỐNG PHÂN CẤP TỰ ĐỘNG CẬP NHẬT TRÊN NAVBAR WEBSITE NGAY SAU KHI DỮ LIỆU ĐƯỢC LƯU.
                        </p>
                    </div>
                </aside>
            </form>
        </div>
    );
}