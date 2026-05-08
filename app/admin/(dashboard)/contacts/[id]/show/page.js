'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useContactDetail } from '@/hooks/useContacts';
import { formatDate } from '@/lib/utils';
// "VŨ KHÍ" DÙNG CHUNG
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdDelete, MdCheckCircle, MdEmail, MdPhone, MdAccessTime, MdMessage, MdPersonOutline } from 'react-icons/md';

export default function ContactDetailPage() {
    const { id } = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // 1. TRIỆU HỒI HOOK
    const { contact, loading, handleUpdateStatus, handleDelete } = useContactDetail(id);

    // 2. MÀN HÌNH CHỜ
    if (loading && !contact) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0e2188] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Đang tải thông tin liên hệ...</p>
        </div>
    );

    if (!contact) return null;

    return (
        <div className="max-w-5xl space-y-8 pb-12 font-sans">
            {/* 🔴 HEADER DÙNG CHUNG */}
            <PageHeader 
                title="Chi tiết Liên hệ" 
                subTitle={`Mã yêu cầu: #${id}`} 
                btnText="Quay lại danh sách" 
                btnHref="/admin/contacts" 
                isBack={true} 
            />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG (40%) */}
                <div className="w-full lg:w-5/12 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 relative overflow-hidden">
                        {/* Background subtle accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>

                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                                <MdPersonOutline size={32} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Người gửi</p>
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{contact.name}</h2>
                            </div>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 p-2 bg-blue-50 text-[#0e2188] rounded-lg shrink-0">
                                    <MdPhone size={18}/>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Số điện thoại</p>
                                    <p className="font-semibold text-gray-900 text-lg tracking-tight">{contact.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 p-2 bg-gray-50 text-gray-600 rounded-lg shrink-0">
                                    <MdEmail size={18}/>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Email liên hệ</p>
                                    <p className="font-medium text-gray-900">{contact.email || 'Không cung cấp'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 p-2 bg-gray-50 text-gray-600 rounded-lg shrink-0">
                                    <MdAccessTime size={18}/>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Thời gian gửi</p>
                                    <p className="font-medium text-gray-900">{formatDate(contact.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* STATUS BADGE */}
                        <div className={`mt-8 py-3 px-4 rounded-xl text-center font-semibold text-sm border flex items-center justify-center gap-2 ${
                            contact.status === 0 
                            ? 'bg-red-50 border-red-100 text-red-600' 
                            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}>
                            {contact.status === 0 ? (
                                <>Trạng thái: <span>Mới / Chưa xử lý</span></>
                            ) : (
                                <>Trạng thái: <span>Đã xử lý</span></>
                            )}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: NỘI DUNG TIN NHẮN (60%) */}
                <div className="w-full lg:w-7/12 flex flex-col gap-6">
                    
                    {/* Message Box */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 border-b border-gray-100 pb-4 mb-6">
                            <MdMessage size={20} />
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Nội dung yêu cầu</h3>
                        </div>
                        
                        <div className="flex-1 bg-gray-50/50 rounded-xl p-6 border border-gray-100 relative">
                            {/* Quote icon decorative */}
                            <div className="absolute top-4 left-4 text-4xl text-gray-200 font-serif leading-none select-none opacity-50">"</div>
                            
                            <p className="text-gray-700 text-lg leading-relaxed relative z-10 pt-2 pl-4 whitespace-pre-wrap">
                                {contact.content}
                            </p>
                            
                            <div className="absolute bottom-4 right-4 text-4xl text-gray-200 font-serif leading-none select-none opacity-50 rotate-180">"</div>
                        </div>
                    </div>

                    {/* ACTION PANEL */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {contact.status === 0 && (
                            <button 
                                onClick={() => handleUpdateStatus(1)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#0e2188] hover:bg-blue-800 text-white py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <MdCheckCircle size={20}/> 
                                <span>Đánh dấu đã xử lý</span>
                            </button>
                        )}
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 border py-3.5 px-6 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                                contact.status === 0 
                                ? 'border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                                : 'flex-1 bg-white border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                        >
                            <MdDelete size={20}/>
                            <span>Xóa yêu cầu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔴 MODAL XÁC NHẬN XÓA */}
            <AdminModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa vĩnh viễn yêu cầu liên hệ của khách hàng "${contact.name}"? Hành động này không thể hoàn tác.`}
            />
        </div>
    );
}