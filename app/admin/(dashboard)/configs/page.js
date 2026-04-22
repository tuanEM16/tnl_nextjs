'use client';

import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import toast from 'react-hot-toast';
import { MdSave, MdBusiness, MdLanguage, MdImage, MdShare, MdMap,MdCloudUpload } from 'react-icons/md';

export default function ConfigPage() {
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({ logo: null, favicon: null });
    const [previews, setPreviews] = useState({ logo: '', favicon: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);


    const fixedFields = [
        'site_name', 'slogan', 'email', 'phone', 'hotline',
        'address', 'map_embed', 'facebook', 'youtube',
        'meta_title', 'meta_description', 'meta_keywords'
    ];

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await configService.show(); // Gọi hàm show() từ service
                setFormData(res.data || {});


                if (res.data?.logo) {
                    setPreviews(prev => ({ ...prev, logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${res.data.logo}` }));
                }
                if (res.data?.favicon) {
                    setPreviews(prev => ({ ...prev, favicon: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${res.data.favicon}` }));
                }
            } catch (error) {
                toast.error('LỖI TRUY XUẤT THÔNG SỐ HỆ THỐNG');
            } finally {
                setFetching(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles({ ...files, [type]: file });
            setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();


            Object.keys(formData).forEach(key => {

                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });


            if (files.logo) data.append('logo', files.logo);
            if (files.favicon) data.append('favicon', files.favicon);

            await configService.update(data);
            toast.success('HỆ THỐNG ĐÃ ĐƯỢC TÁI CẤU HÌNH THÀNH CÔNG');
        } catch (error) {
            toast.error('CẤU HÌNH THẤT BẠI - KIỂM TRA LẠI SERVER');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 font-black italic animate-pulse uppercase tracking-widest text-center">Reading System Core...</div>;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER */}
            <header className="border-b-4 border-black pb-8 flex justify-between items-end">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic">Global System Variables</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        CẤU HÌNH<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 italic mb-1">Last Updated</p>
                    <p className="font-black text-xs">{new Date().toLocaleDateString('vi-VN')}</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: THÔNG TIN TEXT */}
                <div className="lg:col-span-2 space-y-12">

                    {/* SECTION: THÔNG TIN DOANH NGHIỆP */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-orange-600 pl-4 bg-gray-50 py-3 shadow-sm">
                            <MdBusiness size={24} /> THÔNG TIN THÉP TNL
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Tên hệ thống (Site Name)</label>
                                <input type="text" name="site_name" value={formData.site_name || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Slogan công ty</label>
                                <input type="text" name="slogan" value={formData.slogan || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Số điện thoại</label>
                                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Hotline</label>
                                <input type="text" name="hotline" value={formData.hotline || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Email liên hệ</label>
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] lowercase" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 italic">Địa chỉ trụ sở chính</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                        </div>
                    </section>

                    {/* SECTION: SEO & MAP */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm">
                            <MdLanguage size={24} /> SEO & ĐỊA ĐIỂM
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Meta Title (Tiêu đề SEO)</label>
                                <input type="text" name="meta_title" value={formData.meta_title || ''} onChange={handleChange} className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">Meta Description (Mô tả SEO)</label>
                                <textarea name="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows="3" className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] normal-case" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-1"><MdMap /> Map Embed Code (Iframe)</label>
                                <textarea name="map_embed" value={formData.map_embed || ''} onChange={handleChange} rows="2" className="w-full border-2 border-black p-4 font-mono text-[10px] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] normal-case" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: MEDIA & ACTIONS */}
                <div className="space-y-10">
                    <div className="bg-white border-2 border-black p-8 space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sticky top-10">
                        <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic"><MdImage size={20} /> MEDIA ASSETS</h3>

                        {/* LOGO UPLOAD */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase">Company Logo</label>
                            <div className="relative border-2 border-dashed border-black p-6 text-center cursor-pointer hover:bg-black hover:text-white transition-all group">
                                <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {previews.logo ? (
                                    <img src={previews.logo} className="mx-auto max-h-32 object-contain group-hover:invert transition-all" alt="Logo Preview" />
                                ) : (
                                    <div className="py-4">
                                        <MdCloudUpload size={32} className="mx-auto mb-2" />
                                        <p className="text-[9px] font-black tracking-widest">UPLOAD LOGO</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FAVICON UPLOAD */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase">Browser Favicon</label>
                            <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                                <input type="file" onChange={(e) => handleFileChange(e, 'favicon')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="text-left">
                                    <p className="text-[9px] font-black">CHỌN FILE (ICO/PNG)</p>
                                </div>
                                {previews.favicon && <img src={previews.favicon} className="h-10 w-10 border border-black shadow-sm" />}
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="space-y-4 pt-4 border-t border-black/10">
                            <div className="flex items-center gap-3">
                                <MdShare className="text-gray-400" />
                                <input type="text" name="facebook" placeholder="FACEBOOK URL" value={formData.facebook || ''} onChange={handleChange} className="w-full border-b-2 border-black py-2 font-bold text-[10px] outline-none focus:border-orange-600 lowercase" />
                            </div>
                            <div className="flex items-center gap-3">
                                <MdShare className="text-gray-400" />
                                <input type="text" name="youtube" placeholder="YOUTUBE URL" value={formData.youtube || ''} onChange={handleChange} className="w-full border-b-2 border-black py-2 font-bold text-[10px] outline-none focus:border-orange-600 lowercase" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] active:scale-95"
                        >
                            <MdSave size={24} />
                            {loading ? 'STORING CONFIG...' : 'LƯU HỆ THỐNG →'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}