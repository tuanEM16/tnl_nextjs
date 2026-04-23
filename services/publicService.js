// services/publicService.js
import api from '@/lib/api';

export const publicService = {
    // 1. LẤY DANH MỤC (Đã có)
    getCategories: (params) => api.get('/categories', { params }).then(res => res.data),

    // 🟢 2. LẤY DANH SÁCH SẢN PHẨM (Mới thêm - Giải quyết lỗi của đại ca)
    getProducts: (params) => api.get('/products', { params }).then(res => res.data),

    // 🟢 3. LẤY CHI TIẾT SẢN PHẨM THEO SLUG
    getProductBySlug: (slug) => api.get(`/products/${slug}`).then(res => res.data),

    // 🟢 4. LẤY DANH SÁCH BÀI VIẾT / DỰ ÁN (Dùng cho tin-tuc và du-an)
    getPosts: (params) => api.get('/posts', { params }).then(res => res.data),

    // 🟢 5. LẤY CHI TIẾT BÀI VIẾT THEO SLUG
    getPostBySlug: (slug) => api.get(`/posts/${slug}`).then(res => res.data),

    // 🟢 6. GỬI FORM LIÊN HỆ (Cho trang /lien-he)
    sendContact: (data) => api.post('/contacts', data).then(res => res.data),
};