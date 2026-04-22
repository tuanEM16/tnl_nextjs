'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { contactService } from '@/services/contactService';
import toast from 'react-hot-toast';
import { MdDelete, MdEmail, MdPhone, MdHourglassEmpty, MdSearch } from 'react-icons/md';

export default function ContactListPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState(''); // State lưu từ khóa tìm kiếm

    const fetchContacts = async () => {
        setLoading(true);
        try {

            const res = await contactService.getAll({ keyword });
            setContacts(res.data || []);
        } catch (error) {
            toast.error('LỖI KẾT NỐI HỆ THỐNG');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchContacts();
        }, 500); // Đợi 500ms sau khi ngừng gõ mới gọi API

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    const handleDelete = async (id, name) => {
        if (!confirm(`XOÁ YÊU CẦU CỦA KHÁCH: ${name.toUpperCase()}?`)) return;
        try {
            await contactService.delete(id);
            toast.success('ĐÃ XOÁ');
            fetchContacts();
        } catch (error) {
            toast.error('XOÁ THẤT BẠI');
        }
    };

    return (
        <div className="space-y-12 font-archivo uppercase">
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Customer Inquiry Line</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none">LIÊN HỆ<span className="text-orange-600">.</span></h1>
                </div>
                <div className="text-right">
                    <span className="text-5xl font-black italic">{contacts.length}</span>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest">KẾT QUẢ TÌM THẤY</p>
                </div>
            </header>

            {/* 🔥 THANH TÌM KIẾM NICKELBRONX */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <MdSearch size={24} className="text-black group-focus-within:text-orange-600 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="TÌM THEO TÊN, EMAIL HOẶC SỐ ĐIỆN THOẠI KHÁCH HÀNG..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-white border-2 border-black p-6 pl-16 font-black text-sm tracking-widest outline-none focus:bg-orange-50 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] placeholder:text-gray-300"
                />
            </div>

            <div className="border-[1.5px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-6 text-[10px] font-black tracking-widest">KHÁCH HÀNG</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">LIÊN LẠC</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">THỜI GIAN</th>
                            <th className="p-6 text-[10px] font-black tracking-widest">TRẠNG THÁI</th>
                            <th className="p-6 text-[10px] font-black tracking-widest text-right">QUẢN LÝ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {loading ? (
                            <tr><td colSpan="5" className="p-20 text-center font-black italic animate-pulse">Scanning database...</td></tr>
                        ) : contacts.length > 0 ? (
                            contacts.map((item) => (
                                <tr key={item.id} className="hover:bg-orange-50/50 transition-colors group">
                                    <td className="p-6">
                                        <span className="font-black text-2xl tracking-tighter block">{item.name}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-xs font-bold"><MdPhone/> {item.phone}</div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 italic lowercase"><MdEmail/> {item.email}</div>
                                    </td>
                                    <td className="p-6 text-[10px] font-black text-gray-400 italic">
                                        {new Date(item.created_at).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="p-6">
                                        {item.status === 0 ? (
                                            <span className="flex items-center gap-1 w-fit px-3 py-1 bg-orange-600 text-white text-[9px] font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <MdHourglassEmpty/> NEW REQUEST
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[9px] font-black italic">PROCESSED</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-6">
                                            <Link 
                                                href={`/admin/contacts/${item.id}/show`}
                                                className="text-[10px] font-black underline hover:text-orange-600"
                                            >
                                                XEM CHI TIẾT →
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="text-red-600 hover:scale-125 transition-transform"
                                            >
                                                <MdDelete size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center font-black italic text-gray-400">
                                    KHÔNG TÌM THẤY LIÊN HỆ NÀO KHỚP VỚI TỪ KHÓA.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}