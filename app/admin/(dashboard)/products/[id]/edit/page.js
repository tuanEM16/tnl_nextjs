'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import toast from 'react-hot-toast';
import { MdCloudUpload } from 'react-icons/md';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        content: '',
        standard: '',
        application: '',
        status: 1,
    });

    const [thumbnail, setThumbnail] = useState(null); // File ảnh mới chọn
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, catRes, attrRes] = await Promise.all([
                    productService.getById(id),
                    categoryService.getAll(),
                    productService.getAttributes(),
                ]);

                const product = productRes.data;
                setFormData({
                    category_id: product.category_id?.toString() || '',
                    name: product.name || '',
                    description: product.description || '',
                    content: product.content || '',
                    standard: product.standard || '',
                    application: product.application || '',
                    status: product.status !== undefined ? product.status : 1,
                });

                if (product.thumbnail) {
                    setThumbnailPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.thumbnail}`);
                }
                setCategories(catRes.data || []);
                setAttributes(attrRes.data || []);
                if (product.attributes) {
                    setSelectedAttributes(product.attributes.map(attr => ({
                        attribute_id: attr.attribute_id,
                        value: attr.value,
                    })));
                }
            } catch (error) {
                toast.error('LỖI TRUY XUẤT DỮ LIỆU');
                router.push('/admin/products');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file); // Lưu file vào state
            setThumbnailPreview(URL.createObjectURL(file));
        }
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
        setLoading(true);
        try {
            const data = new FormData();
            


            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });


            if (thumbnail) {
                data.append('thumbnail', thumbnail); 
            }

            data.append('attributes', JSON.stringify(selectedAttributes));

            await productService.update(id, data);
            toast.success('CẬP NHẬT THÉP THÀNH CÔNG');
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error('CẬP NHẬT THẤT BẠI - CHECK LẠI BACKEND');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 font-black uppercase italic animate-pulse text-center">Scanning warehouse...</div>;

    return (
        <div className="space-y-12 pb-20 font-archivo">
            <header className="border-b-4 border-black pb-8">
                <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-2 italic text-center md:text-left">TNL STEEL SYSTEM</p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-center md:text-left">
                    SỬA SẢN PHẨM<span className="text-orange-600">.</span>
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tên sản phẩm</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-black p-4 text-xl font-black uppercase outline-none focus:bg-black focus:text-white transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Danh mục</label>
                            <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border-2 border-black p-4 font-black uppercase text-sm outline-none">
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic underline text-orange-600">Thông số chi tiết (Attributes)</label>
                            <div className="space-y-3 bg-gray-50 p-6 border border-black/10">
                                {attributes.map(attr => (
                                    <div key={attr.id} className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black uppercase text-gray-500">{attr.name}</span>
                                        <input
                                            type="text"
                                            className="border-b border-black bg-transparent py-1 font-bold text-sm outline-none focus:border-orange-600 transition-colors"
                                            value={selectedAttributes.find(a => a.attribute_id === attr.id)?.value || ''}
                                            onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tiêu chuẩn kỹ thuật</label>
                                <input type="text" name="standard" value={formData.standard} onChange={handleChange} className="w-full border-[1.5px] border-black p-4 font-bold outline-none focus:border-orange-600" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ứng dụng</label>
                                <input type="text" name="application" value={formData.application} onChange={handleChange} className="w-full border-[1.5px] border-black p-4 font-bold outline-none focus:border-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nội dung bài viết</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows="10" className="w-full border-[1.5px] border-black p-5 font-medium outline-none focus:bg-orange-50 transition-all shadow-inner" />
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-white border-[1.5px] border-black p-8 space-y-8 sticky top-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block underline">Thumbnail Media</label>
                            <div className="relative border-2 border-dashed border-black p-10 hover:bg-black hover:text-white transition-all cursor-pointer group text-center overflow-hidden">
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className="relative z-0">
                                    <MdCloudUpload size={40} className="mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <p className="text-[10px] font-black uppercase tracking-tighter italic">RE-FORGE THE IMAGE</p>
                                </div>
                            </div>
                            {thumbnailPreview && (
                                <div className="mt-4 border-2 border-black p-1 grayscale hover:grayscale-0 transition-all duration-700 bg-white shadow-xl">
                                    <img src={thumbnailPreview} className="w-full aspect-[4/3] object-cover" alt="Preview" />
                                    {!thumbnail && <p className="text-[8px] font-black uppercase text-center mt-2 text-gray-400 tracking-widest tracking-widest italic tracking-widest">Active Database Image</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-6">
                            <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
                                {loading ? 'FORGING CHANGES...' : 'LƯU THÔNG SỐ →'}
                            </button>
                            <button type="button" onClick={() => router.back()} className="w-full border-2 border-black py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-colors">HỦY BỎ</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}