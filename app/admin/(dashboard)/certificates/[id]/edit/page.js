'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { certificateService } from '@/services/certificateService';
import { getImageUrl } from '@/lib/utils';
import { MdArrowBack, MdSave, MdRefresh } from 'react-icons/md';
import Link from 'next/link';

export default function EditCertificatePage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    const [formData, setFormData] = useState({ title: '', issue_year: '', organization: '', status: 1 });
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await certificateService.getById(id);
                const data = res.data;
                setFormData({
                    title: data.title,
                    issue_year: data.issue_year,
                    organization: data.organization,
                    status: data.status
                });
                if (data.image) setPreview(getImageUrl(data.image));
            } catch (error) {
                alert("ĐÉO BỐC ĐƯỢC DỮ LIỆU ĐẠI CA ƠI!");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('issue_year', formData.issue_year);
            data.append('organization', formData.organization);
            data.append('status', formData.status);
            if (file) data.append('image', file);

            await certificateService.update(id, data);
            router.push('/admin/certificates');
            router.refresh();
        } catch (error) {
            alert("SỬA LỖI RỒI: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-ping uppercase">Đang quét dữ liệu...</div>;

    return (
        <div className="max-w-5xl space-y-12 pb-20 font-archivo">
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">// Record Modification</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">SỬA CHỨNG CHỈ<span className="text-orange-600">.</span></h1>
                </div>
                <Link href="/admin/certificates" className="flex items-center gap-2 border-2 border-black px-6 py-3 font-black text-[10px] hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]">
                    <MdArrowBack size={16} /> HỦY LỆNH
                </Link>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8 bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#ea580c]">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic">Tên chứng chỉ</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border-b-4 border-black py-4 text-2xl font-black outline-none focus:border-orange-600 uppercase"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic">Năm cấp</label>
                            <input 
                                type="text" 
                                className="w-full border-b-4 border-black py-4 text-xl font-black outline-none focus:border-orange-600"
                                value={formData.issue_year}
                                onChange={(e) => setFormData({...formData, issue_year: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic">Trạng thái</label>
                            <select 
                                className="w-full border-b-4 border-black py-4 text-xl font-black outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="1">CÔNG KHAI (LIVE)</option>
                                <option value="0">BẢN NHÁP (DRAFT)</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        disabled={updating}
                        className="w-full bg-black text-white py-6 font-black text-xl shadow-[8px_8px_0_0_#000] hover:bg-orange-600 transition-all flex justify-center items-center gap-3 uppercase"
                    >
                        {updating ? 'ĐANG CẬP NHẬT...' : <><MdSave size={24} /> XÁC NHẬN THAY ĐỔI</>}
                    </button>
                </div>

                <div className="lg:col-span-5">
                    <div className="border-4 border-black p-2 bg-white shadow-[8px_8px_0_0_#000] aspect-[3/4] relative group">
                        <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-white font-black text-xs uppercase flex items-center gap-2 bg-black px-4 py-2 border-2 border-white"><MdRefresh size={18}/> Đổi ảnh mới</p>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                            setFile(e.target.files[0]);
                            setPreview(URL.createObjectURL(e.target.files[0]));
                        }} />
                    </div>
                </div>
            </form>
        </div>
    );
}