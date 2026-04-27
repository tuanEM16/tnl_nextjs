'use client';

import { useConfig } from '@/hooks/useConfig'; 
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdSave, MdBusiness, MdLanguage, MdImage, MdShare, MdMap, MdCloudUpload, MdInfo, MdPlayCircle } from 'react-icons/md';
import { getImageUrl } from '@/lib/utils';

export default function ConfigPage() {
    const {
        formData, previews, fetching, loading,
        handleChange, handleFileChange, handleSubmit
    } = useConfig();

    if (fetching) return (
        <div className="p-32 text-center font-black italic animate-pulse uppercase tracking-[0.4em]">
            READING SYSTEM CORE VARIABLES...
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            <PageHeader 
                title="CẤU HÌNH" 
                subTitle="Global System Control Unit" 
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* 🔵 CỘT TRÁI: DATA ENTRY (2/3) */}
                <div className="lg:col-span-2 space-y-12">
                    {/* SECTION: THÔNG TIN DOANH NGHIỆP */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-10">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdBusiness size={32} className="text-orange-600" /> CORPORATE IDENTITY
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">SITE NAME</label>
                                <input type="text" name="site_name" value={formData.site_name || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-orange-50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">SLOGAN</label>
                                <input type="text" name="slogan" value={formData.slogan || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-orange-50 transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t-2 border-black border-dashed">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">OFFICE PHONE</label>
                                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">HOTLINE 24/7</label>
                                <input type="text" name="hotline" value={formData.hotline || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black outline-none focus:bg-black focus:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">BUSINESS EMAIL</label>
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black outline-none focus:bg-black focus:text-white transition-all lowercase" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic">HEADQUARTERS ADDRESS</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black outline-none focus:bg-orange-50 transition-all" />
                        </div>
                    </section>

                    {/* SECTION: SEO & GEO-LOCATION */}
                    <section className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-10">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdLanguage size={32} className="text-orange-600" /> SEO & GLOBAL REACH
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">META TITLE (SEO OPTIMIZATION)</label>
                                <input type="text" name="meta_title" value={formData.meta_title || ''} onChange={handleChange} className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-orange-50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic">META DESCRIPTION</label>
                                <textarea name="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows="3" className="w-full border-4 border-black p-4 font-bold outline-none normal-case leading-tight focus:bg-orange-50" />
                            </div>
                            <div className="space-y-2 bg-gray-50 p-6 border-4 border-black">
                                <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2 mb-2">
                                    <MdMap size={18} className="text-black"/> GOOGLE MAPS EMBED CODE (IFRAME)
                                </label>
                                <textarea name="map_embed" value={formData.map_embed || ''} onChange={handleChange} rows="2" className="w-full border-2 border-black p-4 font-mono text-[10px] outline-none bg-white normal-case" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: ASSETS & DEPLOYMENT (1/3) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-8">
                        
                        <div className="bg-white border-[6px] border-black p-8 space-y-8 shadow-[12px_12px_0_0_#ea580c]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-4 border-black pb-4 italic">
                                <MdImage size={24} /> VISUAL ASSETS
                            </h3>

                            {/* LOGO */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase">Master Logo</label>
                                <div className="relative border-4 border-dashed border-black group bg-gray-50 overflow-hidden">
                                    <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {previews.logo ? (
                                        <div className="p-6">
                                            <img src={previews.logo} className="mx-auto max-h-32 object-contain group-hover:scale-110 transition-all" alt="Logo" />
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center">
                                            <MdCloudUpload size={40} className="mx-auto text-gray-300" />
                                            <p className="text-[9px] font-black tracking-widest text-gray-400 mt-2">UPLOAD LOGO</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 🟢 VIDEO INTRO (HÀNG MỚI) */}
                            <div className="space-y-4 pt-4 border-t-4 border-black border-dotted">
                                <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase italic">Hero Video / Intro</label>
                                <div className="relative border-4 border-black bg-black group overflow-hidden aspect-video">
                                    <input 
                                        type="file" 
                                        accept="video/*" 
                                        onChange={(e) => handleFileChange(e, 'intro_video')} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                    />
                                    
                                    {/* Ưu tiên hiện video preview mới chọn, nếu không thì bốc hàng cũ từ DB */}
                                    {(previews.intro_video || formData.intro_video) ? (
                                        <video 
                                            key={previews.intro_video || formData.intro_video}
                                            src={previews.intro_video || getImageUrl(formData.intro_video)} 
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            autoPlay muted loop 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                                            <MdPlayCircle size={40} className="text-zinc-700" />
                                            <p className="text-[9px] font-black text-zinc-500 tracking-widest">SELECT MP4 VIDEO</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <p className="text-white font-black text-[10px] tracking-widest border-2 border-white p-2 bg-black/40">CHANGE VIDEO</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAVICON */}
                            <div className="space-y-4 pt-4 border-t-4 border-black border-dotted">
                                <label className="text-[10px] font-black text-gray-400 block tracking-widest uppercase">System Favicon</label>
                                <div className="relative border-4 border-black p-4 bg-orange-50 flex items-center justify-between group">
                                    <input type="file" onChange={(e) => handleFileChange(e, 'favicon')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-3">
                                        {previews.favicon && <img src={previews.favicon} className="h-10 w-10 border-2 border-black bg-white" alt="Favicon" />}
                                        <p className="text-[9px] font-black tracking-tighter">SELECT .ICO / .PNG</p>
                                    </div>
                                    <MdCloudUpload size={20} className="group-hover:text-orange-600 transition-colors" />
                                </div>
                            </div>

                            {/* SAVE BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-8 text-sm font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <MdSave size={28} />
                                    {loading ? 'SYNCHRONIZING...' : 'COMMIT CHANGES →'}
                                </div>
                            </button>
                        </div>

                        {/* WARNING BOX */}
                        <div className="p-6 border-4 border-black border-dashed bg-yellow-50 flex gap-4 shadow-[8px_8px_0_0_#000]">
                            <MdInfo size={32} className="shrink-0 text-black" />
                            <p className="text-[9px] font-black leading-relaxed italic">
                                THẬN TRỌNG: MỌI THAY ĐỔI TRÊN TRANG NÀY SẼ TÁC ĐỘNG TRỰC TIẾP ĐẾN TOÀN BỘ WEBSITE VÀ CHỈ SỐ SEO TRÊN GOOGLE SEARCH CONSOLE.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}