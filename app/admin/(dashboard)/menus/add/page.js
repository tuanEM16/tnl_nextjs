'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenus } from '@/hooks/useMenus';
import { menuService } from '@/services/menuService';
import MenuForm from '@/components/admin/menu/MenuForm';
import toast from 'react-hot-toast';

export default function AddMenuPage() {
    const router = useRouter();
    const { menus } = useMenus();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            await menuService.store(payload);
            toast.success('THÊM MỚI THÀNH CÔNG!');
            router.push('/admin/menus');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    return <MenuForm menus={menus} onSubmit={handleSubmit} saving={saving} />;
}