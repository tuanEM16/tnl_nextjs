'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { contactService } from '@/services/contactService';
import toast from 'react-hot-toast';
import { MdArrowBack, MdDelete, MdCheckCircle } from 'react-icons/md';

export default function ContactDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await contactService.getById(id);
                setContact(res.data);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY YÊU CẦU');
                router.push('/admin/contacts');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            await contactService.updateStatus(id, 1); // 1 = Đã xử lý
            toast.success('ĐÃ ĐÁNH DẤU HOÀN TẤT');
            router.refresh(); // Load lại để cập nhật UI
        } catch (error) {
            toast.error('LỖI CẬP NHẬT');
        }
    };

    const handleDelete = async () => {
        if (!confirm('TIÊU HỦY YÊU CẦU NÀY VĨNH VIỄN?')) return;
        try {
            await contactService.delete(id);
            toast.success('ĐÃ XOÁ');
            router.push('/admin/contacts');
        } catch (error) {
            toast.error('XOÁ THẤT BẠI');
        }
    };

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase">Retrieving Data...</div>;
    if (!contact) return null;

    return (
        <div className="max-w-4xl space-y-12 font-archivo">
            <header className="space-y-4">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] hover:text-orange-600 transition-all"
                >
                    <MdArrowBack size={16}/> QUAY LẠI DANH SÁCH
                </button>
                <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85] text-black">
                    YÊU CẦU TỪ<br/>
                    <span className="text-orange-600">{contact.name}</span>
                </h1>
            </header>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="p-8 border-r-2 border-b-2 md:border-b-0 border-black">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest italic text-center md:text-left">Email Address</p>
                    <p className="font-bold underline text-sm break-all text-center md:text-left lowercase">{contact.email || 'N/A'}</p>
                </div>
                <div className="p-8 border-r-2 border-b-2 md:border-b-0 border-black">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest italic text-center md:text-left">Phone Number</p>
                    <p className="font-black text-3xl tracking-tighter text-center md:text-left">{contact.phone}</p>
                </div>
                <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1 italic">Received At</p>
                    <p className="font-black uppercase italic text-xs">{new Date(contact.created_at).toLocaleString('vi-VN')}</p>
                </div>
            </div>

            {/* MESSAGE CONTENT */}
            <div className="border-2 border-black p-12 bg-white relative shadow-[8px_8px_0px_0px_rgba(234,88,12,0.2)]">
                <div className="absolute -top-4 left-8 bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest italic">
                    Message Payload
                </div>
                <p className="text-3xl font-medium leading-tight tracking-tighter text-gray-900 italic uppercase">
                    "{contact.content}"
                </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-6 pt-4">
                {contact.status === 0 && (
                    <button 
                        onClick={handleUpdateStatus}
                        className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:scale-95"
                    >
                        <MdCheckCircle size={20}/> ĐÁNH DẤU ĐÃ XỬ LÝ
                    </button>
                )}
                <button 
                    onClick={handleDelete}
                    className="px-12 border-2 border-black py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                >
                    <MdDelete size={20}/>
                </button>
            </div>
        </div>
    );
}