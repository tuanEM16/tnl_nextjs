'use client';

import { useConfig } from '@/hooks/useConfig';
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdSave, MdBusiness, MdLanguage, MdImage, MdMap, MdCloudUpload, MdInfo, MdPlayCircle } from 'react-icons/md';
import { getImageUrl } from '@/lib/utils';
import { MdFacebook } from 'react-icons/md';
import { FaYoutube } from 'react-icons/fa';
export default function ConfigPage() {
    const {
        formData, previews, fetching, loading,
        handleChange, handleFileChange, handleSubmit
    } = useConfig();

    if (fetching) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0e2188] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Đang tải cấu hình hệ thống...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-12 font-sans">
            <PageHeader
                title="Cấu hình hệ thống"
                subTitle="Quản lý thông tin doanh nghiệp, liên hệ và SEO toàn cục"
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🔵 CỘT TRÁI: DATA ENTRY (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* SECTION: THÔNG TIN DOANH NGHIỆP */}
                    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-blue-50 text-[#0e2188] rounded-lg">
                                <MdBusiness size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Thông tin Doanh nghiệp
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Tên doanh nghiệp / Website</label>
                                <input
                                    type="text"
                                    name="site_name"
                                    value={formData.site_name || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Slogan</label>
                                <input
                                    type="text"
                                    name="slogan"
                                    value={formData.slogan || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Điện thoại VP</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Hotline 24/7</label>
                                <input
                                    type="text"
                                    name="hotline"
                                    value={formData.hotline || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Email liên hệ</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 mt-6">
                            <label className="block text-sm font-medium text-gray-700">Địa chỉ trụ sở</label>
                            {/* Thêm sau phần địa chỉ trụ sở */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.facebook || ''}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Youtube</label>
                                    <input
                                        type="url"
                                        name="youtube"
                                        value={formData.youtube || ''}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                            />
                        </div>
                    </section>

                    {/* SECTION: SEO & GEO-LOCATION */}
                    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <MdLanguage size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">
                                SEO & Bản đồ
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Tiêu đề trang (Meta Title)</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Mô tả trang (Meta Description)</label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description || ''}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all outline-none resize-none leading-relaxed"
                                />
                            </div>
                            <div className="space-y-1.5 bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MdMap size={18} className="text-gray-500" /> Mã nhúng Google Maps (Iframe)
                                </label>
                                <textarea
                                    name="map_embed"
                                    value={formData.map_embed || ''}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full border border-gray-300 rounded-lg p-3 font-mono text-xs text-gray-600 outline-none bg-white focus:border-[#0e2188] transition-colors resize-none"
                                    placeholder='<iframe src="..."></iframe>'
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* 🟠 CỘT PHẢI: ASSETS & DEPLOYMENT (1/3) */}
                <div className="relative">
                    <div className="sticky top-8 space-y-6">

                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <MdImage size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Tài nguyên hiển thị</h3>
                            </div>

                            {/* LOGO */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Logo chính (Master Logo)</label>
                                <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group overflow-hidden">
                                    <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                                    {previews.logo ? (
                                        <div className="p-6 flex items-center justify-center bg-white m-1 rounded-lg">
                                            <img src={previews.logo} className="max-h-24 object-contain group-hover:scale-105 transition-transform" alt="Logo" />
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                                            <MdCloudUpload size={32} className="mb-2 text-gray-400" />
                                            <p className="text-xs font-medium">Kéo thả hoặc click để tải lên</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* VIDEO INTRO */}
                            <div className="space-y-2 pt-4">
                                <label className="block text-sm font-medium text-gray-700">Video giới thiệu (Hero Video)</label>
                                <div className="relative border border-gray-200 rounded-xl bg-gray-100 group overflow-hidden aspect-video">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, 'intro_video')}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />

                                    {(previews.intro_video || formData.intro_video) ? (
                                        <video
                                            key={previews.intro_video || formData.intro_video}
                                            src={previews.intro_video || getImageUrl(formData.intro_video)}
                                            className="w-full h-full object-cover"
                                            autoPlay muted loop playsInline
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                            <MdPlayCircle size={36} className="mb-2 text-gray-400" />
                                            <p className="text-xs font-medium">Chọn video MP4</p>
                                        </div>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Thay đổi Video</span>
                                    </div>
                                </div>
                            </div>

                            {/* FAVICON */}
                            <div className="space-y-2 pt-4">
                                <label className="block text-sm font-medium text-gray-700">Favicon (.ico / .png)</label>
                                <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-between group hover:bg-gray-100 transition-colors">
                                    <input type="file" onChange={(e) => handleFileChange(e, 'favicon')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/x-icon,image/png" />
                                    <div className="flex items-center gap-3">
                                        {previews.favicon ? (
                                            <div className="w-10 h-10 rounded bg-white shadow-sm flex items-center justify-center p-1 border border-gray-100">
                                                <img src={previews.favicon} className="max-w-full max-h-full" alt="Favicon" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                                <MdImage size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium text-gray-600">Tải lên Favicon</p>
                                    </div>
                                    <MdCloudUpload size={20} className="text-gray-400 group-hover:text-[#0e2188] transition-colors" />
                                </div>
                            </div>

                            {/* SAVE BUTTON */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#0e2188] hover:bg-blue-800 text-white py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            <span>Lưu cấu hình</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* WARNING BOX */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 shadow-sm">
                            <MdInfo size={24} className="shrink-0 text-amber-600" />
                            <p className="text-xs text-amber-800 leading-relaxed font-medium mt-0.5">
                                <strong>Lưu ý:</strong> Mọi thay đổi ở đây sẽ cập nhật ngay lập tức trên website và có thể ảnh hưởng đến kết quả tìm kiếm (SEO) trên Google. Hãy kiểm tra kỹ trước khi lưu.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}