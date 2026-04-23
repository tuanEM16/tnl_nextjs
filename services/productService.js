import api from '@/lib/api'; // 🔥 Tên biến ở đây là 'api'

export const productService = {

    getAll: (params) => api.get('/products', { params }).then(res => res.data),
    getById: (id) => api.get(`/products/${id}`).then(res => res.data),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`).then(res => res.data),

    create: (formData) => {

        return api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => res.data);
    },


    update: async (id, data) => {

        return api.put(`/products/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => res.data);
    },

    delete: (id) => api.delete(`/products/${id}`).then(res => res.data),

    getAttributes: () => api.get('/attributes').then(res => res.data),
    getAttributeById: (id) => api.get(`/attributes/${id}`).then(res => res.data), // Thêm hàm này để Edit load được dữ liệu
    storeAttribute: (data) => api.post('/attributes', data).then(res => res.data),
    updateAttribute: (id, data) => api.put(`/attributes/${id}`, data).then(res => res.data),
    destroyAttribute: (id) => api.delete(`/attributes/${id}`).then(res => res.data),
};