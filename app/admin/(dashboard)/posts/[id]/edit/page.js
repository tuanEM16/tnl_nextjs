'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useRef } from 'react'; 
import { usePostForm, useEditorTools } from '@/hooks/usePosts'; // 🟢 Triệu hồi thêm useEditorTools
import { POST_TYPES } from '@/types';

import PageHeader from '@/components/admin/ui/PageHeader';
import { 
    MdSave, MdCloudUpload, MdArticle, MdSettings, 
    MdInfo, MdOutlineDescription, MdHistoryEdu, MdPlace,
    MdPhotoCamera, MdFileUpload 
} from 'react-icons/md';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => (
        <div className="border-4 border-black h-64 flex items-center justify-center bg-gray-50">
            <p className="text-[10px] font-black tracking-widest text-gray-400 animate-pulse">ĐANG TẢI EDITOR...</p>
        </div>
    ),
});
import 'react-quill-new/dist/quill.snow.css';

const QUILL_FORMATS = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'indent', 'align',
    'blockquote', 'code-block', 'link', 'image', 'table',
];

export default function EditPostPage() {
    const { id } = useParams();
    const quillRef = useRef(null);

    // 🟢 1. Lấy state và data của Form từ Hook (Dùng chung cho cả Add & Edit)
    const {
        formData, preview, oldImage, categories, pageCategories, fetching, loading,
        handleChange, handleImageChange, handleSubmit,
    } = usePostForm(id);

    // 🟢 2. Lấy Công cụ Editor (Excel, OCR, Ảnh) từ Hook vừa tách
    const { 
        isScanning, handleExcelImport, handleImageOCR, imageHandler 
    } = useEditorTools(quillRef);

    const QUILL_MODULES = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'table'],
                ['clean'],
            ],
            handlers: { image: imageHandler }, // 🟢 Đã liên kết với hàm trong hook
        },
    };

    const handleContentChange = (value) => {
        if (value.includes('data:image')) return;
        handleChange({ target: { name: 'content', value } });
    };

    if (fetching) return (
        <div className="p-32 text-center font-black italic animate-pulse uppercase tracking-[0.4em] text-black">
            REBUILDING CONTENT BUFFER...
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            <PageHeader title="CHỈNH SỬA" subTitle="Content Modification Unit" isBack={true} backHref="/admin/posts" />

            <style>{`
                .ql-editor table { border-collapse: collapse !important; width: 100% !important; margin: 20px 0 !important; border: 4px solid black !important; }
                .ql-editor td, .ql-editor th { border: 2px solid black !important; padding: 12px !important; min-width: 50px; text-align: center; }
                .ql-editor th { background-color: #f3f4f6 !important; font-weight: 900 !important; text-transform: uppercase !important; }
                .ql-toolbar.ql-snow { border: 4px solid black !important; border-bottom: none !important; background: #f9fafb; }
                .ql-container.ql-snow { border: 4px solid black !important; font-family: inherit; font-size: 16px; background: white; }
                .ql-editor { min-height: 320px; line-height: 1.75; padding: 24px; text-transform: none !important; }
                .ql-editor:focus { outline: none; background: #fff9f5; }
                .ql-editor .ql-align-center { text-align: center; }
                .ql-editor img { max-width: 100%; height: auto; display: inline-block; margin: 10px 0; }
                .ql-snow .ql-stroke { stroke: #000; }
                .ql-snow.ql-toolbar button:hover .ql-stroke { stroke: #ea580c; }
                .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #ea580c; }
            `}</style>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
                        <h2 className="flex items-center gap-3 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdHistoryEdu size={32} className="text-orange-600" /> TÁI CẤU TRÚC NỘI DUNG
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdArticle /> TIÊU ĐỀ BÀI VIẾT</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-4 border-black p-6 font-black text-3xl tracking-tighter outline-none focus:bg-orange-50 transition-all uppercase" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase"><MdOutlineDescription /> MÔ TẢ TÓM TẮT (SAPO)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] normal-case" />
                        </div>

                        <div className="space-y-0 normal-case">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase mb-2 block tracking-widest">NỘI DUNG CHI TIẾT</label>
                            
                            {/* 🎯 THANH QUÉT BẢNG SIÊU TỐC */}
                            <div className="bg-black text-white p-2 border-x-4 border-t-4 border-black flex items-center gap-4">
                                <span className="text-[9px] font-black bg-orange-600 px-2 py-1 italic ml-2 shadow-[2px_2px_0_0_#fff]">BẢNG TRA THÉP:</span>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-600 cursor-pointer hover:bg-green-600 transition-all">
                                        <MdFileUpload className="text-green-400" />
                                        <span className="text-[9px] font-black uppercase">IMPORT EXCEL</span>
                                        <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="hidden" />
                                    </label>
                                    <label className="flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-600 cursor-pointer hover:bg-blue-600 transition-all">
                                        <MdPhotoCamera className={isScanning ? 'animate-spin' : 'text-blue-400'} />
                                        <span className="text-[9px] font-black uppercase">{isScanning ? 'ĐANG QUÉT...' : 'SCAN CATALOGUE'}</span>
                                        <input type="file" accept="image/*" onChange={handleImageOCR} className="hidden" disabled={isScanning} />
                                    </label>
                                </div>
                                <span className="text-[8px] text-zinc-500 italic ml-auto mr-4 hidden md:block">// Tự động đồng bộ bảng dữ liệu</span>
                            </div>

                            {/* Chỉ mount Editor khi đã fetch xong */}
                            {!fetching && (
                                <ReactQuill ref={quillRef} theme="snow" value={formData.content || ''} onChange={handleContentChange} modules={QUILL_MODULES} formats={QUILL_FORMATS} placeholder="Chỉnh sửa nội dung tại đây..." />
                            )}
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-4 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_#ea580c]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic"><MdSettings size={20} /> TECHNICAL CONFIG</h3>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">PHÂN LOẠI HỆ THỐNG</label>
                                <select name="post_type" value={formData.post_type} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-gray-50 outline-none cursor-pointer uppercase">
                                    {Object.entries(POST_TYPES).map(([val, label]) => ( <option key={val} value={val}>{label}</option> ))}
                                </select>
                            </div>

                            {formData.post_type === 'page' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black text-orange-600 italic flex items-center gap-1"><MdPlace /> VỊ TRÍ HIỂN THỊ</label>
                                    <select name="page_category_id" value={formData.page_category_id} onChange={handleChange} className="w-full border-4 border-orange-600 p-4 font-black bg-white outline-none" required>
                                        <option value="">-- CHỌN VỊ TRÍ --</option>
                                        {pageCategories.map((pc) => ( <option key={pc.id} value={pc.id}>{pc.name.toUpperCase()}</option> ))}
                                    </select>
                                </div>
                            )}

                            {formData.post_type === 'post' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 italic">DANH MỤC PHÂN LOẠI</label>
                                    <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-white outline-none cursor-pointer">
                                        <option value="">-- CHỌN DANH MỤC --</option>
                                        {categories.map((cat) => ( <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option> ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic flex justify-between uppercase">
                                    <span>COVER ASSET</span>
                                    {oldImage && !preview.includes('blob') && ( <span className="text-orange-600">[ORIGINAL]</span> )}
                                </label>
                                <div className="relative border-4 border-dashed border-black group overflow-hidden bg-gray-50">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    {preview ? (
                                        <div className="relative h-48 w-full">
                                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">VISIBILITY STATUS</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none">
                                    <option value={1}>HIỂN THỊ CÔNG KHAI</option>
                                    <option value={0}>LƯU NHÁP (DRAFT)</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-black text-white py-8 text-sm font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50">
                                <div className="flex items-center justify-center gap-3">
                                    <MdSave size={24} /> {loading ? 'SYNCHRONIZING...' : 'CẬP NHẬT DỮ LIỆU →'}
                                </div>
                            </button>
                        </div>

                        <div className="p-6 border-4 border-black border-dashed bg-blue-50 flex gap-4 shadow-[6px_6px_0_0_#000]">
                            <MdInfo size={32} className="shrink-0 text-black" />
                            <p className="text-[9px] font-black leading-relaxed italic text-blue-900">CẨN TRỌNG: MỌI THAY ĐỔI TRONG PHẦN NÀY SẼ GHI ĐÈ TRỰC TIẾP LÊN DỮ LIỆU CŨ TRÊN HỆ THỐNG THÉP TNL.</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}