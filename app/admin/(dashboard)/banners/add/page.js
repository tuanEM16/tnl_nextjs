'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bannerService } from '@/services/bannerService';
import { useApi } from '@/hooks/useApi';
import { BANNER_PAGES, GLOBAL_STATUS } from '@/types';

// IMPORT LINH KIỆN "VŨ KHÍ"
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminForm from '@/components/admin/ui/AdminForm';
import ImageUploader from '@/components/admin/ui/ImageUploader';

import { MdLaptopMac, MdSettings, MdInfo } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function AddBannerPage() {
    const router = useRouter();
    
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        page: 'home',
        sort_order: 0,
        description: '',
        status: 1,
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');

    // 2. SỬ DỤNG HOOK DÙNG CHUNG ĐỂ XỬ LÝ API
    const { loading, request: createBanner } = useApi(bannerService.create);

    // 3. ĐỊNH NGHĨA CẤU TRÚC FORM (SCHEMA)
    const bannerFields = [
        { 
            label: "Tên định danh Banner", 
            name: "name", 
            type: "text", 
            required: true, 
            fullWidth: true, 
            placeholder: "Vd: Banner Khuyến Mãi Tháng 4..." 
        },
        { 
            label: "Trang hiển thị mục tiêu", 
            name: "page", 
            type: "select", 
            options: Object.entries(BANNER_PAGES).map(([v, l]) => ({ value: v, label: l })) 
        },
        { 
            label: "Thứ tự ưu tiên (Sort)", 
            name: "sort_order", 
            type: "number" 
        },
        { 
            label: "Đường dẫn liên kết (Redirect Link)", 
            name: "link", 
            type: "text", 
            fullWidth: true, 
            placeholder: "https://..." 
        },
        { 
            label: "Mô tả nội bộ (Internal Note)", 
            name: "description", 
            type: "textarea" 
        },
    ];

    // 4. XỬ LÝ SỰ KIỆN
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) return toast.error('VUI LÒNG CHỌN FILE ẢNH BANNER');

        const data = new FormData();
        data.append('image', imageFile);
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        try {
            await createBanner(data);
            toast.success('ĐÃ CẤU HÌNH BANNER MỚI THÀNH CÔNG');
            router.push('/admin/banners');
        } catch (error) {
            // Error đã được useApi xử lý toast
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER SẠCH BONG */}
            <PageHeader 
                title="NEW BANNER" 
                subTitle="Visual Asset Configuration" 
                btnText="QUAY LẠI" 
                btnHref="/admin/banners" 
                isBack={true} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: FORM CẤU HÌNH (2/3) */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-8">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 shadow-sm italic">
                            <MdSettings size={24}/> THÔNG SỐ KỸ THUẬT
                        </h2>

                        {/* 🔴 SỬ DỤNG FORM DÙNG CHUNG */}
                        <AdminForm 
                            fields={bannerFields} 
                            formData={formData} 
                            onChange={handleChange} 
                            onSubmit={handleSubmit} 
                            loading={loading}
                            btnText="LƯU BANNER →" 
                        />
                    </section>
                </div>

                {/* CỘT PHẢI: MEDIA & STATUS (1/3) */}
                <div className="relative">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white border-2 border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-4 italic">
                                <MdLaptopMac size={20}/> Display Preview
                            </h3>

                            {/* 🔴 SỬ DỤNG UPLOADER DÙNG CHUNG */}
                            <ImageUploader 
                                preview={preview} 
                                onImageChange={handleImageChange} 
                                required={true}
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
                                <span>KÍCH THƯỚC KHUYÊN DÙNG LÀ 1920x800px ĐỂ HIỂN THỊ TỐT NHẤT TRÊN PC.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}