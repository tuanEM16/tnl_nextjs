'use client';

import { useState } from 'react'; // 🟢 Thêm useState để quản lý Modal
import { useMenus } from '@/hooks/useMenus';
import { MdAdd, MdLink, MdMenuOpen, MdEdit, MdDelete, MdArrowBack, MdSettings, MdLayers, MdWarning } from 'react-icons/md';
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal'; // 🟢 Triệu hồi Modal xóa chung

export default function MenusPage() {
    const {
        view, setView, menus, loading, position, setPosition,
        formData, setFormData, handleAction, handleDelete, handleSubmit,
    } = useMenus();

    // 🟢 STATE QUẢN LÝ VIỆC XÓA
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const triggerDelete = (item) => {
        setItemToDelete(item);
        setIsModalOpen(true);
    };

    if (view === 'list') {
        return (
            <div className="space-y-12 pb-20 font-archivo uppercase animate-in fade-in duration-500">
                <PageHeader 
                    title="ĐIỀU HƯỚNG" 
                    subTitle="Site Navigation & Map Control" 
                    btnText="KHỞI TẠO MENU" 
                    btnAction={() => handleAction('add')}
                />

                {/* TABS VỊ TRÍ */}
                <div className="flex gap-4 p-2 bg-white border-4 border-black w-fit shadow-[8px_8px_0_0_#000]">
                    {[{ id: 'mainmenu', label: 'PRIMARY HEADER' }, { id: 'footermenu', label: 'SECONDARY FOOTER' }].map((tab) => (
                        <button key={tab.id} onClick={() => setPosition(tab.id)}
                            className={`px-8 py-3 text-xs font-black transition-all ${position === tab.id ? 'bg-black text-white shadow-[4px_4px_0_0_#ea580c]' : 'text-gray-400 hover:text-black'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* BẢNG DỮ LIỆU */}
                <div className="border-[6px] border-black bg-white shadow-[15px_15px_0_0_#000] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white text-[10px] tracking-[0.3em]">
                                <th className="p-6 border-r border-white/10">STRUCTURE & DESTINATION</th>
                                <th className="p-6 border-r border-white/10 text-center w-32">ORDER</th>
                                <th className="p-6 text-right w-48">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-black">
                            {loading ? (
                                <tr><td colSpan="3" className="p-20 text-center font-black italic animate-pulse">SCANNING NETWORK NODES...</td></tr>
                            ) : menus.length > 0 ? (
                                menus.map((item) => (
                                    <tr key={item.id} className={`hover:bg-orange-50/50 transition-colors ${item.parent_id !== 0 ? 'bg-gray-50/50' : ''}`}>
                                        <td className="p-6 border-r-4 border-black">
                                            <div className="flex items-center gap-4">
                                                {item.parent_id !== 0 && <span className="ml-10 text-orange-600 font-black text-2xl">┗━━</span>}
                                                <div className="flex flex-col">
                                                    <span className="font-black text-xl tracking-tighter leading-none">{item.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold lowercase flex items-center gap-1 italic mt-1"><MdLink size={14}/> {item.link}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 border-r-4 border-black text-center font-black text-lg italic">#{item.sort_order}</td>
                                        <td className="p-6">
                                            <div className="flex justify-end gap-4">
                                                <button onClick={() => handleAction('edit', item)} className="p-2 border-2 border-black hover:bg-black hover:text-white shadow-[4px_4px_0_0_#000] active:shadow-none"><MdEdit size={20} /></button>
                                                {/* 🟢 GỌI TRIGGER DELETE Ở ĐÂY */}
                                                <button onClick={() => triggerDelete(item)} className="p-2 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white shadow-[4px_4px_0_0_#000] active:shadow-none"><MdDelete size={20} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="p-20 text-center text-gray-400 font-black italic uppercase">Vị trí này chưa được thiết lập.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔴 MODAL XÁC NHẬN XÓA DÙNG CHUNG */}
                <AdminModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => {
                        handleDelete(itemToDelete.id); // 🟢 Gọi hàm xóa trong Hook
                        setIsModalOpen(false);
                    }}
                    title="THU HỒI LIÊN KẾT"
                    message={`CẨN TRỌNG: HÀNH ĐỘNG NÀY SẼ GỠ BỎ MỤC "${itemToDelete?.name?.toUpperCase()}" KHỎI HỆ THỐNG ĐIỀU HƯỚNG. CÁC MENU CON (NẾU CÓ) CŨNG SẼ BỊ ẢNH HƯỞNG.`}
                />
            </div>
        );
    }


    // VIEW 2: FORM THÊM / SỬA
    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 font-archivo uppercase animate-in slide-in-from-right-8 duration-500">
            <button 
                onClick={() => setView('list')}
                className="group flex items-center gap-3 font-black text-xs tracking-[0.3em] hover:text-orange-600 transition-all"
            >
                <MdArrowBack size={24} className="group-hover:-translate-x-2 transition-transform" /> 
                HUỶ BỎ VÀ TRỞ LẠI
            </button>

            <form onSubmit={handleSubmit} className="relative group">
                {/* LỚP NỀN SHADOW SIÊU DÀY */}
                <div className="absolute inset-0 bg-orange-600 translate-x-4 translate-y-4 -z-10 border-4 border-black group-hover:translate-x-6 group-hover:translate-y-6 transition-all"></div>

                <div className="bg-white border-[6px] border-black p-12 space-y-12">
                    <div className="border-b-[6px] border-black pb-8 flex items-center gap-6">
                        <div className="bg-black text-white p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]">
                            <MdMenuOpen size={36} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter italic leading-none">
                                {view === 'add' ? 'KHỞI TẠO LIÊN KẾT' : 'HIỆU CHỈNH ĐIỀU HƯỚNG'}<span className="text-orange-600">_</span>
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 mt-2 tracking-[0.4em]">Configure Sitemap Parameters</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Tên Menu */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLayers /> DISPLAY LABEL
                            </label>
                            <input 
                                required 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                placeholder="VD: BÀI VIẾT" 
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-orange-50 transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)]" 
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLink /> TARGET ENDPOINT
                            </label>
                            <input 
                                required 
                                value={formData.link} 
                                onChange={(e) => setFormData({...formData, link: e.target.value})} 
                                placeholder="VD: /tin-tuc" 
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-black focus:text-white transition-all shadow-[6px_6px_0_0_rgba(0,0,0,0.05)] lowercase" 
                            />
                        </div>

                        {/* Menu Cha */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic">HIERARCHY NODE (PARENT)</label>
                            <select
                                value={formData.parent_id}
                                onChange={(e) => setFormData({ ...formData, parent_id: parseInt(e.target.value) })}
                                className="w-full border-4 border-black p-5 font-black text-sm outline-none bg-white cursor-pointer appearance-none hover:bg-gray-50 transition-colors"
                            >
                                <option value={0}>-- CẤP GỐC (ROOT LEVEL) --</option>
                                {menus.filter(m => m.parent_id === 0 && m.id !== formData.id).map(parent => (
                                    <option key={parent.id} value={parent.id}>BRANCH: {parent.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Thứ tự */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdSettings /> SORT SEQUENCE
                            </label>
                            <input
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-orange-50 transition-all"
                            />
                        </div>

                        {/* Vị trí */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Deployment Area</label>
                            <select 
                                value={formData.position} 
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })} 
                                className="w-full border-4 border-black p-5 font-black text-sm bg-orange-50 outline-none"
                            >
                                <option value="mainmenu">PRIMARY HEADER</option>
                                <option value="footermenu">SECONDARY FOOTER</option>
                            </select>
                        </div>

                        {/* Loại */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Link Architecture</label>
                            <select 
                                value={formData.type} 
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                                className="w-full border-4 border-black p-5 font-black text-sm bg-white outline-none cursor-pointer"
                            >
                                <option value="custom">EXTERNAL/CUSTOM LINK</option>
                                <option value="category">PRODUCT CATALOG</option>
                                <option value="post">EDITORIAL CONTENT</option>
                            </select>
                        </div>
                    </div>

                    {/* NÚT SUBMIT NẶNG ĐÔ */}
                    <div className="pt-10 border-t-[6px] border-black">
                        <button 
                            disabled={loading}
                            type="submit"
                            className="group relative w-full bg-black text-white py-8 font-black text-2xl uppercase tracking-[0.5em] transition-all hover:bg-orange-600 active:translate-x-2 active:translate-y-2 active:shadow-none disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-6">
                                {loading ? 'SYNCING...' : 'COMMIT CHANGES →'}
                            </span>
                            <div className="absolute inset-0 translate-x-3 translate-y-3 border-4 border-black -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform bg-white"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}