import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== HOOK DANH SÁCH USERS ====================
export const useUsers = (initialFilters = { keyword: '', status: '', limit: 10, offset: 0 }) => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const { loading, request: fetchRequest } = useApi(userService.index);

  // 🟢 Dùng useApi cho cả lệnh xóa để hưởng Error Handling tự động
  const { request: deleteRequest } = useApi(userService.destroy);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetchRequest(filters);
      const dataArray = res?.data?.data || res?.data || res || [];
      setUsers(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      // toast.error đã được useApi xử lý hoặc để đây báo tùy đại ca
    }
  }, [filters, fetchRequest]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 🟢 HÀM XÓA "BẢN THÉP": Nhận 2 tham số, không dùng confirm() của browser
  const handleDelete = async (id, name = 'Nhân sự') => {
    try {
      await deleteRequest(id);
      toast.success(`ĐÃ TIÊU HỦY: ${name.toUpperCase()}`);
      fetchUsers(); // 🟢 Tải lại danh sách ngay sau khi dọn rác thành công
    } catch (error) {
      // toast.error('THAO TÁC THẤT BẠI!');
    }
  };

  return { users, loading, filters, setFilter, handleDelete, refresh: fetchUsers };
};

// ==================== HOOK CHI TIẾT USER ====================
export const useUser = (id) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { loading, request: fetchById } = useApi(userService.show);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchById(id);
        // 🟢 FIX: Lấy dữ liệu phẳng
        setUser(res?.data || res);
      } catch (error) {
        toast.error('KHÔNG TÌM THẤY HỒ SƠ');
        router.push('/admin/users');
      }
    };
    load();
  }, [id, fetchById, router]);

  return { user, loading };
};

// ==================== HOOK FORM ADD/EDIT USER ====================
export const useUserForm = (id = null) => {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const [formData, setFormData] = useState({
    name: '', email: '', username: '', password: '', phone: '', status: 1, roles: 'admin',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fetching, setFetching] = useState(!!id);

  const { loading: submitting, request: createRequest } = useApi(userService.store);
  const { loading: updating, request: updateRequest } = useApi(userService.update);
  const { request: fetchById } = useApi(userService.show);

  useEffect(() => {
    if (!id) { setFetching(false); return; }
    const load = async () => {
      try {
        const res = await fetchById(id);
        const user = res?.data || res; // 🟢 FIX: Lấy dữ liệu phẳng

        setFormData({
          name: user.name || '',
          email: user.email || '',
          username: user.username || '',
          password: '',
          phone: user.phone || '',
          status: user.status ?? 1,
          roles: user.roles || 'admin',
        });
        if (user.avatar) {
          setPreview(`${imageUrl}/${user.avatar}`);
        }
      } catch (error) {
        toast.error('Không tìm thấy hồ sơ');
        router.push('/admin/users');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, fetchById, imageUrl, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mật khẩu khi thêm mới
    if (!id && !formData.password.trim()) return toast.error('VUI LÒNG NHẬP MẬT KHẨU');

    try {
      const data = new FormData();

      // 🟢 Lọc dữ liệu trước khi gửi
      Object.keys(formData).forEach(key => {
        // Nếu là Edit và mật khẩu trống thì không gửi field password
        if (id && key === 'password' && !formData.password) return;

        // Tránh gửi null/undefined làm hỏng logic Backend
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      // 🟢 Gửi Avatar (Key phải khớp với upload.single('avatar') ở Backend)
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      if (id) {
        await updateRequest(id, data);
        toast.success('HỒ SƠ NHÂN SỰ ĐÃ ĐƯỢC CẬP NHẬT');
      } else {
        await createRequest(data);
        toast.success('NHÂN SỰ MỚI ĐÃ ĐƯỢC CẤP QUYỀN');
      }

      router.push('/admin/users');
    } catch (error) {
      // Error handling đã có useApi lo
    }
  };

  return {
    formData, avatarFile, preview, fetching,
    loading: submitting || updating,
    handleChange: (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })),
    handleFileChange,
    handleSubmit
  };

};