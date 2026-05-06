'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenus } from '@/hooks/useMenus';
import { menuService } from '@/services/menuService';
import MenuForm from '@/components/admin/menu/MenuForm';
import toast from 'react-hot-toast';

export default function EditMenuPage({ params }) {
    const { id } = use(params);
    const router  = useRouter();
    const { menus, loading } = useMenus();
    const [saving, setSaving] = useState(false);

    const menuItem = menus.find(m => String(m.id) === String(id));

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            await menuService.update(id, payload);
            toast.success('CẬP NHẬT THÀNH CÔNG!');
            router.push('/admin/menus');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex items-center justify-center font-black italic text-xs tracking-widest text-gray-300 uppercase">
            LOADING...
        </div>
    );

    if (!menuItem) return (
        <div className="py-20 text-center font-black italic text-xs tracking-widest text-red-400 uppercase">
            KHÔNG TÌM THẤY MENU
        </div>
    );

    return (
        <MenuForm
            initialData={menuItem}
            menus={menus}
            onSubmit={handleSubmit}
            saving={saving}
        />
    );
}