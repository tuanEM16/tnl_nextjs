'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers'; // 🟢 Dùng Hook "nội công" đại ca vừa đúc
import { getImageUrl } from '@/lib/utils';

// TRIỆU HỒI VŨ KHÍ UI NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdBadge, MdPhonelinkRing } from 'react-icons/md';
import Link from 'next/link';

export default function UsersPage() {
    // 1. TRIỆU HỒI HOOK
    const { users, loading, filters, setFilter, handleDelete } = useUsers();

    // 2. QUẢN LÝ MODAL (Dùng Modal thay cho confirm mặc định để nhìn cho ngầu)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // 3. ĐỊNH NGHĨA CỘT CHO BẢNG (Chuẩn chỉ dữ liệu nhân sự)
    const columns = [
        {
            header: 'DANH TÍNH NHÂN SỰ',
            render: (row) => (
                <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 border-4 border-black overflow-hidden bg-gray-100 shadow-[4px_4px_0px_0px_#000] shrink-0 group-hover:rotate-3 transition-transform">
                        <img
                            src={getImageUrl(row.avatar)}
                            alt={row.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${row.name}`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl uppercase tracking-tighter leading-none">{row.name}</span>
                        <span className="text-[10px] font-black text-gray-400 italic">@{row.username}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'LIÊN LẠC',
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-xs font-bold underline decoration-2 decoration-orange-500 lowercase">{row.email}</p>
                    <p className="text-[10px] font-black flex items-center gap-1">
                        <MdPhonelinkRing className="text-orange-600" /> {row.phone || '---'}
                    </p>
                </div>
            )
        },
        {
            header: 'VAI TRÒ',
            render: (row) => (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-black italic tracking-[0.2em] shadow-[3px_3px_0px_0px_#ea580c]">
                    <MdBadge size={14} /> {row.roles?.toUpperCase() || 'ADMIN'}
                </span>
            )
        },
        {
            header: 'TRẠNG THÁI',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                <span className={`px-4 py-1 text-[10px] font-black italic border-2 border-black shadow-[3px_3px_0px_0px_#000] ${row.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 shadow-none'
                    }`}>
                    {row.status === 1 ? 'AUTHORIZED' : 'LOCKED'}
                </span>
            )
        },
        {
            header: 'QUẢN LÝ',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 text-black">
                    <Link href={`/admin/users/${row.id}/show`} className="p-2 border-2 border-black hover:bg-blue-500 hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:shadow-none">
                        <MdVisibility size={20} />
                    </Link>
                    <Link href={`/admin/users/${row.id}/edit`} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:shadow-none">
                        <MdEdit size={20} />
                    </Link>
                    <button
                        onClick={() => { setItemToDelete(row); setIsModalOpen(true); }}
                        className="p-2 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:shadow-none"
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER SẠCH BONG */}
            <PageHeader
                title="NHÂN SỰ"
                subTitle="Access Control & Staff Directory"
                btnText="CẤP QUYỀN MỚI"
                btnHref="/admin/users/add"
            />

            {/* 🔴 SEARCH BOX NICKELBRONX */}
            <div className="bg-white border-4 border-black p-2 flex items-center gap-4 shadow-[10px_10px_0_0_#000] focus-within:shadow-[10px_10px_0_0_#ea580c] transition-all">
                <div className="bg-black p-4 text-white">
                    <MdSearch size={28} />
                </div>
                <input
                    type="text"
                    placeholder="NHẬP TÊN, EMAIL HOẶC USERNAME ĐỂ TRUY QUÉT..."
                    className="flex-1 py-3 font-black text-xl outline-none placeholder:text-gray-200"
                    value={filters.keyword}
                    onChange={(e) => setFilter('keyword', e.target.value)}
                />
            </div>

            {/* 🔴 BẢNG DỮ LIỆU DÙNG CHUNG */}
            <AdminTable
                columns={columns}
                data={users}
                loading={loading}
                emptyText="HỆ THỐNG TRỐNG RỖNG - CHƯA CÓ NHÂN SỰ NÀO KHỚP VỚI TRUY QUÉT"
            />

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    // 🟢 TRUYỀN CẢ ID VÀ NAME ĐỂ HOOK XỬ LÝ
                    await handleDelete(itemToDelete.id, itemToDelete.name);
                    setIsModalOpen(false);
                }}
                title="THU HỒI QUYỀN TRUY CẬP"
                message={`CẨN TRỌNG: XÓA VĨNH VIỄN TÀI KHOẢN CỦA ${itemToDelete?.name?.toUpperCase()}? HÀNH ĐỘNG NÀY SẼ DỌN SẠCH CẢ AVATAR TRÊN SERVER.`}
            />
        </div>
    );
}