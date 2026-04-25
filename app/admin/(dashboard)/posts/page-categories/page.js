'use client';

import { useState, useEffect } from 'react';
import { postService } from '@/services/postService';
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdAdd, MdDelete, MdLabel, MdSettingsEthernet } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function PageCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            const res = await postService.getPageCategories();
            setCategories(res?.data || res || []);
        } catch (error) { toast.error('LỖI TẢI DỮ LIỆU'); }
    };

    useEffect(() => { loadData(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setLoading(true);
        try {
            await postService.createPageCategory({ name: newName });
            toast.success('ĐÃ THÊM VỊ TRÍ MỚI');
            setNewName('');
            loadData();
        } catch (error) { toast.error('THÊM THẤT BẠI'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('XÁC NHẬN TIÊU HỦY VỊ TRÍ NÀY?')) return;
        try {
            await postService.deletePageCategory(id);
            toast.success('ĐÃ XÓA');
            loadData();
        } catch (error) { toast.error('XÓA THẤT BẠI'); }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            <PageHeader title="VỊ TRÍ TRANG TĨNH" subTitle="Static Layout Slots Manager" isBack={true} backHref="/admin/posts" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* 🔵 FORM THÊM MỚI */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleAdd} className="bg-white border-4 border-black p-8 shadow-[10px_10px_0_0_#000] space-y-6">
                        <h3 className="text-xl font-black italic border-b-4 border-black pb-4 flex items-center gap-2">
                            <MdAdd size={24} className="text-orange-600" /> THÊM SLOT MỚI
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic">TÊN VỊ TRÍ (VD: TRANG CHỦ - INTRO)</label>
                            <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full border-4 border-black p-4 font-black outline-none focus:bg-orange-50"
                                placeholder="NHẬP TÊN VỊ TRÍ..."
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="w-full bg-black text-white py-4 font-black shadow-[4px_4px_0_0_#ea580c] hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'ĐANG LƯU...' : 'XÁC NHẬN THÊM +'}
                        </button>
                    </form>
                </div>

                {/* 🟠 DANH SÁCH VỊ TRÍ ĐANG CÓ */}
                <div className="lg:col-span-2">
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
                        <div className="grid grid-cols-12 bg-black text-white p-4 font-black text-[10px] tracking-widest">
                            <div className="col-span-2">ID</div>
                            <div className="col-span-6">TÊN VỊ TRÍ / ĐỊNH DANH (SLUG)</div>
                            <div className="col-span-4 text-right">THAO TÁC</div>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {categories.map((cat) => (
                                <div key={cat.id} className="grid grid-cols-12 p-4 items-center hover:bg-orange-50 transition-colors">
                                    <div className="col-span-2 font-black text-gray-300 italic">#0{cat.id}</div>
                                    <div className="col-span-6">
                                        <p className="font-black text-xl tracking-tighter">{cat.name}</p>
                                        <p className="text-[9px] font-bold text-orange-600 italic">SLUG: {cat.slug}</p>
                                    </div>
                                    <div className="col-span-4 flex justify-end">
                                        <button 
                                            onClick={() => handleDelete(cat.id)}
                                            className="hover:text-red-600 transition-transform hover:scale-125"
                                        >
                                            <MdDelete size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="p-10 text-center font-black italic text-gray-400">CHƯA CÓ VỊ TRÍ NÀO ĐƯỢC THIẾT LẬP</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}