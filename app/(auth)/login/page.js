'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { configService } from '@/services/configService';
import { MdLock, MdLanguage, MdVpnKey, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import Link from 'next/link';
export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState('vi'); // 🟢 'vi' hoặc 'en'
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [configs, setConfigs] = useState({ site_name: 'TÂN NGỌC LỰC STEEL', logo: '' });

  // 🔥 1. BỘ TỪ ĐIỂN ĐA NGÔN NGỮ
  const trans = {
    vi: {
      gateway: "CỔNG TRUY CẬP BẢO MẬT",
      user_label: "Tên định danh",
      pass_label: "Mật mã truy cập",
      user_placeholder: "NHẬP TÊN ĐĂNG NHẬP",
      pass_placeholder: "NHẬP MẬT KHẨU",
      remember: "Ghi nhớ",
      forgot: "Quên mật khẩu?",
      btn_login: "ĐĂNG NHẬP HỆ THỐNG →",
      btn_loading: "ĐANG XÁC THỰC...",
      footer: "Hệ thống quản trị nội bộ // v2.1.0",
      error: "SAI TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU",
      success: "XÁC THỰC THÀNH CÔNG"
    },
    en: {
      gateway: "SECURE ACCESS GATEWAY",
      user_label: "Identity Name",
      pass_label: "Access Password",
      user_placeholder: "ENTER USERNAME",
      pass_placeholder: "ENTER PASSWORD",
      remember: "Remember me",
      forgot: "Forgot password?",
      btn_login: "SYSTEM LOGIN →",
      btn_loading: "AUTHENTICATING...",
      footer: "Internal Management Terminal // v2.1.0",
      error: "INVALID USERNAME OR PASSWORD",
      success: "AUTHENTICATION SUCCESS"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password, rememberMe);
      toast.success(trans[language].success);
    } catch (error) {
      toast.error(trans[language].error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1F4F] font-archivo p-6 relative overflow-hidden text-black">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_#ea580c] p-10 space-y-8">

          <div className="text-center space-y-4">
            {configs.logo && <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${configs.logo}`} alt="Logo" className="h-16 mx-auto object-contain" />}
            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic uppercase">
                {trans[language].gateway}
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                {configs.site_name}<span className="text-orange-600">.</span>
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 italic uppercase flex items-center gap-2">
                <MdPerson /> {trans[language].user_label}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={trans[language].user_placeholder}
                className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 italic uppercase flex items-center gap-2">
                <MdVpnKey /> {trans[language].pass_label}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={trans[language].pass_placeholder}
                className="w-full border-2 border-black p-4 font-black text-sm outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 border-2 border-black transition-colors ${rememberMe ? 'bg-black text-white flex items-center justify-center' : 'bg-white'}`}>
                  {rememberMe && "✓"}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-orange-600">
                  {trans[language].remember}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors border-b border-transparent hover:border-orange-600"
              >
                {trans[language].forgot}
              </Link>
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
              {loading ? trans[language].btn_loading : trans[language].btn_login}
            </button>
          </form>

          <div className="pt-6 border-t-2 border-black/5 flex justify-center items-center gap-4">
            <MdLanguage className="text-gray-400" />
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

        <p className="mt-8 text-center text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">
          {trans[language].footer}
        </p>
      </div>
    </div>
  );
}