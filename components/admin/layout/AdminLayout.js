
'use client';

import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
        <footer
          className="h-10 border-t border-white/10 flex items-center px-10 justify-between text-[9px] font-bold tracking-[0.2em] text-[#8AA9C9] uppercase"
          style={{
            background: 'linear-gradient(90deg, #8C001A 0%, #0B1F4F 35%, #5B1F5A 65%, #8C001A 100%)'
          }}
        >
          <span>TNL Steel Admin System</span>
          <span>v1.0.4 / 2026</span>
        </footer>
      </div>
    </div>
  );
}