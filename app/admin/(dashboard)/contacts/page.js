'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContacts } from '@/hooks/useContacts';
import { CONTACT_STATUS } from '@/types';
import { formatDate } from '@/lib/utils';

import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdDelete, MdEmail, MdPhone, MdHourglassEmpty, MdSearch, MdVisibility } from 'react-icons/md';

export default function ContactListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // DEBOUNCE TÌM KIẾM
    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { contacts, loading, deleteContact } = useContacts({ keyword: query });

    const columns = [
        {
            header: 'Khách hàng',
            render: (row) => (
                <div className="font-semibold text-base text-gray-900 group-hover:text-[#0e2188] transition-colors">
                    {row.name}
                </div>
            )
        },
        {
            header: 'Thông tin liên lạc',
            render: (row) => (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <MdPhone className="text-gray-400" size={16} /> {row.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MdEmail className="text-gray-400" size={16} /> {row.email}
                    </div>
                </div>
            )
        },
        {
            header: 'Thời gian',
            render: (row) => (
                <div className="text-sm font-medium text-gray-600">
                    {formatDate(row.created_at)}
                </div>
            )
        },
        {
            header: 'Trạng thái',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                row.status === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                        <MdHourglassEmpty size={14} /> Mới
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                        {CONTACT_STATUS[row.status] || 'Đã xử lý'}
                    </span>
                )
            )
        },
        {
            header: 'Thao tác',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 text-gray-400">
                    <Link 
                        href={`/admin/contacts/${row.id}/show`} 
                        className="p-2 bg-gray-50 rounded-lg hover:text-[#0e2188] hover:bg-blue-50 transition-colors"
                        title="Xem chi tiết"
                    >
                        <MdVisibility size={20} />
                    </Link>
                    <button
                        onClick={() => {
                            setItemToDelete(row);
                            setIsModalOpen(true);
                        }}
                        className="p-2 bg-gray-50 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa liên hệ"
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12 font-sans">
            <PageHeader title="Quản lý Liên hệ" subTitle="Danh sách khách hàng yêu cầu tư vấn và báo giá" />

            {/* 🔴 THANH TÌM KIẾM - MODERN STYLE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative group max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MdSearch size={24} className="text-gray-400 group-focus-within:text-[#0e2188] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-12 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0e2188]/20 focus:border-[#0e2188] transition-all placeholder:text-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#e33127]"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminTable columns={columns} data={contacts} loading={loading} />
            </div>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => deleteContact(itemToDelete.id, itemToDelete.name)}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa yêu cầu liên hệ của khách hàng: ${itemToDelete?.name}? Hành động này không thể hoàn tác.`}
            />
        </div>
    );
}