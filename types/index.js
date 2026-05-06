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
    estimate: 'DỰ TOÁN',
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
export const LAYOUT_TYPES = {
    'text': 'Chỉ Văn Bản (Text)',
    'image_left': 'Ảnh Bên Trái (Image Left)',
    'image_right': 'Ảnh Bên Phải (Image Right)',
    'video': 'Video / Đa Phương Tiện'
};

export const ABOUT_LAYOUTS = {
    'hero': 'Khối Hero Banner',
    'vision_mission': 'Khối Tầm Nhìn & Sứ Mệnh',
    'core_values': 'Khối Giá Trị Cốt Lõi',
    'timeline': 'Khối Lịch Sử Hình Thành'
};
// constants dùng chung giữa add/edit/list
export const POSITIONS = [
    { value: 'mainmenu',   label: 'Menu chính (Header)' },
    { value: 'footermenu', label: 'Menu phụ (Footer)' },
];

export const TYPES = [
    { value: 'custom',   label: 'Link tùy chỉnh' },
    { value: 'category', label: 'Danh mục sản phẩm' },
    { value: 'page',     label: 'Trang tĩnh' },
    { value: 'project',  label: 'Dự án' },
    { value: 'post',     label: 'Tin tức' },
];

export const EMPTY_FORM = {
    name: '', link: '', type: 'custom',
    parent_id: 0, sort_order: 0,
    position: 'mainmenu', status: 1, table_id: null
};