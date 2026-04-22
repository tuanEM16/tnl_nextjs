'use client';

import { use } from 'react';
import { useUserForm } from '@/hooks/useUsers'; // 🟢 Triệu hồi Hook "não bộ"
import { useRouter } from 'next/navigation';

// TRIỆU HỒI VŨ KHÍ UI NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';

import { MdSave, MdEditNote, MdCloudUpload, MdSync, MdInfo, MdSecurity } from 'react-icons/md';

export default function EditUserPage({ params }) {
    const { id } = use(params); // Next.js 15 Unwrapping
    const router = useRouter();

    // 1. DÙNG HOOK (Tự động fetch dữ liệu cũ và xử lý logic Form)
    const {
        formData,
        preview,
        fetching,
        loading,
        handleChange,
        handleFileChange,
        handleSubmit,
    } = useUserForm(id); // Truyền ID vào là nó tự hiểu chế độ CHỈNH SỬA

    // 2. MÀN HÌNH CHỜ ĐỒNG BỘ
    if (fetching) return (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
            <MdSync size={60} className="animate-spin text-orange-600" />
            <p className="mt-6 font-black uppercase tracking-[0.4em] text-xl">Rebuilding User Buffer...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 font-archivo uppercase animate-in fade-in slide-in-from-top-6 duration-500">
            
            {/* 🔴 HEADER ĐIỀU HƯỚNG */}
            <PageHeader 
                title="HIỆU CHỈNH" 
                subTitle={`Personnel ID: #${id}`} 
                btnText="HUỶ BỎ" 
                btnAction={() => router.back()} 
                isBack={true}
                backHref="/admin/users"
            />

            <form onSubmit={handleSubmit} className="relative">
                {/* 🔴 LỚP NỀN SHADOW ĐẶC TRƯNG */}
                <div className="absolute inset-0 bg-orange-600 translate-x-4 translate-y-4 -z-10 border-4 border-black"></div>

                <div className="bg-white border-[6px] border-black p-12 space-y-12">
                    
                    {/* TIÊU ĐỀ KHỐI */}
                    <div className="border-b-[6px] border-black pb-8 flex items-center gap-6">
                        <div className="bg-black text-white p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]">
                            <MdEditNote size={36} />
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter italic leading-none">
                            TÁI CẤU TRÚC HỒ SƠ<span className="text-orange-600">_</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        
                        {/* 🔵 CỘT TRÁI: NHẬN DIỆN NHÂN SỰ (AVATAR) */}
                        <div className="flex flex-col items-center space-y-6">
                            <span className="text-[10px] font-black tracking-widest text-gray-400 italic">Visual Identity Asset</span>
                            
                            <div className="relative w-56 h-56 border-[8px] border-black bg-gray-50 flex items-center justify-center overflow-hidden group shadow-[12px_12px_0_0_#000]">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Avatar Preview" />
                                ) : (
                                    <MdCloudUpload size={56} className="text-gray-200" />
                                )}
                                
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer">
                                    <MdCloudUpload size={32} className="text-orange-600 mb-2" />
                                    <span className="text-white font-black text-[10px] uppercase tracking-widest">Update Photo</span>
                                </div>
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="p-4 bg-orange-50 border-2 border-black border-dashed flex gap-3 shadow-[4px_4px_0_0_#000]">
                                <MdInfo size={20} className="shrink-0 text-orange-600" />
                                <p className="text-[8px] font-black leading-tight italic">Original data detected. Any new upload will permanently replace the existing avatar asset.</p>
                            </div>
                        </div>

                        {/* 🟠 CỘT PHẢI: FORM DATA ENTRY */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ và tên</label>
                                <input 
                                    name="name"
                                    required 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="border-4 border-black p-5 font-black text-xl focus:bg-black focus:text-white outline-none transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email công ty</label>
                                <input 
                                    name="email"
                                    required 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="border-4 border-black p-5 font-black text-sm focus:bg-black focus:text-white outline-none transition-all" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</label>
                                <input 
                                    name="phone"
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className="border-4 border-black p-5 font-black text-sm focus:bg-black focus:text-white outline-none transition-all" 
                                />
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2 border-4 border-orange-600 p-6 bg-orange-50/50 space-y-4 shadow-[8px_8px_0_0_rgba(234,88,12,0.1)]">
                                <div className="flex items-center gap-2 text-orange-600">
                                    <MdSecurity size={20} />
                                    <label className="text-[11px] font-black uppercase tracking-widest">Bảo mật tài khoản</label>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-gray-500 italic mb-2">NHẬP MẬT MÃ MỚI NẾU MUỐN THAY ĐỔI. ĐỂ TRỐNG ĐỂ GIỮ NGUYÊN CẤU HÌNH CŨ.</p>
                                    <input 
                                        name="password"
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className="w-full border-4 border-orange-600 p-5 font-black text-sm focus:bg-orange-600 focus:text-white outline-none transition-all placeholder:text-orange-200" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phân quyền vận hành</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="border-4 border-black p-5 font-black text-sm bg-white cursor-pointer focus:bg-green-500 focus:text-white outline-none appearance-none transition-colors"
                                >
                                    <option value={1}>DUY TRÌ QUYỀN TRUY CẬP (ACTIVE)</option>
                                    <option value={0}>ĐÌNH CHỈ HOẠT ĐỘNG (LOCKED)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 🔴 ACTION BUTTON */}
                    <div className="pt-10 border-t-[6px] border-black flex gap-6">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 group relative bg-black text-white py-8 font-black text-2xl uppercase tracking-[0.5em] transition-all hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-6"
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                {loading ? 'SYNCHRONIZING...' : 'LƯU THAY ĐỔI'} <MdSave size={32} className="group-hover:rotate-12 transition-transform" />
                            </span>
                            {/* Decorative offset shadow effect */}
                            <div className="absolute inset-0 translate-x-3 translate-y-3 border-4 border-black -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform bg-white"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}