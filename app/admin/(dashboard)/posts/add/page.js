'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { usePostForm, useEditorTools } from '@/hooks/usePosts';
import { POST_TYPES, LAYOUT_TYPES, ABOUT_LAYOUTS } from '@/types';

import PageHeader from '@/components/admin/ui/PageHeader';
import {
    MdSave, MdCloudUpload, MdArticle, MdSettings,
    MdOutlineDescription, MdHistoryEdu, MdPlace,
    MdPhotoCamera, MdFileUpload, MdViewQuilt, MdSort,
    MdAdd, MdDelete
} from 'react-icons/md';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'indent', 'align', 'blockquote', 'code-block', 'link', 'image', 'table'];

export default function AddPostPage() {
    const quillRef = useRef(null);

    // 🟢 MÓC TẤT CẢ TỪ HOOK USEPOSTFORM ĐÃ ĐƯỢC ĐỘ LẠI
    const {
        formData, preview, categories, pageCategories, loading, isAboutPage,
        handleChange, handleContentChange, handleImageChange, handleSubmit,
        handleMetaChange, handleAboutQuillChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem
    } = usePostForm();

    const { isScanning, handleExcelImport, handleImageOCR, imageHandler } = useEditorTools(quillRef);

    const QUILL_MODULES = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                [{ align: [] }], ['blockquote', 'code-block'], ['link', 'image', 'table'], ['clean'],
            ],
            handlers: { image: imageHandler },
        },
    };

    // =================================================================
    // 🟢 RENDER KHỐI FORM RIÊNG CHO TRANG GIỚI THIỆU
    // =================================================================
    const renderAboutForm = () => {
        const meta = formData.meta || {};
        switch (formData.layout) {
            case 'hero':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        {/* Đã xóa phần Thương Hiệu và Năm Thành Lập ở đây */}
                        <div className="space-y-2"><label className="text-xs font-black text-gray-500 uppercase">Slogan</label><input type="text" name="slogan" value={meta.slogan || ''} onChange={handleMetaChange} className="w-full border-4 border-black p-3 font-bold" /></div>
                        <div className="space-y-2 normal-case"><label className="text-xs font-black text-gray-500 uppercase">Giới thiệu ngắn</label><ReactQuill theme="snow" value={meta.content || ''} onChange={(val) => handleAboutQuillChange('content', val)} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div>
                    </div>
                );
            case 'vision_mission':
                return (
                    <div className="grid grid-cols-1 gap-8 animate-in fade-in normal-case">
                        <div className="space-y-2"><label className="text-xs font-black text-orange-600 uppercase tracking-widest border-b-4 border-orange-600 pb-2 block">TẦM NHÌN</label><ReactQuill theme="snow" value={meta.vision || ''} onChange={(val) => handleAboutQuillChange('vision', val)} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div>
                        <div className="space-y-2"><label className="text-xs font-black text-black uppercase tracking-widest border-b-4 border-black pb-2 block">SỨ MỆNH</label><ReactQuill theme="snow" value={meta.mission || ''} onChange={(val) => handleAboutQuillChange('mission', val)} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div>
                    </div>
                );
            case 'core_values':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        {(meta.values || []).map((item, idx) => (
                            <div key={item.id || idx} className="p-6 border-4 border-black bg-gray-50 relative flex flex-col gap-4">
                                <button type="button" onClick={() => handleRemoveArrayItem('values', idx)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 border-2 border-black hover:scale-110 z-10"><MdDelete size={20} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Tên Icon (VD: quality)" value={item.icon || ''} onChange={(e) => handleArrayChange('values', idx, 'icon', e.target.value)} className="w-full border-2 border-black p-2 font-bold text-sm lowercase" />
                                    <input type="text" placeholder="Tiêu đề Giá trị" value={item.title || ''} onChange={(e) => handleArrayChange('values', idx, 'title', e.target.value)} className="w-full border-2 border-black p-2 font-black uppercase text-orange-600" />
                                </div>
                                <div className="normal-case"><ReactQuill theme="snow" value={item.desc || ''} onChange={(val) => handleArrayChange('values', idx, 'desc', val)} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('values', { icon: 'quality', title: 'GIÁ TRỊ MỚI', desc: '' })} className="bg-black text-white px-6 py-4 font-black uppercase flex items-center gap-2 hover:bg-orange-600 shadow-[6px_6px_0_0_#ea580c]"><MdAdd size={24} /> Thêm Giá Trị Cốt Lõi</button>
                    </div>
                );
            case 'timeline':
                return (
                    <div className="space-y-6 animate-in fade-in">
                        {(meta.events || []).map((item, idx) => (
                            <div key={item.id || idx} className="p-6 border-4 border-orange-600 bg-orange-50/30 relative flex flex-col md:flex-row gap-6">
                                <button type="button" onClick={() => handleRemoveArrayItem('events', idx)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 border-2 border-black hover:scale-110 z-10"><MdDelete size={20} /></button>
                                <div className="w-full md:w-1/4 space-y-4"><input type="text" placeholder="Năm (VD: 2026)" value={item.year || ''} onChange={(e) => handleArrayChange('events', idx, 'year', e.target.value)} className="w-full border-2 border-black p-4 font-black text-3xl text-center uppercase" /></div>
                                <div className="w-full md:w-3/4 space-y-4">
                                    <input type="text" placeholder="Tiêu đề sự kiện" value={item.title || ''} onChange={(e) => handleArrayChange('events', idx, 'title', e.target.value)} className="w-full border-2 border-black p-3 font-black uppercase" />
                                    <div className="normal-case"><ReactQuill theme="snow" value={item.desc || ''} onChange={(val) => handleArrayChange('events', idx, 'desc', val)} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('events', { year: '202X', title: 'SỰ KIỆN MỚI', desc: '' })} className="bg-orange-600 text-white px-6 py-4 font-black uppercase flex items-center gap-2 hover:bg-black shadow-[6px_6px_0_0_#000]"><MdAdd size={24} /> Thêm Mốc Lịch Sử</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            <PageHeader title="TẠO MỚI NỘI DUNG" subTitle="Dynamic Content Station" isBack={true} backHref="/admin/posts" />

            <style>{`.ql-editor table { border-collapse: collapse !important; width: 100% !important; margin: 20px 0 !important; border: 4px solid black !important; } .ql-editor td, .ql-editor th { border: 2px solid black !important; padding: 12px !important; min-width: 50px; text-align: center; } .ql-editor th { background-color: #f3f4f6 !important; font-weight: 900 !important; text-transform: uppercase !important; } .ql-toolbar.ql-snow { border: 4px solid black !important; border-bottom: none !important; background: #f9fafb; } .ql-container.ql-snow { border: 4px solid black !important; font-family: inherit; font-size: 16px; background: white; } .ql-editor { min-height: 450px; line-height: 1.75; padding: 24px; text-transform: none !important; }`}</style>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* 🔴 CỘT TRÁI */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
                        <h2 className="flex items-center gap-3 text-2xl font-black italic border-b-4 border-black pb-4"><MdHistoryEdu size={32} className="text-orange-600" /> {formData.post_type === 'page' ? 'BIÊN TẬP TRANG TĨNH / SECTION' : 'BIÊN TẬP BÀI VIẾT'}</h2>

                        {formData.post_type === 'page' ? (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdArticle /> TIÊU ĐỀ HỆ THỐNG (HIỂN THỊ TRONG BẢNG)</label><input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-3xl tracking-tighter outline-none focus:bg-gray-50 uppercase" required /></div>
                                {isAboutPage ? (
                                    <div className="pt-6 border-t-2 border-dashed border-gray-300"><h3 className="text-sm font-black text-orange-600 mb-6 italic">// NỘI DUNG KHỐI GIỚI THIỆU</h3>{renderAboutForm()}</div>
                                ) : (
                                    <><div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdOutlineDescription /> MÔ TẢ (META DESC)</label><textarea name="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows={2} className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] normal-case" /></div><div className="space-y-0 normal-case"><label className="text-[10px] font-black text-gray-400 italic uppercase mb-2 block tracking-widest">NỘI DUNG SECTION (HTML)</label><ReactQuill ref={quillRef} theme="snow" value={formData.meta_content || ''} onChange={handleContentChange} modules={QUILL_MODULES} formats={QUILL_FORMATS} /></div></>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdArticle /> TIÊU ĐỀ BÀI VIẾT</label><input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full border-4 border-black p-6 font-black text-3xl tracking-tighter outline-none focus:bg-orange-50 uppercase" required /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdOutlineDescription /> MÔ TẢ NGẮN (SAPO)</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] normal-case" /></div>
                                <div className="space-y-0 normal-case">
                                    <label className="text-[10px] font-black text-gray-400 italic uppercase mb-2 block tracking-widest">CHI TIẾT BÀI VIẾT</label>
                                    <div className="bg-black text-white p-2 border-x-4 border-t-4 border-black flex items-center gap-4 overflow-x-auto">
                                        <span className="text-[9px] font-black bg-orange-600 px-2 py-1 italic ml-2 shadow-[2px_2px_0_0_#fff] shrink-0">BẢNG TRA THÉP:</span>
                                        <div className="flex gap-2">
                                            <label className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-600 cursor-pointer hover:bg-green-600 shrink-0"><MdFileUpload className="text-green-400" /><span className="text-[9px] font-black">IMPORT EXCEL</span><input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="hidden" /></label>
                                            <label className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-600 cursor-pointer hover:bg-blue-600 shrink-0"><MdPhotoCamera className={isScanning ? 'animate-spin' : 'text-blue-400'} /><span className="text-[9px] font-black">{isScanning ? 'ĐANG QUÉT...' : 'SCAN OCR'}</span><input type="file" accept="image/*" onChange={handleImageOCR} className="hidden" disabled={isScanning} /></label>
                                        </div>
                                    </div>
                                    <ReactQuill ref={quillRef} theme="snow" value={formData.content || ''} onChange={handleContentChange} modules={QUILL_MODULES} formats={QUILL_FORMATS} />
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* 🔵 CỘT PHẢI */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-4 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_#ea580c]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic"><MdSettings size={20} /> PUBLISHING CONTROL</h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PHÂN LOẠI HỆ THỐNG</label>
                                <select name="post_type" value={formData.post_type} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-gray-50 outline-none cursor-pointer">
                                    {Object.entries(POST_TYPES).map(([val, label]) => (<option key={val} value={val}>{label}</option>))}
                                </select>
                            </div>

                            {formData.post_type === 'page' ? (
                                <div className="space-y-6 animate-in slide-in-from-right-2">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-orange-600 italic flex items-center gap-1"><MdPlace /> VỊ TRÍ HIỂN THỊ (SLOT)</label><select name="page_category_id" value={formData.page_category_id} onChange={handleChange} className="w-full border-4 border-orange-600 p-4 font-black bg-white outline-none cursor-pointer" required><option value="">-- CHỌN VỊ TRÍ --</option>{pageCategories.map((pc) => (<option key={pc.id} value={pc.id}>{pc.name.toUpperCase()}</option>))}</select></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2"><MdViewQuilt /> CHỌN LOẠI HIỂN THỊ</label><select name="layout" value={formData.layout || (isAboutPage ? 'hero' : 'text')} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-gray-50 outline-none cursor-pointer">{isAboutPage ? Object.entries(ABOUT_LAYOUTS).map(([val, label]) => ( <option key={val} value={val}>{label}</option> )) : Object.entries(LAYOUT_TYPES).map(([val, label]) => ( <option key={val} value={val}>{label}</option> ))}</select></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2"><MdSort /> THỨ TỰ (SORT ORDER)</label><input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-xl outline-none" min="0" /></div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-left-2"><div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic">CHỦ ĐỀ TIN TỨC</label><select name="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-white outline-none cursor-pointer"><option value="">-- CHỌN DANH MỤC --</option>{categories.map((cat) => ( <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option> ))}</select></div></div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">{isAboutPage ? 'ẢNH HIỂN THỊ / NỀN (MEDIA)' : 'FEATURED IMAGE'}</label>
                                <div className="relative border-4 border-dashed border-black group overflow-hidden bg-gray-50">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    {preview ? (<div className="relative h-48 w-full"><img src={preview} alt="Preview" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center"><p className="text-white font-black text-[10px] tracking-widest border-2 border-white p-2">THAY ĐỔI ẢNH</p></div></div>) : (<div className="py-12 text-center space-y-2 group-hover:bg-orange-50"><MdCloudUpload size={40} className="mx-auto text-gray-300 group-hover:text-black" /><p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black uppercase">Click or Drag Image</p></div>)}
                                </div>
                            </div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 italic">VISIBILITY STATUS</label><select name="status" value={formData.status ?? 1} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none cursor-pointer"><option value={1}>HIỂN THỊ CÔNG KHAI</option><option value={0}>LƯU NHÁP (DRAFT)</option></select></div>
                            <button type="submit" disabled={loading} className="w-full bg-black text-white py-8 text-sm font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"><div className="flex items-center justify-center gap-3"><MdSave size={24} /> {loading ? 'XỬ LÝ DỮ LIỆU...' : 'LƯU LÊN HỆ THỐNG →'}</div></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}