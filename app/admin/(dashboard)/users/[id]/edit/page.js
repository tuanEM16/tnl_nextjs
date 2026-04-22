'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { MdArrowBack, MdSave, MdEditNote, MdCloudUpload, MdSync } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function EditUserPage({ params }) {
    const { id } = use(params); // Unwrapping params cho Next.js 15
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '', // Để trống nếu không muốn đổi
        phone: '',
        status: 1
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // 1. LẤY DỮ LIỆU CŨ ĐỔ VÀO FORM
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userService.show(id);
                if (res.success) {
                    const u = res.data;
                    setFormData({
                        name: u.name || '',
                        email: u.email || '',
                        username: u.username || '',
                        password: '', // Luôn để trống lúc đầu
                        phone: u.phone || '',
                        status: u.status
                    });
                    if (u.avatar) {
                        setPreview(`http://localhost:5000/uploads/${u.avatar}`);
                    }
                }
            } catch (error) {
                toast.error("KHÔNG TÌM THẤY DỮ LIỆU NHÂN SỰ!");
                router.push('/admin/users');
            } finally {
                setFetching(false);
            }
        };
        fetchUser();
    }, [id, router]);

    // 2. XỬ LÝ CHỌN ẢNH MỚI
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 3. GỬI CẬP NHẬT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            // 🟢 THÊM DÒNG NÀY: Nếu là password mà bị rỗng thì bỏ qua, không append vào FormData
            if (key === 'password' && !formData[key]) return;

            data.append(key, formData[key]);
        });

        if (avatarFile) data.append('avatar', avatarFile);

        try {
            await userService.update(id, data);
            toast.success("CẬP NHẬT NGON LÀNH!");
            router.push('/admin/users');
        } catch (error) {
            toast.error("LỖI RỒI!");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex flex-col items-center justify-center h-[50vh] animate-pulse">
            <MdSync size={50} className="animate-spin text-orange-600" />
            <p className="mt-4 font-black uppercase tracking-widest">ĐANG ĐỒNG BỘ DỮ LIỆU...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Header điều hướng */}
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-all"
            >
                <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
                HUỶ BỎ & QUAY LẠI
            </button>

            <form onSubmit={handleSubmit} className="relative">
                {/* Lớp nền shadow của "Thép" */}
                <div className="absolute inset-0 bg-orange-600 translate-x-4 translate-y-4 -z-10 border-4 border-black"></div>

                <div className="bg-white border-[6px] border-black p-10 space-y-10">

                    {/* Tiêu đề trang */}
                    <div className="border-b-4 border-black pb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-black text-white p-3">
                                <MdEditNote size={32} />
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                                HIỆU CHỈNH HỒ SƠ<span className="text-orange-600">_</span>
                            </h2>
                        </div>
                        <span className="text-[10px] font-black bg-gray-100 px-3 py-1 border-2 border-black uppercase">
                            ID: {id}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* CỘT TRÁI: AVATAR UPDATE */}
                        <div className="flex flex-col items-center space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Nhận diện mới</label>
                            <div className="relative w-48 h-48 border-8 border-black bg-gray-50 flex items-center justify-center overflow-hidden group shadow-[8px_8px_0_0_#000]">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <MdCloudUpload size={48} className="text-gray-200" />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                    <span className="text-white font-black text-[10px] uppercase tracking-widest">Thay đổi ảnh</span>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* CỘT PHẢI: FORM FIELDS */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase">Họ và tên</label>
                                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-4 border-black p-4 font-bold text-sm focus:bg-black focus:text-white outline-none transition-all" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase">Email liên hệ</label>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border-4 border-black p-4 font-bold text-sm focus:bg-black focus:text-white outline-none transition-all" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-orange-600">Mật mã mới (Để trống nếu giữ cũ)</label>
                                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="border-4 border-orange-600 p-4 font-bold text-sm focus:bg-orange-600 focus:text-white outline-none transition-all" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase">Số điện thoại</label>
                                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-4 border-black p-4 font-bold text-sm focus:bg-black focus:text-white outline-none transition-all" />
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase">Phân quyền trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                    className="border-4 border-black p-4 font-black text-sm bg-white cursor-pointer focus:bg-black focus:text-white outline-none appearance-none"
                                >
                                    <option value={1}>DUY TRÌ HOẠT ĐỘNG (ACTIVE)</option>
                                    <option value={0}>ĐÌNH CHỈ TRUY CẬP (LOCKED)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t-4 border-black flex gap-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 bg-black text-white py-6 font-black text-xl uppercase tracking-[0.4em] hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                        >
                            {loading ? 'ĐANG LƯU...' : 'CẬP NHẬT HỆ THỐNG'} <MdSave size={28} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}