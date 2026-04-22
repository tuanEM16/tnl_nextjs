// lib/utils.js

/**
 * Lấy URL ảnh chuẩn từ Server
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder-image.png'; // Ảnh mặc định nếu null
  if (path.startsWith('http')) return path; // Nếu là link ngoài thì giữ nguyên
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${path}`;
};

/**
 * Định dạng ngày tháng kiểu Việt Nam (Vd: 22/04/2026)
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
 * Định dạng tiền tệ (Dành cho báo giá Thép sau này)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};