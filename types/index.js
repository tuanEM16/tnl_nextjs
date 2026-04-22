// ==========================================
// 1. BANNER CONFIGURATION
// ==========================================
export const BANNER_PAGES = {
    home: 'TRANG CHỦ',
    product: 'SẢN PHẨM',
    product_detail: 'CHI TIẾT SP',
    about: 'GIỚI THIỆU',
    project: 'DỰ ÁN',
    news: 'TRUYỀN THÔNG',
    contact: 'LIÊN HỆ',
};

// ==========================================
// 2. PRODUCT CONFIGURATION (Dành cho Thép/Nội thất)
// ==========================================
export const PRODUCT_STATUS = {
    1: 'ĐANG KINH DOANH',
    0: 'TẠM NGỪNG',
    2: 'HẾT HÀNG',
};

export const PRODUCT_UNITS = {
    kg: 'KG (KÝ)',
    ton: 'TẤN',
    meter: 'MÉT',
    sheet: 'TẤM / CÂY',
    piece: 'CÁI / CHIẾC',
};

// ==========================================
// 3. POST & CATEGORY CONFIGURATION
// ==========================================
// types/index.js
export const POST_TYPES = {
    post: 'TIN TỨC',
    page: 'TRANG TĨNH',
    project: 'DỰ ÁN',
};


export const CATEGORY_TYPES = {
    product: 'DANH MỤC SẢN PHẨM',
    post: 'DANH MỤC BÀI VIẾT',
};

// ==========================================
// 4. USER & PERMISSION CONFIGURATION
// ==========================================
export const USER_ROLES = {
    super_admin: 'QUẢN TRỊ CẤP CAO',
    admin: 'QUẢN TRỊ VIÊN',
    staff: 'NHÂN VIÊN VẬN HÀNH',
};

export const USER_STATUS = {
    1: 'ĐANG HOẠT ĐỘNG',
    0: 'ĐANG KHÓA',
};

// ==========================================
// 5. CONTACT & ORDER CONFIGURATION
// ==========================================
export const CONTACT_STATUS = {
    0: 'MỚI TIẾP NHẬN',
    1: 'ĐANG XỬ LÝ',
    2: 'ĐÃ HOÀN TẤT',
    3: 'HỦY BỎ / SPAM',
};

// ==========================================
// 6. SYSTEM UI CONFIG (Dùng cho AdminForm/Table)
// ==========================================
export const GLOBAL_STATUS = {
    1: 'HIỂN THỊ (LIVE)',
    0: 'TẠM ẨN (HIDDEN)',
};