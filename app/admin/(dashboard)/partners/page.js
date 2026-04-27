'use client';
import { useState, useEffect } from 'react';
import { partnerService } from '@/services/partnerService';
import { getImageUrl } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import { MdAdd, MdDragIndicator, MdEdit, MdDelete, MdLink } from 'react-icons/md';
import Link from 'next/link';

export default function PartnersPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await partnerService.getAll();
            setItems(res.data || []);
        } catch (error) {
            console.error("LỖI:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder) => {
        setItems(newOrder);
        try {
            await partnerService.updateOrder(newOrder.map(i => i.id));
        } catch (error) { }
    };
    const handleDelete = async (id) => {
        // 🟢 Hỏi ý kiến đại ca trước khi "tiễn khách"
        if (!confirm('Đại ca có chắc muốn tiễn ông đối tác này lên đường không?')) return;

        try {
            // 1. Gọi Service Backend xóa sạch cả file lẫn DB
            await partnerService.delete(id);

            // 2. Cập nhật lại UI ngay lập tức để đại ca thấy nó biến mất
            setItems(prevItems => prevItems.filter(item => item.id !== id));

            alert('Đã xóa sạch sành sanh!');
        } catch (error) {
            console.error("LỖI XÓA:", error);
            alert('Xóa thất bại rồi đại ca ơi! Check lại Backend xem.');
        }
    };
    return (
        <div className="space-y-12 pb-20 font-archivo">
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">// Strategic Partners</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">ĐỐI TÁC<span className="text-orange-600">.</span></h1>
                </div>
                <Link href="/admin/partners/add" className="bg-black text-white px-8 py-4 font-black text-[10px] shadow-[4px_4px_0_0_#ea580c] hover:bg-orange-600 transition-all uppercase flex items-center gap-2">
                    <MdAdd size={18} /> THÊM ĐỐI TÁC
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((partner) => (
                    <div key={partner.id} className="bg-white border-4 border-black p-6 relative group shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all">
                        <div className="h-32 flex items-center justify-center mb-6 grayscale group-hover:grayscale-0 transition-all">
                            <img src={getImageUrl(partner.logo)} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-black uppercase tracking-tighter text-lg">{partner.name}</h3>
                                {partner.link && <a href={partner.link} target="_blank" className="text-[10px] text-zinc-400 flex items-center gap-1 hover:text-orange-600"><MdLink /> WEBSITE</a>}
                            </div>
                            <div className="flex gap-4">
                                <Link href={`/admin/partners/${partner.id}/edit`} className="hover:scale-125 transition-transform"><MdEdit size={20} /></Link>
                                <button
                                    onClick={() => handleDelete(partner.id)} // 🟢 Gọi hàm xóa kèm theo ID
                                    className="hover:text-red-600 hover:scale-125 transition-transform"
                                >
                                    <MdDelete size={20} />
                                </button>                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}