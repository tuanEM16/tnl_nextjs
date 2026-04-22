'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MdLockOpen } from 'react-icons/md';
import { useResetPassword } from '@/hooks/useAuth'; // 🟢 Dùng bộ Hook đại ca đã viết

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); 
    
    // 🟢 Triệu hồi sức mạnh từ Hook: Đầy đủ logic, ngôn ngữ và config
    const {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading,
        t,        // Dùng từ điển đa ngôn ngữ từ Hook
        configs,  // Dùng site_name từ Hook
        handleSubmit
    } = useResetPassword(token);

    return (
        <div className="relative z-10 bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_#ea580c] p-10 space-y-8 w-full max-w-md">
            {/* HEADER */}
            <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-black text-white shadow-[4px_4px_0px_0px_#ea580c]">
                    <MdLockOpen size={40} className="text-orange-600" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none text-black">
                        {t.reset_title}<span className="text-orange-600">.</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {t.reset_subtitle}
                    </p>
                </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 italic uppercase">
                        {t.new_pass}
                    </label>
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
                    <label className="text-[10px] font-black text-gray-400 italic uppercase">
                        {t.confirm_pass}
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all text-black"
                        required
                    />
                </div>

                <button 
                    disabled={loading} 
                    className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                >
                    {loading ? 'PROCESSING...' : t.btn_reset}
                </button>
            </form>

            {/* BRANDING */}
            <div className="pt-4 border-t-2 border-black/5 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {configs.site_name} // SECURITY MODULE
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1F4F] font-archivo p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            ></div>

            {/* Suspense là bắt buộc khi dùng useSearchParams trong Client Component của Next.js */}
            <Suspense fallback={<div className="text-white font-black italic animate-pulse">INITIALIZING SECURITY INTERFACE...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}