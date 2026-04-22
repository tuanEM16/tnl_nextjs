import api from '@/lib/api';
import axiosClient from '@/lib/api';
export const postService = {

    getAll: async (params = {}) => {
        const res = await api.get('/posts', { params });
        return res.data;
    },

    getCategories: async () => {
        const res = await api.get('/post-categories');
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/posts/${id}`);
        return res.data;
    },

    create: async (formData) => {
        const res = await api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },


    update: async (id, data) => {

        return axiosClient.put(`/posts/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    create: async (data) => {
        return axiosClient.post('/posts', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: async (id) => {
        const res = await api.delete(`/posts/${id}`);
        return res.data;
    },

    createCategory: async (data) => {
        const res = await api.post('/post-categories', data);
        return res.data;
    },
    updateCategory: async (id, data) => {
        const res = await api.put(`/post-categories/${id}`, data);
        return res.data;
    },
    deleteCategory: async (id) => {
        const res = await api.delete(`/post-categories/${id}`);
        return res.data;
    },
};