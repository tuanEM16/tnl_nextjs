// app/admin/products/attributes/[id]/edit/page.js
'use client';
import { useAttributeForm } from '@/hooks/useProductAttributes';
import PageHeader from '@/components/admin/ui/PageHeader';
import { use } from 'react';

export default function EditAttributePage({ params }) {
    const { id } = use(params); // Bốc ID từ URL xuống
    const { formData, fetching, loading, handleChange, handleSubmit } = useAttributeForm(id);

    if (fetching) return (
        <div className="p-20 text-center font-black animate-pulse text-gray-400">
            // SYNCHRONIZING_DATABASE...
        </div>
    );

    // 🟢 Gọi cái hàm ở bên dưới
    return (
        <AttributeFormUI 
            formData={formData} 
            loading={loading} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            title="HIỆU CHỈNH THÔNG SỐ" 
        />
    );
}

// 🔴 ĐÂY LÀ KHÚC ĐẠI CA ĐANG THIẾU - DÁN NÓ VÀO CUỐI FILE
function AttributeFormUI({ formData, loading, handleChange, handleSubmit, title }) {
    return (
        <div className="max-w-2xl space-y-10 font-archivo uppercase">
            <PageHeader title={title} subTitle="Engineering Specification Unit" isBack={true} />
            
            <form onSubmit={handleSubmit} className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400">// TÊN THÔNG SỐ (VÍ DỤ: MÁC THÉP, QUY CÁCH)</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-orange-50 transition-all" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400">// THỨ TỰ HIỂN THỊ</label>
                        <input 
                            type="number" 
                            name="sort_order" 
                            value={formData.sort_order} 
                            onChange={handleChange} 
                            className="w-full border-4 border-black p-4 font-black outline-none" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400">// TRẠNG THÁI</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none"
                        >
                            <option value={1}>HIỂN THỊ</option>
                            <option value={0}>ẨN</option>
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-black text-white py-6 font-black text-xl shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
                >
                    {loading ? 'STORING...' : 'COMMIT DATA →'}
                </button>
            </form>
        </div>
    );
}