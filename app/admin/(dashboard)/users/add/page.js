'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { MdArrowBack, MdCloudUpload, MdSave, MdPersonAdd } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function AddUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        phone: '',
        status: 1,
        roles: 'admin'
    });
    
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Xử lý chọn ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Gửi dữ liệu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            await userService.store(data);
            toast.success("ĐÃ CẤP QUYỀN TRUY CẬP CHO NHÂN SỰ MỚI!");
            router.push('/admin/users');
        } catch (error) {
            toast.error(error.response?.data?.message || "LỖI HỆ THỐNG!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Nút quay lại */}
            <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-colors"
            >
                <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" /> 
                TRỞ LẠI DANH SÁCH
            </button>

            <form onSubmit={handleSubmit} className="relative">
                {/* Khung Form Chính */}
                <div className="bg-white border-[6px] border-black p-10 shadow-[20px_20px_0_0_#000] space-y-10">
                    
                    {/* Title */}
                    <div className="border-b-4 border-black pb-6 flex items-center gap-4">
                        <div className="bg-orange-600 text-white p-3 shadow-[4px_4px_0_0_#000]">
                            <MdPersonAdd size={32} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                            THIẾT LẬP NHÂN SỰ<span className="text-orange-600">_</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* CỘT TRÁI: AVATAR */}
                        <div className="flex flex-col items-center space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ảnh định danh</label>
                            <div className="relative w-48 h-48 border-8 border-black bg-gray-100 group overflow-hidden">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 text-center">
                                        <MdCloudUpload size={48} />
                                        <span className="text-[8px] font-black uppercase mt-2">Kéo thả hoặc click để tải lên</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                />
                                <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/20 transition-all pointer-events-none"></div>
                            </div>
                            <p className="text-[9px] font-bold text-center text-gray-500 italic uppercase">Định dạng hỗ trợ: JPG, PNG, WEBP</p>
                        </div>

                        {/* CỘT PHẢI: INPUTS */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Họ và tên', name: 'name', type: 'text', placeholder: 'NGUYỄN VĂN A' },
                                { label: 'Địa chỉ Email', name: 'email', type: 'email', placeholder: 'EMAIL@TANNGOCLUC.COM' },
                                { label: 'Tên đăng nhập', name: 'username', type: 'text', placeholder: 'ADMIN_01' },
                                { label: 'Mật mã truy cập', name: 'password', type: 'password', placeholder: '********' },
                                { label: 'Số điện thoại', name: 'phone', type: 'text', placeholder: '090xxxxxxx' },
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">{field.label}</label>
                                    <input 
                                        required 
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="border-4 border-black p-4 font-bold text-sm outline-none focus:bg-black focus:text-white placeholder:text-gray-200 transition-all"
                                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em]">Trạng thái kích hoạt</label>
                                <select 
                                    className="border-4 border-black p-4 font-bold text-sm outline-none appearance-none bg-white focus:bg-black focus:text-white transition-all cursor-pointer"
                                    onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                                >
                                    <option value={1}>CHO PHÉP HOẠT ĐỘNG</option>
                                    <option value={0}>TẠM KHÓA TRUY CẬP</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Nút Submit */}
                    <div className="pt-6 border-t-4 border-black">
                        <button 
                            disabled={loading}
                            type="submit"
                            className="group relative w-full bg-black text-white py-6 font-black text-xl uppercase tracking-[0.5em] transition-all hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="animate-pulse">ĐANG KHỞI TẠO...</span>
                            ) : (
                                <span className="flex items-center justify-center gap-4">
                                    XÁC NHẬN LƯU HỒ SƠ <MdSave size={28} />
                                </span>
                            )}
                            <div className="absolute inset-0 translate-x-2 translate-y-2 border-4 border-black -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}