import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useMenus = () => {
    const [menus, setMenus]     = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/menus');
            setMenus(res.data?.data || []);
        } catch (err) {
            console.error('LỖI:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const store   = async (data) => { await api.post('/menus', data); await fetchAll(); };
    const update  = async (id, data) => { await api.put(`/menus/${id}`, data); await fetchAll(); };
    const destroy = async (id) => { await api.delete(`/menus/${id}`); await fetchAll(); };
    const reorder = async (items) => { await api.post('/menus/reorder', { items }); await fetchAll(); };

    return { menus, loading, fetchAll, store, update, destroy, reorder };
};