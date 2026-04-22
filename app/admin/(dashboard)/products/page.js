'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category_id: '', keyword: '' });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.getAll(filters);
            setProducts(res.data || []);
        } catch (error) {
            toast.error('KHÔNG THỂ TẢI DANH SÁCH');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data || []);
        } catch (error) { console.error(error); }
    };


    const handleDelete = async (id, name) => {
        if (!window.confirm(`XÁC NHẬN XÓA VĨNH VIỄN: ${name.toUpperCase()}?`)) return;
        
        try {
            await productService.delete(id);
            toast.success('ĐÃ TIÊU HỦY DỮ LIỆU THÉP');
            fetchProducts(); // Tải lại danh sách sau khi xóa
        } catch (error) {
            toast.error('XÓA THẤT BẠI. KIỂM TRA LẠI RÀNG BUỘC!');
        }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchProducts(); }, [filters]);

    return (
        <div className="space-y-12 font-archivo uppercase">
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 mb-3 italic">Industrial Inventory</p>
                    <h1 className="text-8xl font-black tracking-tighter leading-none text-black">
                        SẢN PHẨM<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <Link href="/admin/products/add" className="bg-black text-white px-10 py-5 text-xs font-black tracking-widest hover:bg-orange-600 transition-all">
                    + THÊM MỚI
                </Link>
            </header>

            {/* BỘ LỌC */}
            <div className="flex gap-0 border-[1.5px] border-black bg-white">
                <select
                    value={filters.category_id}
                    onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                    className="p-5 border-r border-black font-black text-[10px] tracking-widest focus:outline-none appearance-none cursor-pointer"
                >
                    <option value="">TẤT CẢ DANH MỤC</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <div className="relative flex-1 flex items-center px-6">
                    <MdSearch size={20} className="text-black" />
                    <input
                        type="text"
                        placeholder="TÌM KIẾM MÃ THÉP..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        className="w-full p-4 font-bold text-xs tracking-widest focus:outline-none"
                    />
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="border-[1.5px] border-black bg-white overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-6 text-[10px] font-black tracking-widest">Media</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">Thông tin</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">Trạng thái</th>
                            <th className="p-6 text-[10px] font-black tracking-widest text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {loading ? (
                            <tr><td colSpan="4" className="p-20 text-center font-black italic animate-pulse">Scanning line...</td></tr>
                        ) : products.map((prod) => (
                            <tr key={prod.id} className="group hover:bg-orange-50/30 transition-colors">
                                <td className="p-6 w-32">
                                    <div className="w-24 h-16 border border-black bg-gray-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${prod.thumbnail}`} 
                                            alt={prod.name} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => e.target.src = 'https://placehold.co/200x150?text=STEEL'}
                                        />
                                    </div>
                                </td>
                                <td className="p-6">
                                    <Link href={`/admin/products/${prod.id}/edit`} className="font-black text-2xl tracking-tighter hover:text-orange-600 transition-colors">
                                        {prod.name}
                                    </Link>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1 italic tracking-widest">Standard: {prod.standard || 'TCVN'}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1 text-[9px] font-black tracking-widest ${prod.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {prod.status === 1 ? 'Available' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-6">
                                        <Link href={`/admin/products/${prod.id}/show`} className="hover:scale-125 transition-transform"><MdVisibility size={20}/></Link>
                                        <Link href={`/admin/products/${prod.id}/edit`} className="text-indigo-600 hover:scale-125 transition-transform"><MdEdit size={20}/></Link>
                                        <button 
                                            onClick={() => handleDelete(prod.id, prod.name)} 
                                            className="text-red-600 hover:scale-125 transition-transform"
                                        >
                                            <MdDelete size={20}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}