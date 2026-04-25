import api from '@/lib/api';

export const partnerService = {
    // 🟢 Lấy danh sách đối tác
    getAll: async () => {
        const res = await api.get('/partners');
        return res.data;
    },

    // 🟢 Lấy chi tiết đối tác
    getById: async (id) => {
        const res = await api.get(`/partners/${id}`);
        return res.data;
    },

    // 🟢 Thêm mới đối tác (Logo)
    create: async (formData) => {
        const res = await api.post('/partners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // 🟢 Cập nhật đối tác
    update: async (id, formData) => {
        const res = await api.put(`/partners/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // 🟢 Xóa đối tác
    delete: async (id) => {
        const res = await api.delete(`/partners/${id}`);
        return res.data;
    },

    // 🟢 Sắp xếp lại thứ tự đối tác
    updateOrder: (ids) => api.put('/partners/reorder', { ids }).then(res => res.data),
};