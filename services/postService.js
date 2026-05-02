import api from '@/lib/api';

// 🟢 DÙNG NAMED EXPORT ĐỂ ĐỒNG BỘ CÁI NGOẶC { } Ở MỌI NƠI
export const postService = {
    // 1. LẤY DANH SÁCH & LỌC (Dùng cho cả Admin và Public)
    getAll: async (params = {}) => {
        const res = await api.get('/posts', { params });
        return res.data;
    },

    // 🟢 HÀM QUAN TRỌNG: Lấy bài viết theo Slug vị trí (Fix lỗi Not a function)
    getPostByPageSlug: async (slug) => {
        const res = await api.get(`/posts`, {
            params: { post_type: 'page', page_slug: slug }
        });
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/posts/${id}`);
        return res.data;
    },

    // 2. THAO TÁC BÀI VIẾT (Admin)
    // Gộp 2 hàm create thành 1 bản chuẩn hỗ trợ Upload ảnh
    create: async (data) => {
        const res = await api.post('/posts', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
    uploadEditorImage: async (formData) => {
        const res = await api.post('/posts/upload-content', formData);
        return res.data; // Trả về { filename: '...' }
    },
    update: async (id, data) => {
        const res = await api.put(`/posts/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/posts/${id}`);
        return res.data;
    },

    // 3. THỨ TỰ KÉO THẢ
    updatePostsOrder: (ids) => api.put('/posts/reorder', { ids }).then(res => res.data),

    // 4. QUẢN LÝ DANH MỤC TIN TỨC (post_category)
    getCategories: async () => {
        const res = await api.get('/post-categories');
        return res.data;
    },
    createCategory: (data) => api.post('/post-categories', data).then(res => res.data),
    updateCategory: (id, data) => api.put(`/post-categories/${id}`, data).then(res => res.data),
    deleteCategory: (id) => api.delete(`/post-categories/${id}`).then(res => res.data),

    // 5. QUẢN LÝ VỊ TRÍ TRANG TĨNH (post_page_category)
    getPageCategories: () => api.get('/post-page-categories').then(res => res.data),
    createPageCategory: (data) => api.post('/post-page-categories', data).then(res => res.data),
    deletePageCategory: (id) => api.delete(`/post-page-categories/${id}`).then(res => res.data),
    getAboutSections: () => apiClient.get('/about-sections'),
    getAboutSections: () => api.get('/about-sections').then(res => res.data),
    updateAboutSection: (id, data) => api.put(`/about-sections/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};