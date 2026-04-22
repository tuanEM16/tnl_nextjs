'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { bannerService } from '@/services/bannerService';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdCloudUpload, MdSettings, MdMonitor, MdInfo } from 'react-icons/md';

export default function EditBannerPage() {
    const router = useRouter();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        link: '',
        page: 'home',
        sort_order: 0,
        description: '',
        status: 1,
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [oldImage, setOldImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);


    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await bannerService.getById(id);
                const banner = res.data;
                setFormData({
                    name: banner.name,
                    link: banner.link || '',
                    page: banner.page,
                    sort_order: banner.sort_order,
                    description: banner.description || '',
                    status: banner.status,
                });
                if (banner.image) {
                    setOldImage(banner.image);
                    setPreview(`${imageUrl}/${banner.image}`);
                }
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DỮ LIỆU BANNER');
                router.push('/admin/banners');
            } finally {
                setFetching(false);
            }
        };
        fetchBanner();
    }, [id, router, imageUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            if (imageFile) {
                data.append('image', imageFile); 
            }
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));

            await bannerService.update(id, data);
            toast.success('DỮ LIỆU VISUAL ĐÃ ĐƯỢC TÁI CẤU TRÚC!');
            router.push('/admin/banners');
        } catch (error) {
            toast.error('CẬP NHẬT THẤT BẠI - CHECK LẠI BACKEND');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center">Recalibrating Banner Data...</div>;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Style */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Visual Asset Modification</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        EDIT BANNER<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors tracking-widest uppercase"
                >
                    <MdArrowBack size={20} /> QUAY LẠI
                </button>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: THÔNG SỐ BIẾN THỂ (2/3) */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-8">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm uppercase">
                            <MdSettings size={24}/> THÔNG SỐ CẤU HÌNH
                        </h2>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Tên định danh (ID Name)</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-5 font-black text-xl outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Vị trí trang đích</label>
                                <select 
                                    name="page" 
                                    value={formData.page} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-gray-50 focus:bg-orange-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                                >
                                    <option value="home">TRANG CHỦ</option>
                                    <option value="product">SẢN PHẨM</option>
                                    <option value="product_detail">CHI TIẾT SP</option>
                                    <option value="about">GIỚI THIỆU</option>
                                    <option value="project">DỰ ÁN</option>
                                    <option value="news">TRUYỀN THÔNG</option>
                                    <option value="contact">LIÊN HỆ</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Thứ tự hiển thị</label>
                                <input 
                                    type="number" 
                                    name="sort_order" 
                                    value={formData.sort_order} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Đường dẫn Redirect (URL)</label>
                            <input 
                                type="text" 
                                name="link" 
                                value={formData.link} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] lowercase" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Mô tả hệ thống</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                                rows="4"
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: LIVE PREVIEW & STATUS (1/3) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white border-2 border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic uppercase">
                                <MdMonitor size={20}/> Visual Preview
                            </h3>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase block text-center">Thay đổi tệp hình ảnh</label>
                                <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 transition-all group overflow-hidden bg-gray-50/50">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    />
                                    {preview ? (
                                        <div className="space-y-3">
                                            <img src={preview} alt="Preview" className="w-full h-auto max-h-48 object-contain border border-black shadow-sm" />
                                            {imageFile ? (
                                                <p className="text-[9px] font-black text-green-600 italic tracking-widest">[ NEW FILE SELECTED ]</p>
                                            ) : (
                                                <p className="text-[9px] font-black text-orange-600 italic tracking-widest">[ CURRENT SERVER IMAGE ]</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <MdCloudUpload size={32} className="mx-auto mb-2 text-gray-300 group-hover:text-black" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Click to Update Media</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái vận hành</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer"
                                >
                                    <option value={1}>HIỂN THỊ (LIVE)</option>
                                    <option value={0}>TẠM ẨN (DISABLED)</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                            >
                                <MdSave size={24} />
                                {loading ? 'SYNCING...' : 'CẬP NHẬT BANNER →'}
                            </button>
                        </div>

                        <div className="p-6 border-2 border-black border-dashed bg-gray-50/50">
                            <p className="text-[9px] font-black flex items-center gap-2 leading-relaxed">
                                <MdInfo size={14} className="shrink-0 text-black"/> 
                                <span>LƯU Ý: HỆ THỐNG SẼ TỰ ĐỘNG GỠ BỎ TỆP CŨ KHI TỆP MỚI ĐƯỢC XÁC NHẬN CẬP NHẬT.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}