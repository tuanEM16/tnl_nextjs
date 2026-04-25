'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { partnerService } from '@/services/partnerService';
import { getImageUrl } from '@/lib/utils';
import { MdSave, MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function EditPartnerPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', link: '', status: 1 });
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await partnerService.getById(id);
                setFormData({ name: res.data.name, link: res.data.link, status: res.data.status });
                if (res.data.logo) setPreview(getImageUrl(res.data.logo));
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchPartner();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('link', formData.link);
        data.append('status', formData.status);
        if (file) data.append('logo', file);

        await partnerService.update(id, data);
        router.push('/admin/partners');
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse">ĐANG BỐC DỮ LIỆU...</div>;

    return (
        <div className="max-w-4xl space-y-12 pb-20 font-archivo">
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">// Relationship Update</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">SỬA ĐỐI TÁC<span className="text-orange-600">.</span></h1>
                </div>
                <Link href="/admin/partners" className="border-2 border-black px-6 py-3 font-black text-[10px] shadow-[4px_4px_0_0_#000] flex items-center gap-2"><MdArrowBack /> QUAY LẠI</Link>
            </header>

            <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000]">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex gap-10 items-center">
                        <div className="w-40 h-40 border-4 border-black relative bg-zinc-50 overflow-hidden shrink-0">
                            <img src={preview} className="w-full h-full object-contain p-4" />
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                setFile(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }} />
                        </div>
                        <div className="flex-1 space-y-6">
                            <input 
                                required
                                type="text" 
                                className="w-full border-b-4 border-black py-2 text-4xl font-black outline-none focus:border-orange-600 uppercase"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="url" 
                                className="w-full border-b-2 border-zinc-200 py-2 text-sm font-bold outline-none"
                                value={formData.link}
                                placeholder="Link Website..."
                                onChange={(e) => setFormData({...formData, link: e.target.value})}
                            />
                        </div>
                    </div>
                    <button className="w-full bg-black text-white py-6 font-black text-xl hover:bg-orange-600 shadow-[8px_8px_0_0_#000] flex justify-center items-center gap-3">
                        <MdSave size={24} /> LƯU THÔNG TIN MỚI
                    </button>
                </form>
            </div>
        </div>
    );
}