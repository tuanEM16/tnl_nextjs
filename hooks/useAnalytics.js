import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useAnalytics = (initialDays = 30) => {
    const [days, setDays]           = useState(initialDays);
    const [summary, setSummary]     = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading]     = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [sumRes, topRes, chartRes] = await Promise.all([
                api.get(`/analytics/summary?days=${days}`),
                api.get(`/analytics/top-products?days=${days}`),
                api.get(`/analytics/chart?days=${days}`)
            ]);
            setSummary(sumRes.data?.data     || null);
            setTopProducts(topRes.data?.data || []);
            setChartData(chartRes.data?.data || []);
        } catch (err) {
            console.error('LỖI ANALYTICS:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    return { summary, topProducts, chartData, loading, days, setDays, refetch: fetchAll };
};