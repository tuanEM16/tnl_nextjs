// hooks/useProductAttributes.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService'; // Hoặc attributeService tùy đại ca đặt
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// 🟢 1. HOOK LIỆT KÊ & XÓA
export const useAttributes = (initialFilters = { keyword: '' }) => {
    const [attributes, setAttributes] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const { loading, request: fetchRequest } = useApi(productService.getAttributes); // API lấy bảng attribute
    const { request: deleteRequest } = useApi(productService.destroyAttribute);

    const fetchAttributes = useCallback(async () => {
        try {
            const res = await fetchRequest(filters);
            setAttributes(res?.data || res || []);
        } catch (error) {
            toast.error('LỖI TẢI DANH SÁCH THUỘC TÍNH');
        }
    }, [filters, fetchRequest]);

    useEffect(() => { fetchAttributes(); }, [fetchAttributes]);

    const handleDelete = async (id, name) => {
        try {
            await deleteRequest(id);
            toast.success(`ĐÃ TIÊU HỦY THUỘC TÍNH: ${name.toUpperCase()}`);
            fetchAttributes();
        } catch (error) {}
    };

    return { attributes, loading, filters, setFilter: (k, v) => setFilters(p => ({ ...p, [k]: v })), handleDelete };
};

// 🟢 2. HOOK FORM (ADD/EDIT)
export const useAttributeForm = (id = null) => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', sort_order: 0, status: 1 });
    const [fetching, setFetching] = useState(!!id);

    const { loading: submitting, request: submitRequest } = useApi(id ? productService.updateAttribute : productService.storeAttribute);
    const { request: fetchById } = useApi(productService.getAttributeById);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const res = await fetchById(id);
                const data = res?.data || res;
                setFormData({ name: data.name, sort_order: data.sort_order, status: data.status });
            } catch (error) {
                router.push('/admin/products/attributes');
            } finally { setFetching(false); }
        };
        load();
    }, [id, fetchById, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitRequest(id ? id : formData, id ? formData : undefined);
            toast.success(id ? 'CẬP NHẬT THÀNH CÔNG' : 'ĐÃ THÊM THUỘC TÍNH MỚI');
            router.push('/admin/products/attributes');
        } catch (error) {}
    };

    return { 
        formData, fetching, loading: submitting, 
        handleChange: (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value })), 
        handleSubmit 
    };
};