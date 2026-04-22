'use client';

import { useParams } from 'next/navigation';
import { useBannerForm } from '@/hooks/useBanners';
import { BANNER_PAGES, GLOBAL_STATUS } from '@/types';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminForm from '@/components/admin/ui/AdminForm';
import ImageUploader from '@/components/admin/ui/ImageUploader';

import { MdMonitor, MdSettings, MdInfo } from 'react-icons/md';

export default function EditBannerPage() {
    const { id } = useParams();

    // 1. SỬ DỤNG HOOK FORM "ALL-IN-ONE"
    const {
        formData,
        preview,
        fetching,
        loading,
        handleChange,
        handleImageChange,
        handleSubmit
    } = useBannerForm(id);

    // 2. ĐỊNH NGHĨA CẤU TRÚC FORM (SCHEMA)
    const bannerFields = [
        { 
            label: "Tên định danh (ID Name)", 
            name: "name", 
            type: "text", 
            required: true, 
            fullWidth: true 
        },
        { 
            label: "Vị trí trang đích", 
            name: "page", 
            type: "select", 
            options: Object.entries(BANNER_PAGES).map(([v, l]) => ({ value: v, label: l })) 
        },
        { 
            label: "Thứ tự hiển thị", 
            name: "sort_order", 
            type: "number" 
        },
        { 
            label: "Đường dẫn Redirect (URL)", 
            name: "link", 
            type: "text", 
            fullWidth: true 
        },
        { 
            label: "Mô tả hệ thống (Internal Note)", 
            name: "description", 
            type: "textarea" 
        },
    ];

    // MÀN HÌNH CHỜ KHI ĐANG KÉO DỮ LIỆU CŨ
    if (fetching) return (
        <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center">
            RECALIBRATING BANNER DATA...
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER SẠCH BONG */}
            <PageHeader 
                title="EDIT BANNER" 
                subTitle="Visual Asset Modification" 
                btnText="QUAY LẠI" 
                btnHref="/admin/banners" 
                isBack={true} 
            />

            <div onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* CỘT TRÁI: FORM CẤU HÌNH (2/3) */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-8">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm italic">
                            <MdSettings size={24}/> THÔNG SỐ CẤU HÌNH
                        </h2>

                        {/* 🔴 DÙNG FORM DÙNG CHUNG */}
                        <AdminForm 
                            fields={bannerFields} 
                            formData={formData} 
                            onChange={handleChange} 
                            onSubmit={handleSubmit} 
                            loading={loading}
                            btnText="CẬP NHẬT BANNER →" 
                        />
                    </section>
                </div>

                {/* CỘT PHẢI: LIVE PREVIEW & STATUS (1/3) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white border-2 border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic uppercase">
                                <MdMonitor size={20}/> Visual Preview
                            </h3>

                            {/* 🔴 DÙNG UPLOADER DÙNG CHUNG */}
                            <ImageUploader 
                                preview={preview} 
                                onImageChange={handleImageChange} 
                                label="THAY ĐỔI TỆP HÌNH ẢNH"
                            />

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">Trạng thái vận hành</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full border-2 border-black p-4 font-black outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]"
                                >
                                    {Object.entries(GLOBAL_STATUS).map(([v, l]) => (
                                        <option key={v} value={v}>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* TIP BOX */}
                        <div className="p-6 border-2 border-black border-dashed bg-gray-50/50">
                            <p className="text-[9px] font-black flex items-center gap-2 leading-relaxed italic">
                                <MdInfo size={14} className="shrink-0 text-black"/> 
                                <span>LƯU Ý: HỆ THỐNG SẼ TỰ ĐỘNG GỠ BỎ TỆP CŨ KHI TỆP MỚI ĐƯỢC XÁC NHẬN CẬP NHẬT.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}