'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/services/postService';
import { MdAdd, MdEdit, MdDelete, MdArrowBack, MdLayers, MdDragHandle, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function PostCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent_id: '0',
        sort_order: 0,
        status: 1,
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await postService.getCategories();
            setCategories(res.data || []);
        } catch (error) {
            toast.error('LỖI TRUY XUẤT CƠ SỞ DỮ LIỆU');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', slug: '', parent_id: '0', sort_order: 0, status: 1 });
        setEditingId(null);
        setShowAddForm(false);
    };

    const handleEdit = (cat) => {
        setFormData({
            name: cat.name,
            slug: cat.slug || '',
            parent_id: cat.parent_id?.toString() || '0',
            sort_order: cat.sort_order || 0,
            status: cat.status,
        });
        setEditingId(cat.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`XÁC NHẬN XÓA DANH MỤC: ${name.toUpperCase()}?`)) return;
        try {
            await postService.deleteCategory(id);
            toast.success('ĐÃ LOẠI BỎ');
            fetchCategories();
        } catch (error) {
            toast.error('XÓA THẤT BẠI');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('CHƯA NHẬP TÊN DANH MỤC');
            return;
        }
        setFormLoading(true);
        try {
            if (editingId) {
                await postService.updateCategory(editingId, formData);
                toast.success('CẬP NHẬT THÀNH CÔNG');
            } else {
                await postService.createCategory(formData);
                toast.success('ĐÃ THÊM DANH MỤC MỚI');
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'THAO TÁC THẤT BẠI');
        } finally {
            setFormLoading(false);
        }
    };

    const renderTree = (items, parentId = 0, level = 0) => {
        const children = items.filter((item) => item.parent_id === parentId);
        return children.map((item) => (
            <tr key={item.id} className="hover:bg-orange-50/50 transition-colors border-b border-black/10 group">
                <td className="p-6">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 32}px` }}>
                        {level > 0 ? (
                            <span className="text-orange-600 font-black">↳</span>
                        ) : (
                            <MdLayers className="text-gray-400 group-hover:text-black" />
                        )}
                        <span className="font-black text-lg tracking-tighter">{item.name}</span>
                    </div>
                </td>
                <td className="p-6 text-[10px] font-black text-gray-400 italic lowercase">{item.slug}</td>
                <td className="p-6 text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 border border-black font-black text-[10px]">
                        #{item.sort_order}
                    </span>
                </td>
                <td className="p-6">
                    <span className={`px-3 py-1 text-[9px] font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        item.status === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                    }`}>
                        {item.status === 1 ? 'ACTIVE' : 'DISABLED'}
                    </span>
                </td>
                <td className="p-6">
                    <div className="flex justify-end gap-4">
                        <button onClick={() => handleEdit(item)} className="text-black hover:text-orange-600 transition-transform hover:scale-125">
                            <MdEdit size={20} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="text-red-600 hover:scale-125 transition-transform">
                            <MdDelete size={20} />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-widest text-center">Reading Hierarchy Data...</div>;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Content Classification System</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        DANH MỤC<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/posts" className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors">
                        <MdArrowBack size={20} /> QUAY LẠI
                    </Link>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-black text-white px-8 py-4 text-xs font-black tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <MdAdd size={18}/> THÊM DANH MỤC
                    </button>
                </div>
            </header>

            {/* MODAL FORM - NICKELBRONX STYLE */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-archivo">
                    <div className="bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(234,88,12,1)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-black text-white p-6 flex justify-between items-center">
                            <h2 className="text-xl font-black italic tracking-widest flex items-center gap-3 uppercase">
                                <MdDragHandle /> {editingId ? 'EDIT PARAMETERS' : 'NEW CLASSIFICATION'}
                            </h2>
                            <button onClick={resetForm} className="hover:text-orange-600 transition-colors">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Tên danh mục</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-orange-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Slug (Định danh URL)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] lowercase"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Danh mục cấp trên (Parent)</label>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    className="w-full border-2 border-black p-4 font-black outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] bg-gray-50"
                                >
                                    <option value="0">-- CẤP GỐC (ROOT CATEGORY) --</option>
                                    {categories
                                        .filter((c) => c.id !== editingId)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 italic uppercase">Thứ tự ưu tiên</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                        className="w-full border-2 border-black p-4 font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái hệ thống</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                        className="w-full border-2 border-black p-4 font-black outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] bg-orange-50"
                                    >
                                        <option value={1}>HIỂN THỊ (ACTIVE)</option>
                                        <option value={0}>TẠM ẨN (DISABLED)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-black text-white py-6 text-xs font-black tracking-[0.3em] hover:bg-orange-600 transition-all shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] active:scale-95"
                                >
                                    {formLoading ? 'STORING...' : 'LƯU DỮ LIỆU →'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 border-2 border-black font-black text-[10px] hover:bg-gray-100 transition-colors"
                                >
                                    HỦY BỎ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BẢNG DANH SÁCH - TECHNICAL TABLE */}
            <div className="border-[1.5px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-6 text-[10px] font-black tracking-widest">CẤU TRÚC DANH MỤC</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">URL SLUG</th>
                            <th className="p-6 text-[10px] font-black tracking-widest text-center">THỨ TỰ</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">TRẠNG THÁI</th>
                            <th className="p-6 text-[10px] font-black tracking-widest text-right">QUẢN LÝ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {categories.length > 0 ? (
                            renderTree(categories)
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center font-black italic text-gray-400">
                                    DATABASE EMPTY. CHƯA CÓ DANH MỤC PHÂN LOẠI.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}