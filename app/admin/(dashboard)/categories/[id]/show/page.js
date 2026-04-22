'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowBack, MdEdit, MdHistory, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ShowCategoryPage() {
    const router = useRouter();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await categoryService.getById(id);
                setCategory(res.data);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DANH MỤC');
                router.push('/admin/categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, router]);

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-widest text-center">Scanning Database...</div>;
    if (!category) return null;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER BLOCK */}
            <header className="border-b-4 border-black pb-8 flex justify-between items-end">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic">Category Profile / ID: {id}</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none">
                        CHI TIẾT DANH MỤC<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 border-2 border-black px-6 py-4 text-[10px] font-black hover:bg-gray-100 transition-colors"
                    >
                        <MdArrowBack size={18} /> QUAY LẠI
                    </button>
                    <Link
                        href={`/admin/categories/${id}/edit`}
                        className="flex items-center gap-2 bg-black text-white px-8 py-4 text-[10px] font-black hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]"
                    >
                        <MdEdit size={18} /> CHỈNH SỬA
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* LEFT: IMAGE & STATUS */}
                <div className="space-y-8">
                    <div className="border-4 border-black p-1 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="relative aspect-square w-full bg-gray-100">
                            {category.image ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${category.image}`}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                    <span className="font-black italic text-4xl">NO MEDIA</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-2 border-black p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-black/10 pb-2">
                            <span className="text-[10px] font-black text-gray-400 italic">Trạng thái</span>
                            <span className={`px-4 py-1 text-[10px] font-black tracking-widest ${category.status === 1 ? 'bg-green-500 text-white' : 'bg-red-600 text-white'}`}>
                                {category.status === 1 ? 'ACTIVE' : 'DISABLED'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 italic">Thứ tự hiển thị</span>
                            <span className="font-black text-xl italic">{category.sort_order}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: DATA GRID */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-orange-600 tracking-widest">Tên danh mục thép</label>
                            <h2 className="text-6xl font-black tracking-tighter leading-tight border-b-2 border-black pb-4">{category.name}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 tracking-widest italic">Hệ thống Slug</label>
                                <p className="font-bold text-lg bg-gray-100 p-4 border-l-4 border-black">{category.slug}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 tracking-widest italic">Cấp độ (Parent ID)</label>
                                <p className="font-bold text-lg p-4 border-b-2 border-black/10">
                                    {category.parent_id === 0 ? 'DANH MỤC GỐC' : `ID CHA: ${category.parent_id}`}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 tracking-widest italic">Mô tả hệ thống</label>
                        <div className="bg-white border-2 border-black p-8 font-medium normal-case leading-relaxed text-gray-700 min-h-[150px]">
                            {category.description || 'KHÔNG CÓ DỮ LIỆU MÔ TẢ CHO DANH MỤC NÀY.'}
                        </div>
                    </section>

                    {/* META INFO */}
                    <footer className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-black/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-black text-white p-3"><MdHistory size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 italic uppercase">Ngày khởi tạo hệ thống</p>
                                <p className="font-black text-xs">{new Date(category.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-600 text-white p-3"><MdPerson size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 italic uppercase">Nhân sự quản lý (ID)</p>
                                <p className="font-black text-xs">ADMIN_USER_{category.created_by}</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}