'use client';

import { use } from 'react';
import { useCategoryForm } from '@/hooks/useCategories'; // 🟢 Triệu hồi Hook "não bộ"
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdCloudUpload, MdSave, MdLayers, MdDescription, MdSettings, MdInfo, MdSync } from 'react-icons/md';

export default function EditCategoryPage({ params }) {
    // 1. UNWRAP PARAMS (Next.js 15 Style)
    const { id } = use(params);

    // 2. DÙNG HOOK (Dọn sạch đống useEffect và logic FormData rườm rà)
    const {
        formData,
        preview,
        imageFile,
        loading,
        fetching,
        parentOptions,
        handleChange,
        handleImageChange,
        handleSubmit,
        renderParentOptions,
    } = useCategoryForm(id); // Truyền ID vào là tự hiểu chế độ CHỈNH SỬA

    // 3. MÀN HÌNH CHỜ ĐỒNG BỘ
    if (fetching) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in duration-500">
            <MdSync size={60} className="animate-spin text-orange-600" />
            <p className="font-black uppercase italic tracking-[0.4em] text-xl">Rebuilding Category Buffer...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 font-archivo uppercase animate-in slide-in-from-right-8 duration-500">
            {/* 🔴 HEADER ĐIỀU HƯỚNG */}
            <PageHeader 
                title="HIỆU CHỈNH" 
                subTitle={`Taxonomy ID: #${id}`} 
                isBack={true} 
                backHref="/admin/categories"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: DATA CONFIGURE (2/3) */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-[6px] border-black p-10 shadow-[20px_20px_0_0_#000] space-y-10">
                        <h2 className="text-2xl font-black italic border-b-4 border-black pb-4 flex items-center gap-4">
                            <MdLayers size={32} className="text-orange-600"/> CATEGORY ARCHITECTURE
                        </h2>

                        {/* Tên Danh Mục */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Tên phân loại (Thép / Nội thất)</label>
                            <input 
                                name="name" 
                                type="text" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full border-4 border-black p-5 font-black text-2xl outline-none focus:bg-orange-50 transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" 
                                required 
                            />
                        </div>

                        {/* Danh Mục Cha */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Vị trí trong sơ đồ (Hierarchy)</label>
                            <select 
                                name="parent_id" 
                                value={formData.parent_id} 
                                onChange={handleChange} 
                                className="w-full border-4 border-black p-5 font-black text-lg outline-none bg-white cursor-pointer hover:bg-gray-50 appearance-none transition-colors"
                            >
                                <option value="0">-- THIẾT LẬP LÀ DANH MỤC GỐC (ROOT) --</option>
                                {renderParentOptions(parentOptions)}
                            </select>
                        </div>

                        {/* Mô Tả */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest flex items-center gap-2">
                                <MdDescription /> Mô tả chi tiết hệ thống
                            </label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="6"
                                className="w-full border-4 border-black p-5 font-bold outline-none focus:bg-orange-50 transition-all normal-case leading-relaxed" 
                            />
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: ASSETS & STATUS (1/3) */}
                <aside className="space-y-8">
                    <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0_0_#ea580c] space-y-10 sticky top-10">
                        
                        {/* HÌNH ẢNH ĐẠI DIỆN */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase italic border-b-2 border-black/5 pb-2">Visual Asset</label>
                            <div className="relative aspect-square border-4 border-dashed border-black group overflow-hidden bg-gray-50">
                                {preview ? (
                                    <div className="relative h-full w-full">
                                        <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                                            <MdCloudUpload size={32} className="text-white" />
                                            <p className="text-white font-black text-[10px] border-2 border-white p-2">THAY ĐỔI ẢNH</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-6 text-center group-hover:bg-orange-50">
                                        <MdCloudUpload size={56} />
                                        <span className="text-[9px] font-black uppercase mt-4">Upload New Visual</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            {preview && !imageFile && (
                                <p className="text-[8px] font-black text-center text-orange-600 italic uppercase">System Image Detected</p>
                            )}
                        </div>

                        {/* THỨ TỰ & TRẠNG THÁI */}
                        <div className="space-y-6 pt-6 border-t-2 border-black border-dashed">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic tracking-widest flex items-center gap-2">
                                    <MdSettings /> Priority Order
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
                                <label className="text-[10px] font-black text-gray-400 italic tracking-widest">Visibility Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none cursor-pointer hover:bg-orange-100"
                                >
                                    <option value={1}>ACTIVE / VISIBLE</option>
                                    <option value={0}>DISABLED / HIDDEN</option>
                                </select>
                            </div>
                        </div>

                        {/* NÚT CẬP NHẬT */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full bg-black text-white py-8 font-black text-xl uppercase tracking-[0.4em] transition-all hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[8px_8px_0_0_#ea580c] disabled:grayscale disabled:opacity-50"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <MdSave size={28} />
                                {loading ? 'SYNCHRONIZING...' : 'UPDATE SYSTEM →'}
                            </div>
                        </button>
                    </div>

                    {/* DANGER ZONE / INFO */}
                    <div className="p-6 border-4 border-black border-dashed bg-blue-50 flex gap-4 shadow-[8px_8px_0_0_#000]">
                        <MdInfo size={28} className="shrink-0 text-blue-600" />
                        <p className="text-[9px] font-black leading-relaxed italic text-blue-900">
                            CẨN TRỌNG: MỌI THAY ĐỔI VỀ PHÂN CẤP (PARENT) CÓ THỂ LÀM THAY ĐỔI CẤU TRÚC ĐIỀU HƯỚNG TRÊN TOÀN BỘ WEBSITE.
                        </p>
                    </div>
                </aside>
            </form>
        </div>
    );
}