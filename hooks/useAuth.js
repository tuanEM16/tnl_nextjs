// hooks/useAuthForms.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { configService } from '@/services/configService';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== NGÔN NGỮ ====================
export const useAuthTranslations = () => {
    const [language, setLanguage] = useState('vi');

    const trans = {
        vi: {
            gateway: "CỔNG TRUY CẬP BẢO MẬT",
            user_label: "Tên định danh",
            pass_label: "Mật mã truy cập",
            user_placeholder: "NHẬP TÊN ĐĂNG NHẬP",
            pass_placeholder: "NHẬP MẬT KHẨU",
            remember: "Ghi nhớ",
            forgot: "Quên mật khẩu?",
            btn_login: "ĐĂNG NHẬP HỆ THỐNG →",
            btn_loading: "ĐANG XÁC THỰC...",
            footer: "Hệ thống quản trị nội bộ // v2.1.0",
            error: "SAI TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU",
            success: "XÁC THỰC THÀNH CÔNG",
            forgot_title: "KHÔI PHỤC MẬT MÃ",
            forgot_subtitle: "Hệ thống sẽ gửi mã xác thực đến Email của bạn",
            email_label: "Địa chỉ Email đăng ký",
            email_placeholder: "NHẬP EMAIL CỦA BẠN",
            btn_send: "GỬI YÊU CẦU PHỤC HỒI →",
            btn_sending: "ĐANG KIỂM TRA...",
            back: "Quay lại đăng nhập",
            forgot_success: "Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư.",
            forgot_error: "Email không tồn tại trong hệ thống!",
            reset_title: "MẬT KHẨU MỚI",
            reset_subtitle: "Nhập mật khẩu mới cho tài khoản của bạn",
            new_pass: "NHẬP MẬT KHẨU MỚI",
            confirm_pass: "XÁC NHẬN MẬT KHẨU",
            btn_reset: "CẬP NHẬT MẬT MÃ →",
            reset_success: "ĐỔI MẬT KHẨU THÀNH CÔNG!",
            reset_error: "MÃ XÁC THỰC KHÔNG HỢP LỆ HOẶC HẾT HẠN",
            mismatch: "MẬT KHẨU NHẬP LẠI KHÔNG KHỚP!"
        },
        en: {
            gateway: "SECURE ACCESS GATEWAY",
            user_label: "Identity Name",
            pass_label: "Access Password",
            user_placeholder: "ENTER USERNAME",
            pass_placeholder: "ENTER PASSWORD",
            remember: "Remember me",
            forgot: "Forgot password?",
            btn_login: "SYSTEM LOGIN →",
            btn_loading: "AUTHENTICATING...",
            footer: "Internal Management Terminal // v2.1.0",
            error: "INVALID USERNAME OR PASSWORD",
            success: "AUTHENTICATION SUCCESS",
            forgot_title: "PASSWORD RECOVERY",
            forgot_subtitle: "An authentication code will be sent to your Email",
            email_label: "Registered Email Address",
            email_placeholder: "ENTER YOUR EMAIL",
            btn_send: "SEND RECOVERY REQUEST →",
            btn_sending: "CHECKING...",
            back: "Back to login",
            forgot_success: "Request sent! Please check your inbox.",
            forgot_error: "Email not found in our system!",
            reset_title: "NEW PASSWORD",
            reset_subtitle: "Enter new password for your account",
            new_pass: "ENTER NEW PASSWORD",
            confirm_pass: "CONFIRM PASSWORD",
            btn_reset: "UPDATE PASSWORD →",
            reset_success: "PASSWORD CHANGED SUCCESSFULLY!",
            reset_error: "INVALID OR EXPIRED TOKEN",
            mismatch: "PASSWORDS DO NOT MATCH!"
        }
    };

    return { language, setLanguage, t: trans[language] };
};

// hooks/useAuthForms.js

// ... (useAuthTranslations giữ nguyên) ...

// ==================== CONFIGS (Bản chống lỗi data) ====================
// hooks/useAuthForms.js
export const useAuthConfigs = () => {
    const [configs, setConfigs] = useState({ site_name: 'TÂN NGỌC LỰC STEEL', logo: '' });
    const { request: fetchConfigs } = useApi(configService.getAll);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchConfigs();
                const rawData = res?.data || res;
                const data = Array.isArray(rawData) ? rawData[0] : rawData;
                if (data) {
                    setConfigs({
                        site_name: data.site_name || 'TÂN NGỌC LỰC STEEL',
                        logo: data.logo || ''
                    });
                }
            } catch (error) {
                console.warn("Using default configs");
            }
        };
        load();
    }, []); // 🟢 ĐỔI THÀNH MẢNG RỖNG: Để nó chỉ chạy 1 lần lúc mount.

    return configs;
};

// ==================== HOOK ĐĂNG NHẬP (Đã tối ưu) ====================
export const useLogin = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { language, setLanguage, t } = useAuthTranslations();
    const configs = useAuthConfigs();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // TRONG hooks/useAuthForms.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Chờ login xong để User state được set trong Context
            const res = await login(username, password, rememberMe);

            // 2. Chỉ khi success mới nhảy trang
            if (res.success) {
                toast.success(t.success);
                // Dùng replace để không quay lại trang login bằng nút Back được
                router.replace('/admin/dashboard');
            }
        } catch (error) {
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    return {
        username, setUsername, password, setPassword, rememberMe, setRememberMe,
        loading, language, setLanguage, t, configs, handleSubmit
    };
};

// ... (Các Hook còn lại đại ca bốc dữ liệu tương tự: res?.data || res) ...

// ==================== HOOK QUÊN MẬT KHẨU ====================
export const useForgotPassword = () => {
    const { language, setLanguage, t } = useAuthTranslations();
    const configs = useAuthConfigs();
    const { loading: submitting, request: forgotRequest } = useApi(userService.forgotPassword);

    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotRequest(email);
            setIsSent(true);
            toast.success(t.forgot_success);
        } catch (error) {
            console.log("Error object:", error);
            const msg = error.response?.data?.message || error.message || "Lỗi kết nối Server!";
            toast.error(msg);
        }
    };

    return {
        email, setEmail,
        isSent, setIsSent,
        loading: submitting,
        language, setLanguage,
        t,
        configs,
        handleSubmit
    };
};

// ==================== HOOK ĐẶT LẠI MẬT KHẨU ====================
export const useResetPassword = (token) => {
    const router = useRouter();
    const { language, setLanguage, t } = useAuthTranslations();
    const configs = useAuthConfigs();
    const { loading, request: resetRequest } = useApi(userService.resetPassword);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error(t.mismatch);
        }
        if (!token) return toast.error(t.reset_error);

        try {
            await resetRequest(token, password);
            toast.success(t.reset_success);
            setTimeout(() => router.push('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || t.reset_error);
        }
    };

    return {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading,
        language, setLanguage,
        t,
        configs,
        handleSubmit
    };
};