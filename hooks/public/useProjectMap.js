'use client';
import { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import api from '@/lib/api';

export const useProjectMap = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await publicService.getProjectLocations();
                const dataArray = res?.data?.data || res?.data || [];
                setLocations(Array.isArray(dataArray) ? dataArray : []);
            } catch (err) {
                console.error('LỖI TẢI BẢN ĐỒ DỰ ÁN:', err.response?.data || err.message);
                setError('Không thể tải dữ liệu bản đồ');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return { locations, loading, error };
};