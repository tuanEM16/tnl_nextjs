'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdCloudUpload, MdCollections, MdSettings, MdDescription } from 'react-icons/md';

export default function AddProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        content: '',
        standard: '',
        application: '',
        status: 1,
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [images, setImages] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, attrRes] = await Promise.all([
                    categoryService.getAll(),
                    productService.getAttributes()
                ]);
                setCategories(catRes.data || []);
                setAttributes(attrRes.data || []);
            } catch (error) {
                toast.error('LỖI KẾT NỐI DỮ LIỆU');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setImagesPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleAttributeChange = (attrId, value) => {
        setSelectedAttributes(prev => {
            const filtered = prev.filter(a => a.attribute_id !== attrId);
            if (value) filtered.push({ attribute_id: attrId, value });
            return filtered;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('VUI LÒNG NHẬP TÊN SẢN PHẨM');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (thumbnail) data.append('thumbnail', thumbnail);
            images.forEach(file => data.append('images', file));
            if (selectedAttributes.length > 0) {
                data.append('attributes', JSON.stringify(selectedAttributes));
            }

            await productService.create(data);
            toast.success('ĐÃ THÊM SẢN PHẨM VÀO KHO');
            router.push('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'THÊM THẤT BẠI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Inventory Management</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none">SẢN PHẨM<span className="text-orange-600">.</span></h1>
                </div>
                <button onClick={() => router.back()} className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors">
                    <MdArrowBack size={20} /> QUAY LẠI
                </button>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
                <div className="lg:col-span-2 space-y-12">
                    {/* KHỐI 1: CƠ BẢN */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3">
                            <MdDescription size={24}/> THÔNG TIN CƠ BẢN
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Danh mục sản phẩm</label>
                                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-orange-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" required>
                                    <option value="">-- CHỌN DANH MỤC --</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Tên sản phẩm thép</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" required />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic">Mô tả ngắn gọn</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic">Nội dung chi tiết sản phẩm</label>
                            <textarea name="content" value={formData.content} onChange={handleChange} rows="6" className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                        </div>
                    </section>

                    {/* KHỐI 2: THÔNG SỐ KỸ THUẬT */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-orange-600 pl-4 bg-gray-50 py-3">
                            <MdSettings size={24}/> THÔNG SỐ KỸ THUẬT
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {attributes.map(attr => (
                                <div key={attr.id} className="flex items-center gap-4 group">
                                    <span className="w-32 text-[10px] font-black text-gray-500 group-hover:text-black transition-colors">{attr.name}</span>
                                    <input
                                        type="text"
                                        placeholder="..."
                                        className="flex-1 border-b-2 border-black/20 focus:border-black p-2 font-bold outline-none transition-all"
                                        onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Tiêu chuẩn kỹ thuật</label>
                                <input type="text" name="standard" value={formData.standard} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Ứng dụng thực tế</label>
                                <input type="text" name="application" value={formData.application} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: HÌNH ẢNH & STATUS */}
                <div className="space-y-10">
                    <div className="bg-white border-2 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sticky top-10">
                        {/* THUMBNAIL */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic"><MdCloudUpload size={20}/> ẢNH ĐẠI DIỆN</h3>
                            <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 transition-all group">
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} className="mx-auto max-h-40 object-cover" alt="Preview" />
                                ) : (
                                    <div className="py-8">
                                        <MdCloudUpload size={32} className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                                        <p className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-black">CHỌN ẢNH CHÍNH</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* GALLERY */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic"><MdCollections size={20}/> THƯ VIỆN ẢNH</h3>
                            <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="w-full text-[10px] font-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white hover:file:bg-orange-600" />
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {imagesPreviews.map((src, idx) => <img key={idx} src={src} className="w-full h-12 object-cover border border-black" />)}
                            </div>
                        </div>

                        {/* STATUS */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái kho</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-black p-4 font-black outline-none bg-orange-50">
                                <option value={1}>HIỂN THỊ CÔNG KHAI</option>
                                <option value={0}>LƯU KHO (ẨN)</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] active:scale-95 disabled:opacity-50"
                        >
                            <MdSave size={24} />
                            {loading ? 'DANG XỬ LÝ...' : 'LƯU SẢN PHẨM →'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}