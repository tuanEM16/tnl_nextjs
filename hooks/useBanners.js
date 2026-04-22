import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bannerService } from '@/services/bannerService';
import { useApi } from './useApi';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

// 🟢 1. HOOK LẤY DANH SÁCH (LIST)
export const useBanners = (filters) => {
    const { data: bannersData, loading: fetchLoading, request: fetchRequest } = useApi(bannerService.getAll);
    const { loading: deleteLoading, request: deleteRequest } = useApi(bannerService.delete);

    const refresh = useCallback(async () => {
        await fetchRequest(filters);
    }, [filters, fetchRequest]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const deleteBanner = async (id, name) => {
        try {
            await deleteRequest(id);
            toast.success(`ĐÃ LOẠI BỎ: ${name.toUpperCase()}`);
            refresh();
        } catch (error) { /* useApi handle toast */ }
    };

    return {
        // Fix: Nếu backend trả về {data: []} hoặc [] đều nhận hết
        banners: bannersData?.data || bannersData || [],
        loading: fetchLoading || deleteLoading,
        deleteBanner,
        refresh
    };
};

// 🟢 2. HOOK XEM CHI TIẾT (SHOW)
export const useBanner = (id) => {
    const router = useRouter();
    const [banner, setBanner] = useState(null);
    const { loading, request: fetchById } = useApi(bannerService.getById);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const res = await fetchById(id);
                // 🚩 FIX TRẮNG MÀN HÌNH: Backend trả về Object thẳng nên bốc res.data || res
                setBanner(res?.data || res);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DỮ LIỆU VISUAL');
                router.push('/admin/banners');
            }
        };
        load();
    }, [id, fetchById, router]);

    return { banner, loading };
};

// 🟢 3. HOOK XỬ LÝ FORM (ADD / EDIT)
export const useBannerForm = (id = null) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        link: '',
        page: 'home',
        sort_order: 0,
        description: '',
        status: 1,
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [fetching, setFetching] = useState(!!id);

    const { loading: submitting, request: submitRequest } = useApi(
        id ? bannerService.update : bannerService.create
    );
    const { request: fetchById } = useApi(bannerService.getById);

    // Nạp dữ liệu cũ nếu là EDIT
    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const res = await fetchById(id);
                const bannerData = res?.data || res; // 🚩 Fix bốc dữ liệu
                
                setFormData({
                    name: bannerData.name || '',
                    link: bannerData.link || '',
                    page: bannerData.page || 'home',
                    sort_order: bannerData.sort_order ?? 0,
                    description: bannerData.description || '',
                    status: bannerData.status ?? 1,
                });
                
                if (bannerData.image) {
                    setPreview(getImageUrl(bannerData.image));
                }
            } catch (error) {
                router.push('/admin/banners');
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [id, fetchById, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation nhẹ cho Add mode
        if (!id && !imageFile) {
            return toast.error('VUI LÒNG CẤU HÌNH FILE MEDIA (IMAGE)');
        }

        try {
            const data = new FormData();
            if (imageFile) data.append('image', imageFile);
            
            // Đẩy toàn bộ fields vào FormData
            Object.keys(formData).forEach(key => data.append(key, formData[key]));

            if (id) {
                await submitRequest(id, data);
                toast.success('DỮ LIỆU ĐÃ ĐƯỢC TÁI CẤU TRÚC!');
            } else {
                await submitRequest(data);
                toast.success('THIẾT LẬP BANNER MỚI THÀNH CÔNG!');
            }
            router.push('/admin/banners');
        } catch (error) { /* useApi handles toast */ }
    };

    return {
        formData,
        preview,
        fetching,
        loading: submitting,
        handleChange,
        handleImageChange,
        handleSubmit,
    };
};