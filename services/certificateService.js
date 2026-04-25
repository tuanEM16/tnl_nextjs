import api from '@/lib/api';

export const certificateService = {
    // 🟢 Lấy danh sách chứng chỉ
    getAll: async () => {
        const res = await api.get('/certificates');
        return res.data;
    },

    // 🟢 Lấy chi tiết một chứng chỉ
    getById: async (id) => {
        const res = await api.get(`/certificates/${id}`);
        return res.data;
    },

    // 🟢 Thêm mới (Dùng FormData để đẩy ảnh)
    create: async (formData) => {
        const res = await api.post('/certificates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // 🟢 Cập nhật chứng chỉ
    update: async (id, formData) => {
        const res = await api.put(`/certificates/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // 🟢 Xóa chứng chỉ
    delete: async (id) => {
        const res = await api.delete(`/certificates/${id}`);
        return res.data;
    },

    // 🟢 Sắp xếp lại thứ tự (Kéo thả)
    updateOrder: (ids) => api.put('/certificates/reorder', { ids }).then(res => res.data),
};