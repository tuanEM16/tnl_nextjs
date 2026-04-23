// products/attributes/add/page.js
'use client';
import { useAttributeForm } from '@/hooks/useProductAttributes';
import PageHeader from '@/components/admin/ui/PageHeader';

export default function AddAttributePage() {
    const { formData, loading, handleChange, handleSubmit } = useAttributeForm(); // Không truyền ID

    return <AttributeFormUI formData={formData} loading={loading} handleChange={handleChange} handleSubmit={handleSubmit} title="THÊM ĐỊNH NGHĨA" />;
}

// 🚩 Đại ca nên tách cái UI này ra một file riêng hoặc để chung như này cũng được
function AttributeFormUI({ formData, loading, handleChange, handleSubmit, title }) {
    return (
        <div className="max-w-2xl space-y-10 font-archivo uppercase">
            <PageHeader title={title} subTitle="Engineering Specification Unit" isBack={true} />
            <form onSubmit={handleSubmit} className="bg-white border-[6px] border-black p-10 shadow-[15px_15px_0_0_#000] space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400">// TÊN THÔNG SỐ (VÍ DỤ: MÁC THÉP)</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full border-4 border-black p-4 font-black text-xl outline-none focus:bg-orange-50" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400">// THỨ TỰ</label>
                        <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full border-4 border-black p-4 font-black outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400">// TRẠNG THÁI</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border-4 border-black p-4 font-black bg-orange-50 outline-none">
                            <option value={1}>HIỂN THỊ</option>
                            <option value={0}>ẨN</option>
                        </select>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 font-black text-xl shadow-[8px_8px_0_0_#ea580c] hover:-translate-y-1 transition-all">
                    {loading ? 'STORING...' : 'COMMIT DATA →'}
                </button>
            </form>
        </div>
    );
}