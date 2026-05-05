import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useProjectLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading]     = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/project-locations');
            setLocations(res.data?.data || []);
        } catch (err) {
            console.error('LỖI:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const store = async (data) => {
        const res = await api.post('/project-locations', data);
        await fetchAll();
        return res.data;
    };

    const update = async (id, data) => {
        const res = await api.put(`/project-locations/${id}`, data);
        await fetchAll();
        return res.data;
    };

    const destroy = async (id) => {
        const res = await api.delete(`/project-locations/${id}`);
        await fetchAll();
        return res.data;
    };

    const getAvailablePosts = async () => {
        const res = await api.get('/project-locations/available-posts');
        return res.data?.data || [];
    };

    return { locations, loading, fetchAll, store, update, destroy, getAvailablePosts };
};