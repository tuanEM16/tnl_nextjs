'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { MdLockOpen } from 'react-icons/md';
import toast from 'react-hot-toast';

// 🟢 Component chứa cái Form và logic xử lý
function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token'); 
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("MẬT KHẨU NHẬP LẠI KHÔNG KHỚP!");
        }
        if (!token) return toast.error("MÃ XÁC THỰC KHÔNG HỢP LỆ!");

        setLoading(true);
        try {
            await userService.resetPassword(token, password);
            toast.success("ĐỔI MẬT KHẨU THÀNH CÔNG!");
            setTimeout(() => router.push('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "LỖI XÁC THỰC!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_#ea580c] p-10 space-y-8 w-full max-w-md">
            <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-black text-white shadow-[4px_4px_0px_0px_#ea580c]">
                    <MdLockOpen size={40} className="text-orange-600" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none text-black">
                    MẬT KHẨU MỚI<span className="text-orange-600">.</span>
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 italic uppercase">NHẬP MẬT KHẨU MỚI</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all text-black"
                        required
                        autoFocus
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 italic uppercase">XÁC NHẬN MẬT KHẨU</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all text-black"
                        required
                    />
                </div>

                <button disabled={loading} className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
                    {loading ? 'PROCESSING...' : 'CẬP NHẬT MẬT MÃ →'}
                </button>
            </form>
        </div>
    );
}

// 🔵 Component chính để Next.js render trang
export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1F4F] font-archivo p-6 relative overflow-hidden">
            {/* Lớp nền Pattern - Đã có pointer-events-none để không cản trở click */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            ></div>

            {/* Chỉ gọi duy nhất 1 lần ResetPasswordForm ở đây */}
            <Suspense fallback={<div className="text-white font-black italic">LOADING SECURITY MODULE...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}