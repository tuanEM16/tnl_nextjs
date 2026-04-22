'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useContactDetail } from '@/hooks/useContacts';
import { formatDate } from '@/lib/utils';
// "VŨ KHÍ" DÙNG CHUNG
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdDelete, MdCheckCircle, MdEmail, MdPhone, MdAccessTime, MdMessage } from 'react-icons/md';

export default function ContactDetailPage() {
    const { id } = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // 1. TRIỆU HỒI HOOK
    const { contact, loading, handleUpdateStatus, handleDelete } = useContactDetail(id);

    // 2. MÀN HÌNH CHỜ
    if (loading && !contact) return (
        <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center">
            RETRIEVING MESSAGE PAYLOAD...
        </div>
    );

    if (!contact) return null;

    return (
        <div className="max-w-5xl space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER DÙNG CHUNG */}
            <PageHeader 
                title="MESSAGE DETAIL" 
                subTitle={`Inquiry ID: #${id}`} 
                btnText="QUAY LẠI" 
                btnHref="/admin/contacts" 
                isBack={true} 
            />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG (40%) */}
                <div className="lg:w-2/5 space-y-6">
                    <div className="border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 italic tracking-widest">SENDER IDENTITY</p>
                            <h2 className="text-4xl font-black tracking-tighter text-black">{contact.name}</h2>
                        </div>

                        <div className="space-y-4 border-t-2 border-black pt-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-600 text-white p-2 border-2 border-black shadow-[3px_3px_0_0_#000]"><MdPhone size={20}/></div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 italic">PHONE NUMBER</p>
                                    <p className="font-black text-xl tracking-tight">{contact.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-black text-white p-2 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"><MdEmail size={20}/></div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 italic">EMAIL ADDRESS</p>
                                    <p className="font-bold text-sm lowercase underline decoration-2">{contact.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-gray-200 text-black p-2 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"><MdAccessTime size={20}/></div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 italic">RECEIVED AT</p>
                                    <p className="font-black text-sm">{formatDate(contact.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* STATUS BADGE */}
                        <div className={`p-4 border-4 border-black text-center font-black italic shadow-[6px_6px_0_0_#000] ${
                            contact.status === 0 ? 'bg-yellow-400' : 'bg-green-500 text-white'
                        }`}>
                            {contact.status === 0 ? 'STATUS: NEW REQUEST' : 'STATUS: PROCESSED'}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: NỘI DUNG TIN NHẮN (60%) */}
                <div className="lg:w-3/5 space-y-8">
                    <div className="relative border-4 border-black p-12 bg-white shadow-[12px_12px_0px_0px_rgba(234,88,12,0.1)] min-h-[300px]">
                        <div className="absolute -top-5 left-8 bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest italic border-2 border-white/20">
                            <MdMessage className="inline mr-2" size={14}/> Message Payload
                        </div>
                        <p className="text-3xl font-medium leading-[1.2] tracking-tighter text-black italic normal-case">
                            "{contact.content}"
                        </p>
                    </div>

                    {/* ACTION PANEL */}
                    <div className="flex gap-6">
                        {contact.status === 0 && (
                            <button 
                                onClick={() => handleUpdateStatus(1)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] shadow-[8px_8px_0px_0px_#ea580c] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#ea580c] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
                            >
                                <MdCheckCircle size={24}/> ĐÁNH DẤU ĐÃ XỬ LÝ
                            </button>
                        )}
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={loading}
                            className="px-12 border-4 border-black py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all active:bg-red-800 disabled:opacity-50"
                        >
                            <MdDelete size={24}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔴 MODAL XÁC NHẬN XÓA */}
            <AdminModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="TIÊU HỦY DỮ LIỆU"
                message={`BẠN CÓ CHẮC CHẮN MUỐN XÓA VĨNH VIỄN YÊU CẦU CỦA ${contact.name}? HÀNH ĐỘNG NÀY SẼ GỠ BỎ HOÀN TOÀN KHỎI DATABASE.`}
            />
        </div>
    );
}