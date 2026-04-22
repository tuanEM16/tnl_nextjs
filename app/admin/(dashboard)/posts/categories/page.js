'use client';

import { usePostCategories } from '@/hooks/usePostCategories';
import { GLOBAL_STATUS } from '@/types';
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdAdd, MdEdit, MdDelete, MdLayers, MdDragHandle, MdClose } from 'react-icons/md';
import Link from 'next/link';

export default function PostCategoriesPage() {
    // 1. TRIỆU HỒI HOOK (Dùng đúng logic fetch và form của đại ca)
    const {
        categories,
        loading,
        showAddForm,
        setShowAddForm,
        editingId,
        formData,
        setFormData,
        formLoading,
        resetForm,
        handleEdit,
        handleDelete,
        handleSubmit
    } = usePostCategories();

    // 2. HÀM ĐỆ QUY VẼ CÂY (Dữ nguyên logic render của đại ca)
    const renderTree = (items, parentId = 0, level = 0) => {
        // Dùng == để khớp cả '0' và 0
        const children = items.filter((item) => item.parent_id == parentId);
        
        return children.map((item) => (
            <tr key={item.id} className="hover:bg-orange-50/50 transition-colors border-b-2 border-black/10 group">
                <td className="p-6">
                    <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 40}px` }}>
                        {level > 0 ? (
                            <span className="text-orange-600 font-black text-2xl">↳</span>
                        ) : (
                            <div className="bg-black text-white p-1.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                                <MdLayers size={16} />
                            </div>
                        )}
                        <span className="font-black text-xl tracking-tighter uppercase">{item.name}</span>
                    </div>
                </td>
                <td className="p-6 text-[11px] font-black text-gray-400 italic lowercase tracking-widest">{item.slug}</td>
                <td className="p-6 text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 border-2 border-black font-black text-[10px] shadow-[3px_3px_0_0_#000]">
                        #{item.sort_order}
                    </span>
                </td>
                <td className="p-6">
                    <span className={`px-4 py-1 text-[10px] font-black italic border-2 border-black shadow-[3px_3px_0_0_#000] ${
                        item.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 shadow-none'
                    }`}>
                        {item.status === 1 ? 'ACTIVE' : 'DISABLED'}
                    </span>
                </td>
                <td className="p-6">
                    <div className="flex justify-end gap-6 text-black">
                        <button onClick={() => handleEdit(item)} className="hover:text-orange-600 transition-transform hover:scale-125">
                            <MdEdit size={22} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="hover:text-red-600 transition-transform hover:scale-125">
                            <MdDelete size={22} />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    if (loading) return (
        <div className="p-32 text-center font-black italic animate-pulse uppercase tracking-[0.4em]">
            READING HIERARCHY DATA...
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER NICKELBRONX - FIX TRIỆT ĐỂ VỤ NÚT */}
            <PageHeader 
                title="DANH MỤC" 
                subTitle="Content Classification System" 
                btnText="THÊM DANH MỤC" 
                btnAction={() => setShowAddForm(true)} // 🟢 MỞ MODAL NGAY TẠI ĐÂY
                isBack={true} 
                backHref="/admin/posts"
            />

            {/* 🔴 MODAL FORM - UI LÌ LỢM THEO SCREENSHOT */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white border-[6px] border-black shadow-[20px_20px_0px_0px_#ea580c] w-full max-w-xl animate-in fade-in zoom-in duration-300">
                        <div className="bg-black text-white p-6 flex justify-between items-center border-b-4 border-black">
                            <h2 className="text-xl font-black italic tracking-widest flex items-center gap-3 uppercase">
                                <MdDragHandle size={24} /> {editingId ? 'EDIT PARAMETERS' : 'NEW CLASSIFICATION'}
                            </h2>
                            <button onClick={resetForm} className="hover:rotate-90 transition-transform text-orange-600">
                                <MdClose size={32} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">CATEGORY NAME</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-orange-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic">PARENT CATEGORY</label>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    className="w-full border-4 border-black p-4 font-black outline-none bg-gray-50 cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                                >
                                    <option value="0">-- CẤP GỐC (ROOT) --</option>
                                    {categories.filter(c => c.id !== editingId).map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 italic">ORDER</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                        className="w-full border-4 border-black p-4 font-black outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 italic">STATUS</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                        className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                                    >
                                        <option value={1}>ACTIVE</option>
                                        <option value={0}>DISABLED</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-black text-white py-8 text-xs font-black tracking-[0.4em] shadow-[8px_8px_0px_0px_#ea580c] hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
                            >
                                {formLoading ? 'STORING DATA...' : 'SAVE CONFIGURATION →'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔴 BẢNG DỮ LIỆU TECHNICAL */}
            <div className="border-[6px] border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-6 text-[10px] font-black tracking-[0.3em] border-r border-white/10 uppercase">Hierarchy Structure</th>
                            <th className="p-6 text-[10px] font-black tracking-[0.3em] border-r border-white/10 uppercase">Slug</th>
                            <th className="p-6 text-[10px] font-black tracking-[0.3em] border-r border-white/10 text-center uppercase">Order</th>
                            <th className="p-6 text-[10px] font-black tracking-[0.3em] border-r border-white/10 uppercase">Status</th>
                            <th className="p-6 text-[10px] font-black tracking-[0.3em] text-right uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-4 divide-black">
                        {categories.length > 0 ? (
                            renderTree(categories)
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-32 text-center">
                                    <div className="opacity-20 flex flex-col items-center gap-4">
                                        <MdLayers size={64} />
                                        <p className="font-black text-xl italic uppercase">Database Empty</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}