'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/services/postService';
import { MdAdd, MdSearch, MdCategory, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        post_type: 'post',
        category_id: '',
        keyword: '',
    });

    const postTypeLabels = {
        post: 'TIN TỨC',
        page: 'TRANG TĨNH',
        project: 'DỰ ÁN',
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await postService.getAll(filters);
            setPosts(res.data || []);
        } catch (error) {
            toast.error('KHÔNG THỂ TẢI DANH SÁCH BÀI VIẾT');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await postService.getCategories();
            setCategories(res.data || []);
        } catch (error) {
            console.error('Lỗi tải danh mục');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [filters]);


    const handleTypeChange = (type) => {
        setFilters({
            ...filters,
            post_type: type,
            category_id: '' // 🟢 Reset về rỗng để không bị lỗi lọc chéo
        });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`XÁC NHẬN XÓA: ${title.toUpperCase()}?`)) {
            try {
                await postService.delete(id);
                toast.success('ĐÃ XÓA BÀI VIẾT');
                fetchPosts();
            } catch (error) {
                toast.error('XÓA THẤT BẠI');
            }
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Style */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">
                        Content Management System
                    </p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">
                        BÀI VIẾT<span className="text-orange-600">.</span>
                    </h1>
                </div>
                
                <div className="flex gap-4">
                    <Link
                        href="/admin/posts/categories"
                        className="flex items-center gap-2 border-2 border-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px]"
                    >
                        <MdCategory size={16} /> Danh mục
                    </Link>
                    <Link
                        href="/admin/posts/add"
                        className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]"
                    >
                        <MdAdd size={18} /> Thêm mới
                    </Link>
                </div>
            </header>

            {/* BỘ LỌC - ĐÃ FIX LỖI CẤU TRÚC */}
            <div className="bg-white border-2 border-black p-6 flex flex-wrap items-center gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Selector Loại bài */}
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-400 italic">PHÂN LOẠI</span>
                    <div className="flex border-2 border-black p-1 gap-1 bg-gray-50">
                        {Object.keys(postTypeLabels).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)} // 🔥 Gọi hàm fix ở đây
                                className={`px-6 py-2 text-[10px] font-black transition-all ${
                                    filters.post_type === type 
                                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]' 
                                    : 'hover:bg-gray-200 text-gray-400'
                                }`}
                            >
                                {postTypeLabels[type]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh mục (Chỉ hiện rõ khi là Tin tức) */}
                <div className={`flex flex-col gap-2 transition-opacity duration-300 ${filters.post_type !== 'post' ? 'opacity-30' : 'opacity-100'}`}>
                    <span className="text-[9px] font-black text-gray-400 italic">DANH MỤC TIN</span>
                    <select
                        name="category_id"
                        value={filters.category_id}
                        onChange={handleFilterChange}
                        disabled={filters.post_type !== 'post'}
                        className="border-b-4 border-black bg-transparent py-2 text-[10px] font-black uppercase focus:outline-none min-w-[200px] cursor-pointer"
                    >
                        <option value="">TẤT CẢ DANH MỤC</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {/* Ô tìm kiếm */}
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-400 italic">TÌM KIẾM THEO TÊU ĐỀ</span>
                    <div className="relative group">
                        <MdSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-black" size={20} />
                        <input
                            type="text"
                            name="keyword"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                            placeholder="GÕ TỪ KHÓA..."
                            className="w-full pl-8 py-2 border-b-4 border-black bg-transparent text-sm font-black uppercase placeholder:text-gray-200 focus:outline-none focus:border-orange-600 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* DANH SÁCH BẢNG */}
            <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10">Media</th>
                            <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10">Tiêu đề & Slug</th>
                            <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10">Phân loại</th>
                            <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10 text-center">Trạng thái</th>
                            <th className="p-6 text-[10px] font-black tracking-widest uppercase text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-20 text-center font-black uppercase italic tracking-widest animate-pulse">Syncing Database...</td>
                            </tr>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.id} className="group hover:bg-orange-50 transition-colors">
                                    <td className="p-6 border-r border-black/5">
                                        <div className="w-24 h-16 bg-gray-100 border-2 border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm">
                                            {post.image ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${post.image}`}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300">NO_MEDIA</div>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className="p-6 border-r border-black/5">
                                        <Link href={`/admin/posts/${post.id}/show`} className="block font-black text-2xl tracking-tighter uppercase leading-none hover:text-orange-600 transition-colors">
                                            {post.title}
                                        </Link>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 block italic">
                                            ID: {post.id} / SLUG: {post.slug}
                                        </span>
                                    </td>

                                    <td className="p-6 border-r border-black/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 w-fit uppercase">{postTypeLabels[post.post_type]}</span>
                                            <span className="text-[10px] font-black text-orange-600 italic tracking-tighter">{post.category_name || 'UNCLASSIFIED'}</span>
                                        </div>
                                    </td>

                                    <td className="p-6 border-r border-black/5 text-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                                            post.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                                        }`}>
                                            {post.status === 1 ? 'LIVE' : 'DRAFT'}
                                        </span>
                                    </td>

                                    <td className="p-6">
                                        <div className="flex justify-end gap-6 text-black">
                                            <Link href={`/admin/posts/${post.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125"><MdVisibility size={22}/></Link>
                                            <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-indigo-600 transition-transform hover:scale-125"><MdEdit size={22}/></Link>
                                            <button 
                                                onClick={() => handleDelete(post.id, post.title)} 
                                                className="hover:text-red-600 transition-transform hover:scale-125"
                                            >
                                                <MdDelete size={22}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <MdSearch size={64} />
                                        <p className="font-black text-xl italic tracking-widest">ZERO RESULTS IN THIS CATEGORY</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}