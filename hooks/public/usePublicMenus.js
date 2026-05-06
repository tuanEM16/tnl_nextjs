'use client';
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';

export const usePublicMenus = (position = 'mainmenu') => {
    const [menus, setMenus]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicService.getMenus(position)
            .then(res => setMenus(res?.data || res || []))
            .catch(err => console.error('LỖI MENU:', err.message))
            .finally(() => setLoading(false));
    }, [position]);

    return { menus, loading };
};