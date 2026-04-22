// hooks/useContacts.js
import { useEffect, useCallback, useState } from 'react';
import { contactService } from '@/services/contactService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useContacts = (filters) => {
    // 1. Quản lý việc lấy danh sách
    const { data: contactsData, loading: fetchLoading, request: fetchRequest } = useApi(contactService.getAll);
    const filterKey = JSON.stringify(filters);
    // 2. Quản lý việc xóa
    const { loading: deleteLoading, request: deleteRequest } = useApi(contactService.delete);

    const refresh = useCallback(async () => {
        await fetchRequest(filters);
    }, [filterKey, fetchRequest]);

    // Debounce tìm kiếm: Đợi filters thay đổi 500ms mới gọi API
    useEffect(() => {
        const handler = setTimeout(() => {
            refresh();
        }, 500);
        return () => clearTimeout(handler);
    }, [refresh]);

    const deleteContact = async (id, name) => {
        try {
            await deleteRequest(id);
            toast.success(`ĐÃ LOẠI BỎ LIÊN HỆ: ${name.toUpperCase()}`);
            refresh();
        } catch (error) { /* useApi đã handle */ }
    };

    return {
        contacts: contactsData?.data || contactsData || [],
        loading: fetchLoading || deleteLoading,
        deleteContact,
        refresh
    };
};
// hooks/useContacts.js (Bổ sung thêm)

/**
 * Hook xử lý chi tiết một yêu cầu liên hệ
 */
export const useContactDetail = (id) => {
    const router = useRouter();
    const [contact, setContact] = useState(null);

    // 1. Hook fetch dữ liệu
    const { loading: fetching, request: fetchRequest } = useApi(contactService.getById);
    
    // 2. Hook cập nhật trạng thái
    const { loading: updating, request: updateRequest } = useApi(contactService.updateStatus);
    
    // 3. Hook xóa
    const { loading: deleting, request: deleteRequest } = useApi(contactService.delete);

    const loadDetail = useCallback(async () => {
        try {
            const res = await fetchRequest(id);
            setContact(res?.data || res);
        } catch (error) {
            router.push('/admin/contacts');
        }
    }, [id, fetchRequest, router]);

    useEffect(() => {
        if (id) loadDetail();
    }, [id, loadDetail]);

    const handleUpdateStatus = async (status = 1) => {
        try {
            await updateRequest(id, status);
            toast.success('ĐÃ ĐÁNH DẤU HOÀN TẤT XỬ LÝ');
            loadDetail(); // Reload lại dữ liệu tại chỗ
        } catch (error) {}
    };

    const handleDelete = async () => {
        try {
            await deleteRequest(id);
            toast.success('ĐÃ XÓA YÊU CẦU VĨNH VIỄN');
            router.push('/admin/contacts');
        } catch (error) {}
    };

    return {
        contact,
        loading: fetching || updating || deleting,
        handleUpdateStatus,
        handleDelete,
        refresh: loadDetail
    };
};