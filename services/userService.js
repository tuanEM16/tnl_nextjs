import api from '@/lib/api';

export const userService = {
    // 1. Đăng nhập
    login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        return res.data;
    },

    // 2. Quên mật khẩu
    forgotPassword: async (email) => {
        const res = await api.post('/auth/forgot-password', { email });
        return res.data;
    },

    // 3. Đặt lại mật khẩu
    resetPassword: async (token, newPassword) => {
        const res = await api.post('/auth/reset-password', {
            token,
            new_password: newPassword
        });
        return res.data;
    },

    // 🟢 4. LẤY DANH SÁCH (Cái này đang thiếu nè)
    index: async (filters) => {
        const res = await api.get('/users', { params: filters });
        return res.data; // Trả về { success: true, data: { data: [], total: X } }
    },

    // 🟢 5. THÊM MỚI (Dùng cho cả FormData có ảnh)
    store: async (formData) => {
        const res = await api.post('/users', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // 🟢 6. CẬP NHẬT
    update: async (id, formData) => {
        const res = await api.put(`/users/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // 🟢 7. XÓA (SOFT DELETE)
    destroy: async (id) => {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    },

    // 🟢 8. CHI TIẾT
    show: async (id) => {
        const res = await api.get(`/users/${id}`);
        return res.data;
    }
};