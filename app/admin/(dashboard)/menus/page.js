'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenus } from '@/hooks/useMenus';
import { menuService } from '@/services/menuService';
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import MenuRow from '@/components/admin/menu/MenuRow';
import { POSITIONS } from '@/types';
import toast from 'react-hot-toast';

export default function MenusPage() {
    const router = useRouter();
    const { menus, loading, fetchAll: fetchMenus } = useMenus();

    const [filterPos, setFilterPos]       = useState('all');
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const triggerDelete = (item) => {
        setItemToDelete(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await menuService.destroy(itemToDelete.id);
            toast.success('ĐÃ XÓA MENU!');
            fetchMenus();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa thất bại');
        } finally {
            setIsModalOpen(false);
        }
    };

    const filteredMenus = filterPos === 'all' ? menus : menus.filter(m => m.position === filterPos);
    const rootMenus     = filteredMenus.filter(m => parseInt(m.parent_id) === 0);

    return (
        <div className="font-archivo uppercase space-y-8 pb-20">
            <PageHeader
                title="ĐIỀU HƯỚNG"
                subTitle="Site Navigation Control"
                btnText="KHỞI TẠO MENU"
                btnAction={() => router.push('/admin/menus/add')}
            />

            {/* Filter tabs */}
            <div className="flex gap-2 border-b-4 border-black pb-4">
                {[{ v: 'all', l: 'Tất cả' }, ...POSITIONS.map(p => ({ v: p.value, l: p.label }))].map(tab => (
                    <button
                        key={tab.v}
                        onClick={() => setFilterPos(tab.v)}
                        className={`px-4 py-2 text-xs font-black border-2 border-black transition-all
                            ${filterPos === tab.v ? 'bg-black text-white' : 'bg-white text-black hover:bg-orange-50'}`}
                    >
                        {tab.l}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="border-[4px] border-black overflow-hidden shadow-[8px_8px_0_0_#000]">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-black text-white">
                            {['Structure & Label', 'Endpoint', 'Type', 'Area', 'Order', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[10px] font-black tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y-2 divide-black/10">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-xs font-black italic text-gray-300 tracking-widest">SCANNING NETWORK NODES...</td></tr>
                        ) : rootMenus.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-xs font-black italic text-gray-300 tracking-widest">NO_MENU_ITEMS</td></tr>
                        ) : rootMenus.map(item => (
                            <MenuRow
                                key={item.id} item={item} level={0}
                                allMenus={filteredMenus}
                                onEdit={(item) => router.push(`/admin/menus/${item.id}/edit`)}
                                onDelete={triggerDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="THU HỒI LIÊN KẾT"
                message={`CẨN TRỌNG: HÀNH ĐỘNG NÀY SẼ GỠ BỎ MỤC "${itemToDelete?.name?.toUpperCase()}" KHỎI HỆ THỐNG ĐIỀU HƯỚNG.`}
            />
        </div>
    );
}