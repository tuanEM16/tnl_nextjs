// products/attributes/page.js
'use client';
import { useAttributes } from '@/hooks/useProductAttributes';
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Link from 'next/link';

export default function AttributesPage() {
    // 🟢 Bỏ bớt filters và setFilter cho nhẹ máy
    const { attributes, loading, handleDelete } = useAttributes();

    const columns = [
        {
            header: 'ID',
            render: (row) => <span className="font-bold"># {row.id}</span>
        },
        {
            header: 'TÊN THUỘC TÍNH',
            render: (row) => <span className="font-black italic text-xl tracking-tighter">{row.name.toUpperCase()}</span>
        },
        {
            header: 'THỨ TỰ HIỂN THỊ',
            render: (row) => <span className="font-black text-orange-600">{row.sort_order}</span>,
            className: 'text-center'
        },
        {
            header: 'THAO TÁC HỆ THỐNG',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3">
                    <Link
                        href={`/admin/products/attributes/${row.id}/edit`}
                        className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <MdEdit size={20} />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id, row.name)}
                        className="p-3 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-10 font-archivo pb-20">
            {/* 🔴 HEADER: Chỉ giữ tiêu đề và nút thêm */}

            <PageHeader
                title="ĐỊNH NGHĨA THÔNG SỐ"
                subTitle="Engineering Specs Dictionary"
                btnText="THÊM LOẠI MỚI"
                btnHref="/admin/products/attributes/add"
                // 🟢 THÊM 2 DÒNG NÀY VÀO ĐẠI CA ƠI
                isBack={true}
                backHref="/admin/products"
            />

            {/* 🟢 BẢNG DỮ LIỆU: Hiện toàn bộ danh sách, không cần Search Box che mắt */}
            <div className="border-[6px] border-black bg-white shadow-[15px_15px_0_0_#000] overflow-hidden">
                <AdminTable
                    columns={columns}
                    data={attributes}
                    loading={loading}
                    emptyText="CHƯA CÓ ĐỊNH NGHĨA THÔNG SỐ NÀO TRONG CƠ SỞ DỮ LIỆU."
                />
            </div>
        </div>
    );
}