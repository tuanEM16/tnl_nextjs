'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { configService } from '@/services/configService';
import { MdEmail, MdArrowBack, MdShield } from 'react-icons/md';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [language, setLanguage] = useState('vi');
    const [configs, setConfigs] = useState({ site_name: 'TÂN NGỌC LỰC STEEL', logo: '' });

    // 🔥 1. BỘ TỪ ĐIỂN ĐA NGÔN NGỮ
    const trans = {
        vi: {
            title: "KHÔI PHỤC MẬT MÃ",
            subtitle: "Hệ thống sẽ gửi mã xác thực đến Email của bạn",
            email_label: "Địa chỉ Email đăng ký",
            placeholder: "NHẬP EMAIL CỦA BẠN",
            btn_send: "GỬI YÊU CẦU PHỤC HỒI →",
            btn_loading: "ĐANG KIỂM TRA...",
            back: "Quay lại đăng nhập",
            success_msg: "Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư.",
            error_msg: "Email không tồn tại trong hệ thống!"
        },
        en: {
            title: "PASSWORD RECOVERY",
            subtitle: "An authentication code will be sent to your Email",
            email_label: "Registered Email Address",
            placeholder: "ENTER YOUR EMAIL",
            btn_send: "SEND RECOVERY REQUEST →",
            btn_loading: "CHECKING...",
            back: "Back to login",
            success_msg: "Request sent! Please check your inbox.",
            error_msg: "Email not found in our system!"
        }
    };

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const res = await configService.getAll();
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                if (data) setConfigs({ site_name: data.site_name, logo: data.logo });
            } catch (error) { console.warn("Using default configs"); }
        };
        fetchConfigs();
    }, []);

    // app/admin/forgot-password/page.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userService.forgotPassword(email);
            // 🔥 Chỉ khi Backend trả về success: true thì mới set cái này
            setIsSent(true);
            toast.success("Yêu cầu đã được gửi!");
            // Frontend: app/admin/forgot-password/page.js
        } catch (error) {
            // Thêm dòng này để nhìn vào F12 Console biết lỗi gì
            console.log("Error object:", error);

            const msg = error.response?.data?.message || error.message || "Lỗi kết nối Server!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

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
                                {trans[language].title}<span className="text-orange-600">.</span>
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
                                {trans[language].subtitle}
                            </p>
                        </div>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase flex items-center gap-2">
                                    <MdEmail /> {trans[language].email_label}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={trans[language].placeholder}
                                    className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                    required
                                />
                            </div>

                            <button disabled={loading} className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
                                {loading ? trans[language].btn_loading : trans[language].btn_send}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 border-2 border-dashed border-black bg-orange-50 space-y-4">
                            <p className="font-black text-sm uppercase italic">{trans[language].success_msg}</p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-[10px] font-black text-orange-600 underline uppercase"
                            >
                                Thử lại với email khác
                            </button>
                        </div>
                    )}

                    {/* CHÂN TRANG */}
                    <div className="flex flex-col items-center gap-6 pt-4 border-t-2 border-black/5">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
                        >
                            <MdArrowBack size={16} /> {trans[language].back}
                        </Link>

                        {/* Đổi ngôn ngữ */}
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
            </div>
        </div>
    );
}