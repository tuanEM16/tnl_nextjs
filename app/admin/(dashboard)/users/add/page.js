'use client';

import { useUserForm } from '@/hooks/useUsers'; // 🟢 Triệu hồi Hook "não bộ"
import { MdArrowBack, MdCloudUpload, MdSave, MdPersonAdd, MdInfo } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function AddUserPage() {
    const router = useRouter();

    // 1. DÙNG HOOK (Dọn sạch 4-5 cái useState cũ)
    const {
        formData,
        preview,
        loading,
        handleChange,
        handleFileChange,
        handleSubmit,
    } = useUserForm(); // Không truyền ID = Chế độ THÊM MỚI

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 font-archivo uppercase animate-in fade-in slide-in-from-bottom-6 duration-500">
            
            {/* 🔴 NÚT BACK - SỬA LẠI CHO ĐÚNG STYLE HỆ THỐNG */}
            <button 
                onClick={() => router.back()}
                className="group flex items-center gap-3 font-black text-xs tracking-[0.3em] hover:text-orange-600 transition-all"
            >
                <MdArrowBack size={24} className="group-hover:-translate-x-2 transition-transform" /> 
                TRỞ LẠI HỆ THỐNG
            </button>

            <form onSubmit={handleSubmit} className="relative">
                {/* 🔴 KHUNG FORM CHÍNH - NICKELBRONX HEAVY STYLE */}
                <div className="bg-white border-[6px] border-black p-12 shadow-[24px_24px_0_0_#000] space-y-12">
                    
                    {/* TITLE BLOCK */}
                    <div className="border-b-[6px] border-black pb-8 flex items-center gap-6">
                        <div className="bg-black text-white p-4 shadow-[6px_6px_0_0_#ea580c]">
                            <MdPersonAdd size={36} />
                        </div>
                        <div>
                            <h2 className="text-5xl font-black tracking-tighter italic leading-none">
                                CẤP QUYỀN TRUY CẬP<span className="text-orange-600">_</span>
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 mt-2 tracking-[0.4em]">Initialize Security Credentials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* 🔵 CỘT TRÁI: IDENTITY ASSET (AVATAR) */}
                        <div className="flex flex-col items-center space-y-6">
                            <span className="text-[10px] font-black tracking-widest text-black border-b-2 border-black">Employee Visual ID</span>
                            <div className="relative w-56 h-56 border-[8px] border-black bg-gray-100 group overflow-hidden shadow-[10px_10px_0_0_rgba(0,0,0,0.1)]">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Avatar Preview" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-6 text-center">
                                        <MdCloudUpload size={56} />
                                        <span className="text-[9px] font-black uppercase mt-4 leading-tight">Drop Portrait Here <br/> or Click to Browse</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    onChange={handleFileChange}
                                />
                                <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-all pointer-events-none"></div>
                            </div>
                            <div className="bg-yellow-100 border-2 border-black p-4 flex gap-3 items-start">
                                <MdInfo size={20} className="shrink-0" />
                                <p className="text-[8px] font-black leading-tight italic">HÌNH ẢNH NÊN LÀ ẢNH CHÂN DUNG RÕ MẶT ĐỂ ĐỊNH DANH NHÂN VIÊN TRÊN HỆ THỐNG.</p>
                            </div>
                        </div>

                        {/* 🟠 CỘT PHẢI: DATA ENTRY */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Họ và tên nhân sự', name: 'name', type: 'text', placeholder: 'FULL NAME' },
                                { label: 'Email công việc', name: 'email', type: 'email', placeholder: 'EMAIL@TNL.COM' },
                                { label: 'Tên đăng nhập', name: 'username', type: 'text', placeholder: 'USERNAME_ID' },
                                { label: 'Mật mã bảo mật', name: 'password', type: 'password', placeholder: '••••••••' },
                                { label: 'Số điện thoại', name: 'phone', type: 'text', placeholder: 'PHONE_NUMBER' },
                            ].map((field) => (
                                <div key={field.name} className={`flex flex-col gap-2 ${field.name === 'name' ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{field.label}</label>
                                    <input 
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name]}
                                        placeholder={field.placeholder}
                                        className="border-4 border-black p-5 font-black text-sm outline-none focus:bg-black focus:text-white placeholder:text-gray-200 transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]"
                                        onChange={handleChange}
                                        required={field.name !== 'phone'}
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Vai trò hệ thống</label>
                                <select 
                                    name="roles"
                                    value={formData.roles}
                                    className="border-4 border-black p-5 font-black text-sm outline-none bg-white focus:bg-orange-50 cursor-pointer appearance-none"
                                    onChange={handleChange}
                                >
                                    <option value="admin">ADMINISTRATOR</option>
                                    <option value="staff">OPERATIONAL STAFF</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Trạng thái kích hoạt</label>
                                <select 
                                    name="status"
                                    value={formData.status}
                                    className="border-4 border-black p-5 font-black text-sm outline-none bg-orange-50 focus:bg-green-500 focus:text-white cursor-pointer appearance-none transition-colors"
                                    onChange={handleChange}
                                >
                                    <option value={1}>ACTIVE / AUTHORIZED</option>
                                    <option value={0}>DISABLED / LOCKED</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 🔴 ACTION BUTTON */}
                    <div className="pt-10 border-t-[6px] border-black">
                        <button 
                            disabled={loading}
                            type="submit"
                            className="group relative w-full bg-black text-white py-8 font-black text-2xl uppercase tracking-[0.4em] transition-all hover:bg-orange-600 disabled:opacity-50 disabled:grayscale"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-6">
                                {loading ? 'SYNCHRONIZING...' : 'KÍCH HOẠT NHÂN SỰ'} <MdSave size={32} />
                            </span>
                            {/* Decorative offset shadow */}
                            <div className="absolute inset-0 translate-x-3 translate-y-3 border-4 border-black -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform bg-white"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}