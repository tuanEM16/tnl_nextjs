import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export const useApi = (apiFunc) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    
    // 🟢 Dùng useRef để "khóa" apiFunc lại, không cho nó thay đổi linh tinh
    const apiRef = useRef(apiFunc);
    apiRef.current = apiFunc;

    const request = useCallback(async (...args) => {
        setLoading(true);
        try {
            // 🟢 Gọi hàm từ Ref để không phụ thuộc vào Dependency Array
            const res = await apiRef.current(...args);
            const result = res?.data || res;
            setData(result);
            return result;
        } catch (err) {
            // 🟢 CHỈ HIỂN THỊ TOAST NẾU KHÔNG PHẢI LỖI 401/403 (Để Interceptor tự xử lý)
            const status = err.response?.status;
            if (status !== 401 && status !== 403) {
                const message = err.response?.data?.message || "LỖI KẾT NỐI HỆ THỐNG";
                toast.error(message.toUpperCase());
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // 🟢 ĐỂ MẢNG RỖNG: Chìa khóa để hàm request không bao giờ bị tạo lại

    return { data, loading, request, setData };
};