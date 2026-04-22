'use client';

import { useLogin } from '@/hooks/useAuth'; // 🟢 Triệu hồi Hook tổng hợp
import { getImageUrl } from '@/lib/utils';
import { MdVpnKey, MdPerson, MdLanguage, MdSecurity } from 'react-icons/md';
import Link from 'next/link';

export default function AdminLoginPage() {
  // 🔴 BỐC TOÀN BỘ NỘI CÔNG TỪ HOOK
  const {
    username, setUsername,
    password, setPassword,
    rememberMe, setRememberMe,
    loading,
    language, setLanguage,
    t,
    configs,
    handleSubmit
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-archivo p-4 relative overflow-hidden text-black uppercase">
      {/* INDUSTRIAL GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>

      {/* 🟢 KHUNG LOGIN COMPACT (400px) */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_#ea580c] p-8 space-y-8 animate-in zoom-in-95 duration-500">

          {/* LOGO & BRANDING */}
          <div className="text-center space-y-4">
            {configs.logo ? (
              <img src={getImageUrl(configs.logo)} alt="Logo" className="h-12 mx-auto object-contain" />
            ) : (
              <MdSecurity size={40} className="mx-auto text-orange-600" />
            )}
            <div className="space-y-1">
              <p className="text-[9px] font-black tracking-[0.4em] text-gray-400 italic lowercase">
                                // {t.gateway} //
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight border-b-2 border-black pb-2">
                {configs.site_name}<span className="text-orange-600">.</span>
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* IDENTITY INPUT */}
              <div className="relative group">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.user_placeholder}
                  className="w-full border-2 border-black p-3.5 pl-10 font-black text-sm outline-none focus:bg-orange-50 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
                  required
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[8px] font-black border border-black">{t.user_label}</label>
              </div>

              {/* AUTH KEY INPUT */}
              <div className="relative group">
                <MdVpnKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.pass_placeholder}
                  className="w-full border-2 border-black p-3.5 pl-10 font-black text-sm outline-none focus:bg-black focus:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]"
                  required
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[8px] font-black border border-black">{t.pass_label}</label>
              </div>
            </div>

            {/* SESSION OPTIONS */}
            <div className="flex items-center justify-between font-black text-[9px] tracking-widest">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 border-2 border-black transition-all ${rememberMe ? 'bg-orange-600' : 'bg-white'}`}>
                  {rememberMe && <span className="text-white flex items-center justify-center text-[10px]">✓</span>}
                </div>
                <span className="group-hover:text-orange-600 transition-colors uppercase">{t.remember}</span>
              </label>

              {/* 🟢 2. Sửa link: Bỏ chữ /admin/ vì nó nằm trong group (auth) */}
              <Link href="/forgot-password" title={t.forgot} className="text-gray-400 hover:text-black underline underline-offset-4 decoration-1">
                {t.forgot}
              </Link>
            </div>
            {/* ACCESS BUTTON */}
            <button
              disabled={loading}
              className="group relative w-full bg-black text-white py-4 font-black text-sm uppercase tracking-[0.3em] transition-all hover:bg-orange-600 active:translate-x-1 active:translate-y-1 shadow-[6px_6px_0_0_#ea580c] disabled:opacity-50"
            >
              {loading ? t.btn_loading : t.btn_login}
            </button>
          </form>

          {/* REGIONAL SETTINGS */}
          <div className="pt-6 border-t-2 border-black/5 flex justify-center items-center gap-3">
            <MdLanguage size={18} className="text-orange-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-[9px] font-black uppercase outline-none cursor-pointer hover:text-orange-600"
            >
              <option value="vi">VIETNAMESE (VN)</option>
              <option value="en">ENGLISH (US)</option>
            </select>
          </div>
        </div>

        <p className="mt-8 text-center text-[8px] font-black text-white/20 tracking-[0.4em] uppercase italic leading-loose">
          {t.footer}
        </p>
      </div>
    </div>
  );
}