// lib/utils.js

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'; // Ảnh mặc định trong folder public
  if (path.startsWith('http')) return path;    // Nếu là link ngoài thì giữ nguyên

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';

  // 1. Đảm bảo path luôn bắt đầu bằng dấu / (Vd: /products/hinh.jpg hoặc /uploads/news/hinh.jpg)
  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 2. LOGIC QUAN TRỌNG:
  // Nếu trong DB đã có sẵn "/uploads" thì KHÔNG thêm nữa.
  // Nếu CHƯA CÓ thì mới thêm "/uploads" vào đầu.
  if (!cleanPath.startsWith('/uploads')) {
    cleanPath = `/uploads${cleanPath}`;
  }

  // Kết quả cuối cùng luôn là: http://localhost:5000/uploads/...
  return `${baseUrl}${cleanPath}`;
};

/**
 * Định dạng ngày tháng kiểu Việt Nam (Vd: 23/04/2026)
 * Dùng cho trang Tin tức và Dự án
 */
export const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Định dạng tiền tệ cho Báo giá Thép
 * Đặc thù ngành thép: Giá biến động nên ưu tiên "Liên hệ báo giá" thay vì hiện 0đ
 */
export const formatCurrency = (amount) => {
  // Nếu giá bằng 0, null hoặc undefined thì báo khách liên hệ trực tiếp
  if (!amount || amount === 0) return "Liên hệ báo giá";

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Tạo Slug từ Tiếng Việt (Dùng cho URL thân thiện SEO)
 * Vd: "Thép Tấm SS400" -> "thep-tam-ss400"
 */
export const slugify = (str) => {
  if (!str) return '';
  str = str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str.split(' ').filter(s => s !== '').join('-').replace(/[^a-z0-0-]/g, '');
};