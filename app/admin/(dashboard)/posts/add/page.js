'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { usePostForm } from '@/hooks/usePosts';
import { POST_TYPES } from '@/types';
import { getImageUrl } from '@/lib/utils';

import PageHeader from '@/components/admin/ui/PageHeader';
import {
    MdSave, MdCloudUpload, MdArticle, MdSettings,
    MdInfo, MdOutlineDescription, MdHistoryEdu, MdPlace
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
    'blockquote', 'code-block', 'link', 'image',
];

export default function AddPostPage() {
    const quillRef = useRef(null);

    const {
        formData,
        preview,
        categories,
        pageCategories,
        loading,
        handleChange,
        handleImageChange,
        handleSubmit,
    } = usePostForm();

    const handleContentChange = (value) => {
        handleChange({ target: { name: 'content', value } });
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const uploadData = new FormData();
            uploadData.append('image', file);

            try {
                // 1. Gọi đúng API Upload của đại ca (cổng 5000)
                const res = await fetch('http://localhost:5000/api/posts/upload-content', {
                    method: 'POST',
                    body: uploadData, // Gửi file đi
                });

                const result = await res.json();

                if (result.filename) {
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection(true);

                    // 2. Chèn URL tuyệt đối có chứa "/uploads/" để Backend regex bốc được
                    // Đây là chìa khóa để bảng post_images không bị lưu chữ "z"
                    const finalImageUrl = `http://localhost:5000/uploads/${result.filename}`;

                    editor.insertEmbed(range.index, 'image', finalImageUrl);
                    editor.setSelection(range.index + 1);
                }
            } catch (err) {
                console.error('❌ Upload ảnh thất bại:', err);
            }
        };
    }, []);

    // ✅ QUILL_MODULES dùng imageHandler custom — định nghĩa trong component
    // để imageHandler có thể truy cập quillRef
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
                ['link', 'image'], // nút image sẽ dùng handler bên dưới
                ['clean'],
            ],
            handlers: {
                image: imageHandler, // ✅ override handler mặc định
            },
        },
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            <PageHeader
                title="VIẾT BÀI"
                subTitle="Content Editorial Station"
                isBack={true}
                backHref="/admin/posts"
            />

            <style>{`
  /* 🟢 GIỮ NGUYÊN KHUNG VÀ MÀU SẮC CỦA ĐẠI CA */
  .ql-toolbar.ql-snow {
    border: 4px solid black !important;
    border-bottom: 2px solid black !important;
    background: #f9fafb;
    font-family: inherit;
  }
  .ql-container.ql-snow {
    border: 4px solid black !important;
    border-top: none !important;
    font-family: inherit;
    font-size: 16px;
    background: white;
  }
  .ql-editor {
    min-height: 320px;
    line-height: 1.75;
    padding: 24px;
    text-transform: none !important;
  }
  .ql-editor.ql-blank::before {
    font-style: normal;
    color: #d1d5db;
    font-weight: 700;
    font-size: 14px;
    text-transform: none;
  }
  .ql-editor:focus { outline: none; background: #fff9f5; }
  
  /* 🟢 HÀN THÊM: BỘ ĐIỀU HƯỚNG CĂN LỀ (GIẢI QUYẾT VỤ ĐỨNG IM) */
  .ql-editor .ql-align-center { text-align: center; }
  .ql-editor .ql-align-right { text-align: right; }
  .ql-editor .ql-align-left { text-align: left; }

  /* 🟢 HÀN THÊM: ĐỊNH DẠNG ẢNH ĐỂ NÓ CHỊU NHẢY THEO LỆNH */
  .ql-editor img {
    max-width: 100%;
    height: auto;
    display: inline-block; /* Chìa khóa để text-align: center có tác dụng */
    margin: 10px 0;
  }

  /* 🟢 GIỮ NGUYÊN MÀU ICON TOOLBAR */
  .ql-snow .ql-stroke { stroke: #000; }
  .ql-snow .ql-fill  { fill: #000; }
  .ql-snow.ql-toolbar button:hover .ql-stroke,
  .ql-snow .ql-toolbar button:hover .ql-stroke { stroke: #ea580c; }
  .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #ea580c; }
  .ql-snow.ql-toolbar button.ql-active { color: #ea580c; }
`}</style>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* CỘT TRÁI */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
                        <h2 className="flex items-center gap-3 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdHistoryEdu size={32} className="text-orange-600" /> NỘI DUNG BIÊN TẬP
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase">
                                <MdArticle /> TIÊU ĐỀ BÀI VIẾT (BẮT BUỘC)
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="NHẬP TIÊU ĐỀ THU HÚT..."
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border-4 border-black p-6 font-black text-3xl tracking-tighter outline-none focus:bg-orange-50 transition-all placeholder:text-gray-200 uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 uppercase">
                                <MdOutlineDescription /> MÔ TẢ NGẮN (SAPO)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tóm tắt ngắn gọn nội dung để thu hút người đọc..."
                                className="w-full border-2 border-black p-5 font-bold outline-none bg-gray-50 focus:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] normal-case"
                            />
                        </div>

                        {/* ✅ Quill với ref để imageHandler truy cập editor */}
                        <div className="space-y-2 normal-case">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">
                                CHI TIẾT NỘI DUNG
                            </label>
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={QUILL_MODULES}
                                formats={QUILL_FORMATS}
                                placeholder="Bắt đầu viết những điều tuyệt vời tại đây..."
                            />
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        <div className="bg-white border-4 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_#ea580c]">

                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                <MdSettings size={20} /> PUBLISHING CONTROL
                            </h3>

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