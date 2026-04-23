'use client';

import { use } from 'react';
import { useProductForm } from '@/hooks/useProducts';
import PageHeader from '@/components/admin/ui/PageHeader';
import {
    MdSave, MdCloudUpload, MdCollections, MdSettings,
    MdDescription, MdAssignment, MdBuild, MdClose, MdSync, MdAdd
} from 'react-icons/md';

export default function EditProductPage({ params }) {
    const { id } = use(params);

    // 🟢 1. Bốc đúng bộ 3 hàm quản lý dòng động từ Hook
    const {
        formData, thumbnailPreview, imagesPreviews, categories,
        attributes, productAttributes, fetching, loading,
        handleChange, handleThumbnailChange, handleImagesChange,
        removeImagePreview, addAttributeRow, removeAttributeRow, updateAttributeRow, handleSubmit,
    } = useProductForm(id);

    if (fetching) return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in fade-in duration-500">
            <MdSync size={80} className="animate-spin text-orange-600" />
            <p className="font-black uppercase italic tracking-[0.5em] text-2xl">Rebuilding Product Buffer...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase animate-in fade-in slide-in-from-top-6 duration-500">
            <PageHeader
                title="HIỆU CHỈNH"
                subTitle={`Product Unit ID: #${id}`}
                isBack={true}
                backHref="/admin/products"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-12">
                    {/* KHỐI 1: IDENTITY (Giữ nguyên của đại ca) */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[20px_20px_0_0_#000] space-y-10">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdAssignment size={32} className="text-orange-600" /> DATA_RESTRUCTURING
                        </h2>
                        {/* ... Các trường Name, Category, Description, Content giữ nguyên ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">SYSTEM CATEGORY</label>
                                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border-4 border-black p-5 font-black text-lg outline-none bg-orange-50 focus:bg-white cursor-pointer" required>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PRODUCT LABEL / NAME</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-4 border-black p-5 font-black text-2xl outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic">EDITORIAL SUMMARY (SAPO)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full border-4 border-black p-5 font-bold outline-none focus:bg-orange-50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Full Product Content & Documentation</label>
                            <textarea name="content" value={formData.content} onChange={handleChange} rows="12" className="w-full border-4 border-black p-8 font-medium normal-case leading-relaxed outline-none focus:ring-8 focus:ring-orange-500/10 transition-all" />
                        </div>
                    </section>

                    {/* 🟢 KHỐI 2: ENGINEERING SPECS (DỮ LIỆU ĐỘNG - ĐÃ HÀN LẠI) */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[20px_20px_0_0_#000] space-y-10">
                        <div className="flex justify-between items-center border-b-4 border-black pb-4">
                            <h2 className="flex items-center gap-4 text-2xl font-black italic">
                                <MdBuild size={32} className="text-orange-600" /> TECH_SPEC_DYNAMIC_CONFIG
                            </h2>
                            {/* NÚT THÊM THÔNG SỐ */}
                            <button
                                type="button"
                                onClick={addAttributeRow}
                                className="bg-black text-white px-6 py-2 font-black text-[10px] tracking-widest shadow-[4px_4px_0_0_#ea580c] hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <MdAdd size={18} /> ADD_SPEC_UNIT
                            </button>
                        </div>

                        <div className="space-y-6">
                            {productAttributes.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-6 items-end animate-in fade-in slide-in-from-left-4">
                                    <div className="flex-1 space-y-2 w-full">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">// SPEC_CATEGORY</span>
                                        <select
                                            value={item.attribute_id}
                                            onChange={(e) => updateAttributeRow(index, 'attribute_id', e.target.value)}
                                            className="w-full border-4 border-black p-3 font-black bg-orange-50 outline-none focus:bg-white transition-all text-sm"
                                        >
                                            <option value="">-- SELECT --</option>
                                            {attributes.map(attr => (
                                                <option key={attr.id} value={attr.id}>{attr.name.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-[2] space-y-2 w-full">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">// SPEC_VALUE</span>
                                        <input
                                            type="text"
                                            placeholder="Input value..."
                                            value={item.value}
                                            onChange={(e) => updateAttributeRow(index, 'value', e.target.value)}
                                            className="w-full border-4 border-black p-3 font-black text-lg outline-none bg-transparent focus:bg-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeAttributeRow(index)}
                                        className="p-3 border-4 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0_0_#000] mb-0.5"
                                    >
                                        <MdClose size={24} />
                                    </button>
                                </div>
                            ))}

                            {productAttributes.length === 0 && (
                                <div className="text-center py-12 border-4 border-dashed border-gray-100 font-black text-gray-300 italic">
                                    NO_SPECIFICATIONS_DEFINED
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-black border-dashed">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">SYSTEM STANDARD</label>
                                <input type="text" name="standard" value={formData.standard} onChange={handleChange} className="w-full border-4 border-black p-5 font-black text-sm outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PRACTICAL APPLICATION</label>
                                <input type="text" name="application" value={formData.application} onChange={handleChange} className="w-full border-4 border-black p-5 font-black text-sm outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                        </div>
                    </section>
                </div>
                {/* 🟠 CỘT PHẢI: ASSETS MANAGEMENT (1/3) */}
                <aside className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-[6px] border-black p-8 shadow-[15px_15px_0_0_#ea580c] space-y-10">

                            {/* THUMBNAIL */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                    <MdCloudUpload size={24} /> PRIMARY ASSET
                                </h3>
                                <div className="relative aspect-square border-4 border-dashed border-black group bg-gray-50 overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    {thumbnailPreview ? (
                                        <div className="relative h-full w-full">
                                            <img src={thumbnailPreview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Thumbnail" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                <MdCloudUpload size={32} className="text-white mb-2" />
                                                <p className="text-white font-black text-[10px] border-2 border-white p-2 uppercase">Override Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 p-6 text-center">
                                            <MdCloudUpload size={56} />
                                            <p className="text-[9px] font-black uppercase mt-4">No Asset Detected</p>
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

                                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {imagesPreviews.map((item, idx) => (
                                        <div key={idx} className="relative aspect-square border-2 border-black group overflow-hidden bg-white shadow-[4px_4px_0_0_#000]">
                                            <img src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Gallery" />
                                            <button
                                                type="button"
                                                onClick={() => removeImagePreview(idx)}
                                                className="absolute top-1 right-1 bg-black text-white p-1 border border-white hover:bg-red-600 transition-colors"
                                            >
                                                <MdClose size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">INVENTORY_STATUS</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none cursor-pointer shadow-[4px_4px_0_0_#000]"
                                >
                                    <option value={1}>ACTIVE / AUTHORIZED</option>
                                    <option value={0}>ARCHIVED / LOCKED</option>
                                </select>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full bg-black text-white py-8 font-black text-xl uppercase tracking-[0.4em] transition-all hover:bg-orange-600 active:translate-x-2 active:translate-y-2 active:shadow-none shadow-[10px_10px_0_0_#ea580c] disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-4 relative z-10">
                                    <MdSave size={28} />
                                    {loading ? 'SYNCHRONIZING...' : 'SAVE CHANGES →'}
                                </div>
                                <div className="absolute inset-0 translate-x-2 translate-y-2 border-2 border-black -z-10 bg-white"></div>
                            </button>
                        </div>
                    </div>
                </aside>
            </form>
        </div>
    );
}