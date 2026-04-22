'use client';

import { useState, useEffect } from 'react'; // 🟢 Nhớ import useEffect nhé
import Link from 'next/link';
import { useContacts } from '@/hooks/useContacts';
import { CONTACT_STATUS } from '@/types';
import { formatDate } from '@/lib/utils';

import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdDelete, MdEmail, MdPhone, MdHourglassEmpty, MdSearch, MdVisibility } from 'react-icons/md';

export default function ContactListPage() {
    // 🟢 1. State để gõ phím (phải cực nhanh)
    const [searchTerm, setSearchTerm] = useState('');
    // 🟢 2. State để search (đã delay 500ms)
    const [query, setQuery] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // 🟢 3. CƠ CHẾ GIẢM GIẬT (DEBOUNCE)
    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 🟢 4. DÙNG 'query' ĐỂ GỌI API (Chỉ gọi khi query thay đổi)
    const { contacts, loading, deleteContact } = useContacts({ keyword: query });

    const columns = [
        {
            header: 'KHÁCH HÀNG',
            render: (row) => (
                <span className="font-black text-2xl tracking-tighter block text-black group-hover:text-orange-600 transition-colors">
                    {row.name}
                </span>
            )
        },
        {
            header: 'LIÊN LẠC',
            render: (row) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black"><MdPhone className="text-orange-600" /> {row.phone}</div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 italic lowercase"><MdEmail /> {row.email}</div>
                </div>
            )
        },
        {
            header: 'THỜI GIAN',
            render: (row) => (
                <div className="text-[10px] font-black text-gray-400 italic">
                    {formatDate(row.created_at)}
                </div>
            )
        },
        {
            header: 'TRẠNG THÁI',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                row.status === 0 ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-[9px] font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <MdHourglassEmpty /> NEW REQUEST
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[9px] font-black italic border border-black/5">
                        {CONTACT_STATUS[row.status] || 'PROCESSED'}
                    </span>
                )
            )
        },
        {
            header: 'QUẢN LÝ',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-6 text-black">
                    <Link href={`/admin/contacts/${row.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125">
                        <MdVisibility size={22} />
                    </Link>
                    <button
                        onClick={() => {
                            setItemToDelete(row);
                            setIsModalOpen(true);
                        }}
                        className="hover:text-red-600 transition-transform hover:scale-125"
                    >
                        <MdDelete size={22} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            <PageHeader title="LIÊN HỆ" subTitle="Customer Inquiry Line" />

            {/* 🔴 THANH TÌM KIẾM NICKELBRONX */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <MdSearch size={28} className="text-black group-focus-within:text-orange-600 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="TÌM THEO TÊN, EMAIL HOẶC SỐ ĐIỆN THOẠI KHÁCH HÀNG..."
                    // 🟢 DÙNG searchTerm Ở ĐÂY ĐỂ GÕ CHO MƯỢT
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-4 border-black p-6 pl-16 font-black text-sm tracking-widest outline-none focus:bg-orange-50 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[10px] hover:text-orange-600 underline decoration-2"
                    >
                        CLEAR SEARCH
                    </button>
                )}
            </div>

            <AdminTable columns={columns} data={contacts} loading={loading} />

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => deleteContact(itemToDelete.id, itemToDelete.name)}
                title="XÓA YÊU CẦU"
                message={`BẠN CÓ CHẮC CHẮN MUỐN LOẠI BỎ YÊU CẦU LIÊN HỆ CỦA: ${itemToDelete?.name}?`}
            />
        </div>
    );
}