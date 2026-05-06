'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdLink, MdLayers, MdMenuOpen, MdSettings, MdArrowBack } from 'react-icons/md';
import { POSITIONS, TYPES } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Endpoint lấy options theo type
const TYPE_ENDPOINTS = {
    category: '/categories',
    page: '/posts?post_type=page&limit=100',
    project: '/posts?post_type=project&limit=100',
    post: '/post-categories',
};

export default function MenuForm({ initialData = null, menus = [], onSubmit, saving }) {
    const router = useRouter();
    const isEdit = !!initialData;

    const [form, setForm] = useState({
        name: initialData?.name || '',
        link: initialData?.link || '',
        type: initialData?.type === 'post' ? 'page' : (initialData?.type || 'custom'),
        parent_id: initialData?.parent_id || 0,
        sort_order: initialData?.sort_order || 0,
        position: initialData?.position || 'mainmenu',
        status: initialData?.status !== undefined ? initialData.status : 1,
        table_id: initialData?.table_id || null,
    });

    const [tableOptions, setTableOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Load options khi đổi type
    useEffect(() => {
        if (form.type === 'custom') {
            setTableOptions([]);
            return;
        }
        setLoadingOptions(true);
        api.get(TYPE_ENDPOINTS[form.type])
            .then(res => {
                const data = res.data?.data || res.data || [];
                setTableOptions(data);
            })
            .catch(() => setTableOptions([]))
            .finally(() => setLoadingOptions(false));
    }, [form.type]);

    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleTypeChange = (e) => {
        setForm(p => ({ ...p, type: e.target.value, table_id: null, link: '' }));
    };

    // Khi chọn table_id → tự động điền link
    const handleTableSelect = (e) => {
        const id = e.target.value;
        const selected = tableOptions.find(o => String(o.id) === String(id));
        if (!selected) return;

        let autoLink = '';
        if (form.type === 'category') autoLink = `/products?category=${selected.slug}`;
        // Thay vì /#${selected.slug} thì sếp bắt buộc phải chèn /about vào:
        if (form.type === 'page') autoLink = `/about#${selected.slug}`;
        if (form.type === 'project') autoLink = `/projects/${selected.slug}`;
        if (form.type === 'post') autoLink = `/news?category=${selected.slug}`;

        setForm(p => ({ ...p, table_id: id, link: autoLink }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            type: form.type,
            parent_id: parseInt(form.parent_id) || 0,
            sort_order: parseInt(form.sort_order) || 0,
            table_id: form.type !== 'custom' ? (form.table_id || null) : null,
        };
        await onSubmit(payload);
    };

    const parentOptions = menus.filter(m =>
        parseInt(m.parent_id) === 0 && m.id !== initialData?.id
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 font-archivo uppercase">
            <button
                onClick={() => router.push('/admin/menus')}
                className="group flex items-center gap-3 font-black text-xs tracking-[0.3em] hover:text-orange-600 transition-all"
            >
                <MdArrowBack size={24} className="group-hover:-translate-x-2 transition-transform" />
                HUỶ BỎ VÀ TRỞ LẠI
            </button>

            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-orange-600 translate-x-4 translate-y-4 -z-10 border-4 border-black group-hover:translate-x-6 group-hover:translate-y-6 transition-all" />

                <div className="bg-white border-[6px] border-black p-12 space-y-12">
                    {/* Header form */}
                    <div className="border-b-[6px] border-black pb-8 flex items-center gap-6">
                        <div className="bg-black text-white p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]">
                            <MdMenuOpen size={36} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter italic leading-none">
                                {isEdit ? 'HIỆU CHỈNH ĐIỀU HƯỚNG' : 'KHỞI TẠO LIÊN KẾT'}
                                <span className="text-orange-600">_</span>
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 mt-2 tracking-[0.4em]">Configure Sitemap Parameters</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Tên */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLayers /> DISPLAY LABEL
                            </label>
                            <input
                                required value={form.name} onChange={set('name')}
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-orange-50 transition-all"
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLink /> TARGET ENDPOINT
                            </label>
                            <input
                                required value={form.link} onChange={set('link')}
                                placeholder="/products"
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-black focus:text-white transition-all lowercase"
                            />

                            {form.type === 'custom' && (
                                <div className="mt-3 border-[4px] border-black bg-zinc-50 p-4 shadow-[4px_4px_0_0_#000]">
                                    <h4 className="text-[10px] font-black text-[#e33127] mb-2 uppercase tracking-widest">Chọn nhanh Link Hệ Thống:</h4>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) setForm(p => ({ ...p, link: e.target.value }));
                                        }}
                                        className="w-full border-2 border-black p-3 font-black text-sm bg-white outline-none cursor-pointer"
                                    >
                                        <option value="">-- Sổ xuống để chọn --</option>
                                        <option value="/">Trang chủ (/)</option>
                                        <option value="/about">Giới thiệu (/about)</option>
                                        <option value="/products">Sản phẩm (/products)</option>
                                        <option value="/projects">Dự án (/projects)</option>
                                        <option value="/estimate">Dự toán (/estimate)</option>
                                        <option value="/news">Tin tức (/news)</option>
                                        <option value="/contact">Liên hệ (/contact)</option>
                                    </select>
                                    <p className="text-[9px] text-gray-500 font-bold italic mt-2 leading-tight">
                                        * Mẹo: Chọn để tự động điền, hoặc lười thì nhập link thẳng vào ô đen bên trên.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Link Architecture</label>
                            <select value={form.type} onChange={handleTypeChange}
                                className="w-full border-4 border-black p-5 font-black text-sm bg-white outline-none cursor-pointer">
                                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>

                        {/* Table ID — chỉ hiện khi type khác custom */}
                        {form.type !== 'custom' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 italic uppercase">
                                    Liên kết tới {loadingOptions && '(đang tải...)'}
                                </label>
                                <select
                                    value={form.table_id || ''}
                                    onChange={handleTableSelect}
                                    className="w-full border-4 border-black p-5 font-black text-sm bg-orange-50 outline-none"
                                >
                                    <option value="">-- Chọn --</option>
                                    {tableOptions.map(opt => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.name || opt.title}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[9px] text-gray-400 italic font-bold">
                                    * Chọn để tự động điền link, hoặc nhập link tay bên trên
                                </p>
                            </div>
                        )}

                        {/* Parent */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic">HIERARCHY NODE (PARENT)</label>
                            <select
                                value={form.parent_id}
                                onChange={e => setForm(p => ({ ...p, parent_id: parseInt(e.target.value) }))}
                                className="w-full border-4 border-black p-5 font-black text-sm outline-none bg-white cursor-pointer appearance-none hover:bg-gray-50 transition-colors"
                            >
                                <option value={0}>-- CẤP GỐC (ROOT LEVEL) --</option>
                                {parentOptions.map(parent => (
                                    <option key={parent.id} value={parent.id}>BRANCH: {parent.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort order */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdSettings /> SORT SEQUENCE
                            </label>
                            <input
                                type="number" value={form.sort_order}
                                onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                                className="w-full border-4 border-black p-5 font-black text-xl outline-none focus:bg-orange-50 transition-all"
                            />
                        </div>

                        {/* Position */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Deployment Area</label>
                            <select value={form.position} onChange={set('position')}
                                className="w-full border-4 border-black p-5 font-black text-sm bg-orange-50 outline-none">
                                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic uppercase">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm(p => ({ ...p, status: parseInt(e.target.value) }))}
                                className="w-full border-4 border-black p-5 font-black text-sm bg-white outline-none"
                            >
                                <option value={1}>Hiển thị</option>
                                <option value={0}>Ẩn</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-10 border-t-[6px] border-black">
                        <button
                            disabled={saving} type="submit"
                            className="group relative w-full bg-black text-white py-8 font-black text-2xl uppercase tracking-[0.5em] transition-all hover:bg-orange-600 active:translate-x-2 active:translate-y-2 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-6">
                                {saving ? 'SYNCING...' : 'COMMIT CHANGES →'}
                            </span>
                            <div className="absolute inset-0 translate-x-3 translate-y-3 border-4 border-black -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform bg-white" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}