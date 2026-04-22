'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MdLogout } from 'react-icons/md';

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header 
      className="h-20 border-b border-white/10 flex items-center justify-between px-8"
      style={{
        background: 'linear-gradient(90deg, #8C001A 0%, #0B1F4F 35%, #5B1F5A 65%, #8C001A 100%)'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 flex items-center justify-center shadow-lg">
          <span className="text-[#0A1E2F] font-black text-lg uppercase">
            {user?.name?.charAt(0) || 'S'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-[0.25em] text-white/60 uppercase">
            Active Session
          </span>
          <span className="text-sm font-black uppercase tracking-tight text-white">
            {user?.name || 'ADMIN'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:block text-right border-r border-white/20 pr-8">
          <span className="text-[9px] font-bold tracking-[0.25em] text-white/60 uppercase block">
            Clearance
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            {user?.roles || 'ADMIN'}
          </span>
        </div>

        <button
          onClick={logout}
          className="group relative flex items-center gap-2 px-6 py-2.5 border border-white/30 bg-transparent text-white overflow-hidden transition-all duration-300 hover:border-amber-500"
        >
          <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]" />
          <span className="relative z-10 text-[11px] font-black tracking-[0.2em] uppercase group-hover:text-[#0A1E2F] transition-colors duration-300">
            Sign Out
          </span>
          <MdLogout className="relative z-10 w-4 h-4 group-hover:text-[#0A1E2F] transition-colors duration-300" />
        </button>
      </div>
    </header>
  );
}