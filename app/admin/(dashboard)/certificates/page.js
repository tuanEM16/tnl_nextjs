'use client';
import { useState, useEffect } from 'react';
import { certificateService } from '@/services/certificateService';
import { getImageUrl } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import { MdAdd, MdDragIndicator, MdEdit, MdDelete, MdVerified } from 'react-icons/md';
import Link from 'next/link';

export default function CertificatesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await certificateService.getAll();
            setItems(res.data || []);
        } catch (error) {
            console.error("LỖI BỐC DỮ LIỆU:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder) => {
        setItems(newOrder);
        try {
            const ids = newOrder.map(item => item.id);
            await certificateService.updateOrder(ids);
        } catch (error) {
            console.error("LỖI LƯU VỊ TRÍ:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("XÓA THẬT KHÔNG ĐẠI CA?")) {
            try {
                const res = await certificateService.delete(id);
                if (res.success) {
                    // 🟢 XÓA XONG THÌ LỌC LẠI MẢNG ĐỂ NÓ BIẾN MẤT TRÊN GIAO DIỆN LUÔN
                    setItems(items.filter(item => item.id !== id));
                }
            } catch (error) {
                alert("ĐÉO XÓA ĐƯỢC: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 mb-3 italic">// Verification Assets</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none">BẰNG KHEN<span className="text-orange-600">.</span></h1>
                </div>
                <Link href="/admin/certificates/add" className="bg-black text-white px-8 py-4 font-black text-[10px] shadow-[4px_4px_0_0_#ea580c] hover:bg-orange-600 transition-all flex items-center gap-2">
                    <MdAdd size={18} /> THÊM MỚI
                </Link>
            </header>

            {loading ? (
                <div className="p-20 text-center font-black animate-pulse tracking-[0.5em]">ĐANG TRIỆU HỒI...</div>
            ) : (
                <div className="border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
                    <div className="grid grid-cols-12 gap-4 bg-black text-white p-4 font-black text-[10px] tracking-widest">
                        <div className="col-span-1 text-center">DRAG</div>
                        <div className="col-span-2">ẢNH</div>
                        <div className="col-span-5">TÊN CHỨNG CHỈ / TỔ CHỨC</div>
                        <div className="col-span-2 text-center">NĂM CẤP</div>
                        <div className="col-span-2 text-right">THAO TÁC</div>
                    </div>

                    <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="divide-y-2 divide-black">
                        {items.map((row) => (
                            <Reorder.Item key={row.id} value={row} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-zinc-50 cursor-default">
                                <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-zinc-300 hover:text-black">
                                    <MdDragIndicator size={28} />
                                </div>
                                <div className="col-span-2">
                                    <div className="w-20 h-28 border-2 border-black overflow-hidden shadow-[4px_4px_0_0_#000]">
                                        <img src={getImageUrl(row.image)} className="w-full h-full object-cover grayscale hover:grayscale-0" />
                                    </div>
                                </div>
                                <div className="col-span-5 space-y-1">
                                    <h3 className="font-black text-xl tracking-tighter leading-none">{row.title}</h3>
                                    <p className="text-[9px] font-bold text-zinc-400 italic">{row.organization}</p>
                                </div>
                                <div className="col-span-2 text-center font-black text-orange-600 italic">
                                    {row.issue_year}
                                </div>
                                <div className="col-span-2 flex justify-end gap-6">
                                    <Link href={`/admin/certificates/${row.id}/edit`} className="hover:text-blue-600 transition-transform hover:scale-125"><MdEdit size={22} /></Link>
                                    <button onClick={() => handleDelete(row.id)} className="hover:text-red-600 transition-transform hover:scale-125"><MdDelete size={22} /></button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>
            )}
        </div>
    );
}