import api from '@/lib/api';

export const publicService = {
    // 1. CẤU HÌNH & BANNER
    getConfig: () => api.get('/config').then(res => res.data),
    getBanners: (params = { page: 'home' }) => api.get('/banners', { params }).then(res => res.data),

    // 2. SẢN PHẨM
    getCategories: (params) => api.get('/categories', { params }).then(res => res.data),
    getProducts: (params) => api.get('/products', { params }).then(res => res.data),
    getProductBySlug: (slug) => api.get(`/products/slug/${slug}`).then(res => res.data),

    // 3. DỰ ÁN (PROJECTS) - Dùng chung bảng posts cho chuyên nghiệp
    // Đại ca giữ lại thằng này vì Backend thường quản lý dự án trong bảng posts
    getProjects: () => api.get('/posts?post_type=project').then(res => res.data),
    getProjectBySlug: (slug) => api.get(`/posts/slug/${slug}`).then(res => res.data),

    // 4. TIN TỨC (NEWS/POSTS)
    getPosts: (params) => api.get('/posts', { params }).then(res => res.data),
    getPostBySlug: (slug) => api.get(`/posts/slug/${slug}`).then(res => res.data),

    // 5. LIÊN HỆ
    sendContact: (data) => api.post('/contacts', data).then(res => res.data),

    getPostByPageSlug: async (slug) => {
        try {
            // Đại ca kiểm tra lại URL này có khớp với Route ở Backend không nhé!
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/posts-by-page/${slug}`, {
                next: { revalidate: 3600 } // Tự động làm mới dữ liệu sau 1 giờ (Tùy chọn)
            });

            if (!response.ok) {
                throw new Error('LỖI KHI TRUY XUẤT DỮ LIỆU TRANG TĨNH');
            }

            return await response.json();
        } catch (error) {
            console.error("❌ LỖI publicService:", error.message);
            return { success: false, data: [] };
        }
    }
};