'use client';
import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdPerson } from 'react-icons/md';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ keyword: '', status: '', limit: 10, offset: 0 });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.index(filters);
            if (res.success) setUsers(res.data.data);
        } catch (error) { toast.error("LỖI TẢI DỮ LIỆU!"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, [filters]);

    const handleDelete = async (id) => {
        if (!confirm("XÓA TÀI KHOẢN NÀY?")) return;
        try {
            await userService.destroy(id);
            toast.success("ĐÃ XÓA!");
            fetchUsers();
        } catch (error) { toast.error("LỖI KHI XÓA!"); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-8 border-black pb-8">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                        <MdPerson className="text-orange-600" />
                        NHÂN SỰ<span className="text-orange-600">.</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest italic">
                        Quản lý đội ngũ vận hành hệ thống
                    </p>
                </div>
                <Link href="/admin/users/add" 
                    className="group relative inline-block bg-black text-white px-10 py-5 font-black text-sm uppercase tracking-[0.2em] transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0">
                    <span className="relative z-10 flex items-center gap-2">
                        <MdAdd size={20} /> THÊM ADMIN MỚI
                    </span>
                    <div className="absolute inset-0 bg-orange-600 translate-x-2 translate-y-2 -z-10 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                </Link>
            </div>

            {/* --- SEARCH BOX --- */}
            <div className="bg-white border-4 border-black p-2 flex items-center gap-4 shadow-[8px_8px_0_0_#000] focus-within:shadow-[8px_8px_0_0_#ea580c] transition-all">
                <div className="bg-black p-3 text-white">
                    <MdSearch size={24} />
                </div>
                <input 
                    type="text" 
                    placeholder="NHẬP TÊN, EMAIL HOẶC USERNAME ĐỂ TRUY QUÉT..." 
                    className="flex-1 py-3 font-bold text-lg outline-none uppercase placeholder:text-gray-300"
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})} 
                />
            </div>

            {/* --- TABLE AREA --- */}
            <div className="relative overflow-x-auto border-4 border-black bg-white shadow-[16px_16px_0_0_#000]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-black text-white text-xs uppercase tracking-[0.3em]">
                        <tr>
                            <th className="p-5 border-r border-gray-800">Thông tin nhân sự</th>
                            <th className="p-5 border-r border-gray-800 text-center">Tài khoản</th>
                            <th className="p-5 border-r border-gray-800 text-center">Trạng thái</th>
                            <th className="p-5 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-4 divide-black">
                        {loading ? (
                            <tr><td colSpan="4" className="p-20 text-center font-black text-2xl italic animate-pulse">CONNECTING TO DATABASE...</td></tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="group hover:bg-orange-50 transition-colors">
                                    {/* Cột Thông tin */}
                                    <td className="p-5 border-r-4 border-black">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 border-4 border-black bg-gray-200 flex-shrink-0 overflow-hidden">
                                                <img 
                                                    src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : '/default.png'} 
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                                    alt={user.name}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-xl uppercase leading-none mb-1">{user.name}</span>
                                                <span className="text-xs font-bold text-gray-400">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cột Tài khoản */}
                                    <td className="p-5 border-r-4 border-black text-center">
                                        <div className="inline-block bg-gray-100 px-3 py-1 border-2 border-black font-black text-xs uppercase">
                                            @{user.username}
                                        </div>
                                    </td>

                                    {/* Cột Trạng thái */}
                                    <td className="p-5 border-r-4 border-black text-center">
                                        <span className={`px-4 py-2 text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0_0_#000] ${
                                            user.status === 1 ? 'bg-green-400 text-black' : 'bg-red-400 text-black'
                                        }`}>
                                            {user.status === 1 ? 'ONLINE' : 'LOCKED'}
                                        </span>
                                    </td>

                                    {/* Cột Thao tác */}
                                    <td className="p-5">
                                        <div className="flex justify-center items-center gap-3">
                                            <Link href={`/admin/users/${user.id}/show`} 
                                                className="p-3 border-2 border-black hover:bg-blue-500 hover:text-white transition-all hover:-translate-y-1 shadow-[4px_4px_0_0_#000] hover:shadow-none bg-white">
                                                <MdVisibility size={20} />
                                            </Link>
                                            <Link href={`/admin/users/${user.id}/edit`} 
                                                className="p-3 border-2 border-black hover:bg-green-500 hover:text-white transition-all hover:-translate-y-1 shadow-[4px_4px_0_0_#000] hover:shadow-none bg-white">
                                                <MdEdit size={20} />
                                            </Link>
                                            <button onClick={() => handleDelete(user.id)} 
                                                className="p-3 border-2 border-black hover:bg-red-600 hover:text-white transition-all hover:-translate-y-1 shadow-[4px_4px_0_0_#000] hover:shadow-none bg-white">
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-20 text-center font-black text-gray-300 text-xl uppercase">Hệ thống trống rỗng</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}