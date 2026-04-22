'use client';

import { useState, useEffect } from 'react';
import { menuService } from '@/services/menuService';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdArrowBack, MdLink, MdMenuOpen, MdOutlineDragHandle } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function MenusPage() {
    // --- 1. STATES ---
    const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [position, setPosition] = useState('mainmenu'); // Mặc định lọc theo Header

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        type: 'custom',
        parent_id: 0,
        position: 'mainmenu',
        sort_order: 0
    });

    // --- 2. FETCH DATA ---
    const fetchMenus = async () => {
        setLoading(true);
        try {
            // Gọi API index với vị trí hiện tại (mainmenu hoặc footermenu)
            const res = await menuService.index(position);
            // res.data lúc này là mảng phẳng từ Backend gửi về
            setMenus(res.data);
        } catch (error) {
            toast.error("KHÔNG THỂ TẢI HỆ THỐNG ĐIỀU HƯỚNG!");
        } finally {
            setLoading(false);
        }
    };

    // 🟢 ĐÃ FIX LỖI: Chỉ gọi fetchMenus, không gọi fetchUsers nữa
    useEffect(() => {
        fetchMenus();
    }, [position]);

    // --- 3. HANDLERS ---
    const handleAction = (type, menu = null) => {
        if (type === 'add') {
            setSelectedMenu(null);
            setFormData({ name: '', link: '', type: 'custom', parent_id: 0, position: position, sort_order: 0 });
        } else if (menu) {
            setSelectedMenu(menu);
            setFormData({ ...menu });
        }
        setView(type);
    };

    const handleDelete = async (id) => {
        if (!confirm("XÁC NHẬN XÓA MỤC MENU NÀY?")) return;
        try {
            await menuService.destroy(id);
            toast.success("ĐÃ GỠ BỎ LIÊN KẾT!");
            fetchMenus();
        } catch (error) {
            toast.error("LỖI KHI XÓA!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (view === 'add') {
                await menuService.store(formData);
                toast.success("THÊM MENU THÀNH CÔNG!");
            } else {
                await menuService.update(selectedMenu.id, formData);
                toast.success("CẬP NHẬT THÀNH CÔNG!");
            }
            setView('list');
            fetchMenus();
        } catch (error) {
            toast.error(error.message || "CÓ LỖI XẢY RA!");
        } finally {
            setLoading(false);
        }
    };

    // --- 4. RENDER VIEWS ---

    // VIEW: DANH SÁCH (LIST)
    if (view === 'list') return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">ĐIỀU HƯỚNG<span className="text-orange-600">.</span></h1>
                    <p className="text-xs font-bold text-gray-400 italic uppercase">Quản lý cấu trúc Navbar & Footer</p>
                </div>
                <button onClick={() => handleAction('add')} className="bg-black text-white px-8 py-4 font-black text-xs uppercase shadow-[6px_6px_0_0_#ea580c] hover:bg-orange-600 transition-all active:shadow-none active:translate-x-1 active:translate-y-1">
                    + THÊM MENU
                </button>
            </div>

            {/* Tabs Vị trí */}
            <div className="flex gap-2 p-1 bg-gray-100 border-2 border-black w-fit">
                {['mainmenu', 'footermenu'].map((pos) => (
                    <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`px-6 py-2 text-[10px] font-black uppercase transition-all ${position === pos ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        {pos === 'mainmenu' ? 'Header chính' : 'Footer trang'}
                    </button>
                ))}
            </div>

            {/* Bảng Menu */}
            <div className="border-4 border-black shadow-[12px_12px_0_0_#000] bg-white overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-black text-white text-[10px] uppercase tracking-widest">
                        <tr>
                            <th className="p-4 border-r border-gray-800">Cấu trúc tên & liên kết</th>
                            <th className="p-4 border-r border-gray-800 text-center">Thứ tự</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                        {loading ? (
                            <tr><td colSpan="3" className="p-10 text-center font-black italic">ĐANG TRUY XUẤT SITEMAP...</td></tr>
                        ) : menus.length > 0 ? (
                            menus.map((item) => (
                                <tr key={item.id} className={`hover:bg-orange-50 ${item.parent_id !== 0 ? 'bg-gray-50' : ''}`}>
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="flex items-center gap-3 font-black uppercase text-sm">
                                            {item.parent_id !== 0 && <span className="ml-8 text-orange-600">┗━━</span>}
                                            <div className="flex flex-col">
                                                <span>{item.name}</span>
                                                <span className="text-[10px] text-gray-400 lowercase italic font-bold flex items-center gap-1">
                                                    <MdLink /> {item.link}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black text-center font-black">{item.sort_order}</td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => handleAction('edit', item)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"><MdEdit size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 border-2 border-black hover:bg-red-600 hover:text-white transition-all"><MdDelete size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="p-10 text-center text-gray-400 font-bold">VỊ TRÍ NÀY CHƯA CÓ MENU.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // VIEW: FORM (ADD / EDIT)
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
            <button onClick={() => setView('list')} className="flex items-center gap-2 font-black text-xs uppercase hover:text-orange-600 transition-colors">
                <MdArrowBack size={20} /> QUAY LẠI DANH SÁCH
            </button>

            <form onSubmit={handleSubmit} className="bg-white border-[6px] border-black p-8 space-y-8 shadow-[16px_16px_0_0_#ea580c]">
                <div className="border-b-4 border-black pb-4 flex items-center gap-3">
                    <MdMenuOpen size={30} className="text-orange-600" />
                    <h2 className="text-2xl font-black uppercase">{view === 'add' ? 'KHỞI TẠO MENU MỚI' : 'SỬA MỤC LIÊN KẾT'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Tên hiển thị</label>
                        <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="VD: SẢN PHẨM" className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-black focus:text-white" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Đường dẫn (URL)</label>
                        <input required value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="VD: /san-pham" className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-black focus:text-white" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Menu Cha (Nếu có)</label>
                        <select
                            value={formData.parent_id}
                            onChange={(e) => setFormData({ ...formData, parent_id: parseInt(e.target.value) })}
                            className="w-full border-4 border-black p-4 font-bold bg-white outline-none cursor-pointer"
                        >
                            <option value={0}>KHÔNG CÓ (LÀ MENU CẤP 1)</option>
                            {menus.filter(m => m.parent_id === 0 && m.id !== selectedMenu?.id).map(parent => (
                                <option key={parent.id} value={parent.id}>THUỘC NHÓM: {parent.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            // Đảm bảo value luôn là số, nếu formData.sort_order bị undefined thì hiện 0
                            value={formData.sort_order ?? 0}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setFormData({ ...formData, sort_order: isNaN(val) ? 0 : val });
                            }}
                            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-black focus:text-white transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Vị trí</label>
                        <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full border-4 border-black p-4 font-bold bg-white outline-none">
                            <option value="mainmenu">HEADER (THANH TRÊN)</option>
                            <option value="footermenu">FOOTER (CHÂN TRANG)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Phân loại link</label>
                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border-4 border-black p-4 font-bold bg-white outline-none">
                            <option value="custom">LINK TÙY CHỈNH</option>
                            <option value="category">DANH MỤC SẢN PHẨM</option>
                            <option value="post">BÀI VIẾT</option>
                        </select>
                    </div>
                </div>

                <button disabled={loading} className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.4em] shadow-[8px_8px_0_0_#000] hover:bg-orange-600 hover:shadow-[8px_8px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                    {loading ? 'ĐANG LƯU...' : 'XÁC NHẬN CẬP NHẬT →'}
                </button>
            </form>
        </div>
    );
}