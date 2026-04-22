'use client';

import Link from 'next/link';
import { MdEmail, MdArrowBack, MdShield } from 'react-icons/md';
import { useForgotPassword } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
    // 🟢 Triệu hồi Hook "Quên mật khẩu" - Có đầy đủ cả t (translations) và configs
    const {
        email, 
        setEmail,
        isSent, 
        setIsSent,
        loading,
        language, 
        setLanguage,
        t,        // Từ điển đã được Hook xử lý theo ngôn ngữ
        configs,  // Thông tin site_name, logo từ DB
        handleSubmit
    } = useForgotPassword();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1F4F] font-archivo p-6 relative overflow-hidden text-black">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_#ea580c] p-10 space-y-8">

                    {/* HEADER */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 bg-black text-white mb-2 shadow-[4px_4px_0px_0px_#ea580c]">
                            <MdShield size={40} className="text-orange-600 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                                {t.forgot_title}<span className="text-orange-600">.</span>
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
                                {t.forgot_subtitle}
                            </p>
                        </div>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase flex items-center gap-2">
                                    <MdEmail /> {t.email_label}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.email_placeholder}
                                    className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading} 
                                className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                            >
                                {loading ? t.btn_sending : t.btn_send}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 border-2 border-dashed border-black bg-orange-50 space-y-4">
                            <p className="font-black text-sm uppercase italic">{t.forgot_success}</p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-[10px] font-black text-orange-600 underline uppercase"
                            >
                                {language === 'vi' ? 'Thử lại với email khác' : 'Try with another email'}
                            </button>
                        </div>
                    )}

                    {/* CHÂN TRANG */}
                    <div className="flex flex-col items-center gap-6 pt-4 border-t-2 border-black/5">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
                        >
                            <MdArrowBack size={16} /> {t.back}
                        </Link>

                        {/* Bộ chọn ngôn ngữ */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:text-orange-600"
                        >
                            <option value="vi">Tiếng Việt (VN)</option>
                            <option value="en">English (US)</option>
                        </select>
                    </div>
                </div>

                {/* 🏷️ Site Name từ Configs */}
                <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">
                        {configs.site_name} // v2.1.0
                    </p>
                </div>
            </div>
        </div>
    );
}