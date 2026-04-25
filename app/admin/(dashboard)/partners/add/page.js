'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { partnerService } from '@/services/partnerService';
import { MdLink, MdPhotoCamera, MdSend } from 'react-icons/md';
import Link from 'next/link';

export default function AddPartnerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({ name: '', link: '', status: 1 });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('link', formData.link);
            data.append('status', formData.status);
            if (file) data.append('logo', file); // 🟢 BẮN LÊN FIELD 'logo'

            await partnerService.create(data);
            router.push('/admin/partners');
        } catch (error) {
            alert("LỖI RỒI ĐẠI CA: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-12 pb-20 font-archivo">
            <header className="border-b-4 border-black pb-10">
                <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">// Strategic Alliances</p>
                <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">KẾT NỐI ĐỐI TÁC<span className="text-orange-600">.</span></h1>
            </header>

            <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000]">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        {/* Logo Upload Preview */}
                        <div className="w-48 h-48 border-4 border-black shrink-0 relative bg-zinc-50 group overflow-hidden">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-contain p-4" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <MdPhotoCamera size={40} />
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                setFile(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }} />
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase italic">Tên đối tác</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full border-b-4 border-black py-2 text-3xl font-black outline-none focus:border-orange-600 uppercase"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase italic flex items-center gap-1"><MdLink /> Link Website (Nếu có)</label>
                                <input 
                                    type="url" 
                                    className="w-full border-b-2 border-zinc-200 py-2 text-sm font-bold outline-none focus:border-black transition-colors"
                                    placeholder="https://..."
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-6 font-black text-xl hover:bg-orange-600 transition-colors shadow-[8px_8px_0_0_#000] flex justify-center items-center gap-3 uppercase">
                        {loading ? 'Đang kết nối...' : <><MdSend /> Chốt đối tác</>}
                    </button>
                </form>
            </div>
        </div>
    );
}