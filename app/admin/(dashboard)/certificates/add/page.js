'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { certificateService } from '@/services/certificateService';
import { MdArrowBack, MdCloudUpload, MdCheck } from 'react-icons/md';
import Link from 'next/link';

export default function AddCertificatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        issue_year: new Date().getFullYear(),
        organization: '',
        status: 1
    });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('issue_year', formData.issue_year);
            data.append('organization', formData.organization);
            data.append('status', formData.status);
            if (file) data.append('image', file);

            await certificateService.create(data);
            router.push('/admin/certificates');
            router.refresh();
        } catch (error) {
            alert("LỖI RỒI ĐẠI CA: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl space-y-12 pb-20 font-archivo">
            {/* 🔴 HEADER NICKELBRONX */}
            <header className="flex justify-between items-end border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">// Verification System</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">THÊM CHỨNG CHỈ<span className="text-orange-600">.</span></h1>
                </div>
                <Link href="/admin/certificates" className="flex items-center gap-2 border-2 border-black px-6 py-3 font-black text-[10px] hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]">
                    <MdArrowBack size={16} /> QUAY LẠI
                </Link>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* CỘT TRÁI: THÔNG TIN */}
                <div className="lg:col-span-7 space-y-8 bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000]">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic">Tên chứng chỉ / Giải thưởng</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border-b-4 border-black py-4 text-2xl font-black outline-none focus:border-orange-600 transition-colors uppercase placeholder:text-gray-200"
                            placeholder="VÍ DỤ: ISO 9001:2015..."
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
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="1">CÔNG KHAI (LIVE)</option>
                                <option value="0">BẢN NHÁP (DRAFT)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic">Tổ chức cấp</label>
                        <input 
                            type="text" 
                            className="w-full border-b-4 border-black py-4 text-xl font-black outline-none focus:border-orange-600 uppercase"
                            placeholder="Tên tổ chức..."
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-black text-white py-6 font-black text-xl shadow-[8px_8px_0_0_#ea580c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-3"
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : <><MdCheck size={24} /> LƯU CHỨNG CHỈ</>}
                    </button>
                </div>

                {/* CỘT PHẢI: UPLOAD ẢNH */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="border-4 border-black p-2 bg-white shadow-[8px_8px_0_0_#000] aspect-[3/4] relative group">
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center text-gray-300 italic">
                                <MdCloudUpload size={64} />
                                <p className="font-black text-[10px] mt-4 uppercase">Chưa có ảnh chứng chỉ</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-[9px] font-black text-center text-gray-400 italic">NHẤN VÀO KHUNG ĐỂ TẢI ẢNH (CHẤP NHẬN: JPG, PNG, WEBP)</p>
                </div>
            </form>
        </div>
    );
}