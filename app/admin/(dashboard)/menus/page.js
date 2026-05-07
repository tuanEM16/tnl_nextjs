'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMenus } from '@/hooks/useMenus';
import { menuService } from '@/services/menuService';
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import MenuRow from '@/components/admin/menu/MenuRow';
import { POSITIONS } from '@/types';
import toast from 'react-hot-toast';

// 🟢 IMPORT THƯ VIỆN KÉO THẢ
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function MenusPage() {
    const router = useRouter();
    const { menus, loading, fetchAll: fetchMenus } = useMenus();

    const [filterPos, setFilterPos]       = useState('all');
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [mounted, setMounted]           = useState(false); // Fix lỗi giao diện Next.js
    const [localMenus, setLocalMenus]     = useState([]); // Lưu mảng kéo thả tạm thời

    // Render xong mới cho phép kéo thả để tránh lỗi Hydration của Next.js
    useEffect(() => {
        setMounted(true);
    }, []);

    // Đồng bộ data từ API sang local state để kéo thả mượt mà
    useEffect(() => {
        const filtered = filterPos === 'all' ? menus : menus.filter(m => m.position === filterPos);
        const roots = filtered.filter(m => parseInt(m.parent_id) === 0);
        setLocalMenus(roots);
    }, [menus, filterPos]);

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

    // 🟢 HÀM XỬ LÝ KHI THẢ CHUỘT
const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (sourceIndex === destIndex) return;

        // 1. Cập nhật giao diện ngay lập tức
        const items = Array.from(localMenus);
        const [reorderedItem] = items.splice(sourceIndex, 1);
        items.splice(destIndex, 0, reorderedItem);
        setLocalMenus(items);

        // 2. Gọi API XỊN CỦA SẾP (Quăng nguyên mảng items luôn)
        try {
            await menuService.reorder(items); // 🟢 Đổi chỗ này
            toast.success('Đã lưu vị trí mới!');
        } catch (error) {
            toast.error('Lỗi khi lưu vị trí');
            fetchMenus(); 
        }
    };

    if (!mounted) return null;

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

            {/* Table Kéo Thả */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="border-[4px] border-black overflow-hidden shadow-[8px_8px_0_0_#000]">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-black text-white">
                                {['Structure & Label', 'Endpoint', 'Type', 'Area', 'Order', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        
                        <Droppable droppableId="menus-droppable">
                            {(provided) => (
                                <tbody 
                                    className="bg-white divide-y-2 divide-black/10"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {loading ? (
                                        <tr><td colSpan={6} className="px-4 py-12 text-center text-xs font-black italic text-gray-300 tracking-widest">SCANNING NETWORK NODES...</td></tr>
                                    ) : localMenus.length === 0 ? (
                                        <tr><td colSpan={6} className="px-4 py-12 text-center text-xs font-black italic text-gray-300 tracking-widest">NO_MENU_ITEMS</td></tr>
                                    ) : localMenus.map((item, index) => (
                                        
                                        // 🟢 GÓI TỪNG DÒNG BẰNG DRAGGABLE
                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <MenuRow
                                                    item={item} 
                                                    level={0}
                                                    allMenus={menus}
                                                    onEdit={(item) => router.push(`/admin/menus/${item.id}/edit`)}
                                                    onDelete={triggerDelete}
                                                    // Truyền bộ điều khiển kéo thả vào MenuRow
                                                    provided={provided} 
                                                    isDragging={snapshot.isDragging}
                                                />
                                            )}
                                        </Draggable>

                                    ))}
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </table>
                </div>
            </DragDropContext>

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