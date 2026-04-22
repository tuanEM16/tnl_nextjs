import api from '@/lib/api';

export const menuService = {
    /**
     * 1. Lấy danh sách phẳng (Dùng cho bảng quản lý Admin)
     * @param {Object} filters - Bao gồm position (mainmenu/footermenu)
     */
    index: async (position = null) => {
        const res = await api.get('/menus', { 
            params: { position } 
        });
        return res.data; // Trả về: { success: true, data: [...] }
    },

    /**
     * 2. Lấy danh sách dạng cây (Dùng cho Navbar trang chủ)
     */
    getTree: async (position = null) => {
        const res = await api.get('/menus/tree', { 
            params: { position } 
        });
        return res.data;
    },

    /**
     * 3. Lấy chi tiết một mục menu
     */
    show: async (id) => {
        const res = await api.get(`/menus/${id}`);
        return res.data;
    },

    /**
     * 4. Tạo mới menu
     */
    store: async (formData) => {
        const res = await api.post('/menus', formData);
        return res.data;
    },

    /**
     * 5. Cập nhật menu
     */
    update: async (id, formData) => {
        const res = await api.put(`/menus/${id}`, formData);
        return res.data;
    },

    /**
     * 6. Xóa menu
     */
    destroy: async (id) => {
        const res = await api.delete(`/menus/${id}`);
        return res.data;
    },

    /**
     * 7. Cập nhật thứ tự (Reorder)
     * @param {Array} items - Mảng chứa cấu trúc menu mới
     */
    reorder: async (items) => {
        const res = await api.post('/menus/reorder', { items });
        return res.data;
    }
};