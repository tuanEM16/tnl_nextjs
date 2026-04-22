'use client';

import { useProductForm } from '@/hooks/useProducts'; // 🟢 Triệu hồi nội công
import PageHeader from '@/components/admin/ui/PageHeader';
import { 
    MdSave, MdCloudUpload, MdCollections, MdSettings, 
    MdDescription, MdAssignment, MdBuild, MdClose, MdSync 
} from 'react-icons/md';

export default function AddProductPage() {
    // 1. DÙNG HOOK (Dọn sạch đống useEffect và logic FormData)
    const {
        formData, thumbnailPreview, imagesPreviews, categories, 
        attributes, selectedAttributes, fetching, loading,
        handleChange, handleThumbnailChange, handleImagesChange, 
        removeImagePreview, handleAttributeChange, handleSubmit,
    } = useProductForm(); // Không truyền ID = Chế độ THÊM MỚI

    // 2. MÀN HÌNH CHỜ TRUY XUẤT THÔNG SỐ
    if (fetching) return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 border-[12px] border-black border-t-orange-600 animate-spin shadow-[10px_10px_0_0_#000]"></div>
            <p className="font-black uppercase italic tracking-[0.5em] text-2xl">Syncing Industrial Data...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase animate-in slide-in-from-bottom-6 duration-500">
            {/* 🔴 HEADER ĐỒNG BỘ */}
            <PageHeader 
                title="Thêm sản phẩm" 
                subTitle="New Product Integration Unit" 
                isBack={true} 
                backHref="/admin/products"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: TECHNICAL SPECIFICATIONS (2/3) */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* KHỐI 1: ĐỊNH DANH CƠ BẢN */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-10">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdAssignment size={32} className="text-orange-600" /> PRODUCT_ID & CORE DATA
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PHÂN LOẠI DANH MỤC</label>
                                <select 
                                    name="category_id" 
                                    value={formData.category_id} 
                                    onChange={handleChange} 
                                    className="w-full border-4 border-black p-5 font-black text-lg outline-none bg-orange-50 focus:bg-white cursor-pointer transition-all" 
                                    required
                                >
                                    <option value="">-- CHỌN DANH MỤC HÀNG --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">TÊN SẢN PHẨM / MÃ THÉP</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="VD: THÉP TẤM CÁN NÓNG SS400"
                                    className="w-full border-4 border-black p-5 font-black text-2xl outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdDescription size={16}/> MÔ TẢ TÓM TẮT (SAPO)
                            </label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="2" 
                                className="w-full border-4 border-black p-5 font-bold outline-none focus:bg-orange-50 transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Nội dung chi tiết & Bài viết giới thiệu</label>
                            <textarea 
                                name="content" 
                                value={formData.content} 
                                onChange={handleChange} 
                                rows="10" 
                                className="w-full border-4 border-black p-8 font-medium normal-case leading-relaxed outline-none focus:ring-8 focus:ring-orange-500/10 transition-all" 
                            />
                        </div>
                    </section>

                    {/* KHỐI 2: THÔNG SỐ KỸ THUẬT (DỮ LIỆU ĐỘNG) */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-10">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdBuild size={32} className="text-orange-600" /> ENGINEERING SPECS
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                            {attributes.map(attr => (
                                <div key={attr.id} className="flex flex-col gap-2 group">
                                    <span className="text-[10px] font-black text-gray-400 group-hover:text-black transition-colors">
                                        // {attr.name.toUpperCase()}
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={`NHẬP ${attr.name.toUpperCase()}...`}
                                        className="border-b-4 border-black/20 focus:border-orange-600 p-3 font-black text-lg outline-none bg-transparent transition-all"
                                        onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-black border-dashed">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">TIÊU CHUẨN (STANDARD)</label>
                                <input type="text" name="standard" value={formData.standard} onChange={handleChange} placeholder="VD: ASTM A36 / JIS G3101" className="w-full border-4 border-black p-5 font-black text-sm outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">ỨNG DỤNG (APPLICATION)</label>
                                <input type="text" name="application" value={formData.application} onChange={handleChange} placeholder="VD: ĐÓNG TÀU, XÂY DỰNG" className="w-full border-4 border-black p-5 font-black text-sm outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: VISUAL ASSETS & ACTION (1/3) */}
                <aside className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0_0_#ea580c] space-y-10">
                            
                            {/* THUMBNAIL */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                    <MdCloudUpload size={24} /> MAIN VISUAL
                                </h3>
                                <div className="relative aspect-square border-4 border-dashed border-black group bg-gray-50 overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
                                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    {thumbnailPreview ? (
                                        <div className="relative h-full w-full">
                                            <img src={thumbnailPreview} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Thumbnail" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-black text-[10px] border-2 border-white p-2">CHANGE IMAGE</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 p-6 text-center group-hover:bg-orange-50 transition-colors">
                                            <MdCloudUpload size={56} />
                                            <p className="text-[9px] font-black uppercase mt-4">Upload Master Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GALLERY */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                    <MdCollections size={24} /> ASSET GALLERY
                                </h3>
                                <div className="relative border-4 border-black p-4 bg-gray-50">
                                    <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="w-full text-[9px] font-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white hover:file:bg-orange-600" />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    {imagesPreviews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square border-2 border-black group overflow-hidden bg-white shadow-[3px_3px_0_0_#000]">
                                            <img src={src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Gallery" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImagePreview(idx)}
                                                className="absolute top-1 right-1 bg-black text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MdClose size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">INVENTORY STATUS</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none cursor-pointer"
                                >
                                    <option value={1}>ACTIVE / IN STOCK</option>
                                    <option value={0}>DRAFT / HIDDEN</option>
                                </select>
                            </div>

                            {/* SUBMIT */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="group relative w-full bg-black text-white py-8 font-black text-xl uppercase tracking-[0.4em] transition-all hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[8px_8px_0_0_#ea580c] disabled:grayscale disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <MdSave size={28} />
                                    {loading ? 'STORING...' : 'COMMIT DATA →'}
                                </div>
                            </button>
                        </div>
                    </div>
                </aside>
            </form>
        </div>
    );
}