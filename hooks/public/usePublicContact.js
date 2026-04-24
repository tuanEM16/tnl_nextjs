// hooks/public/usePublicContact.js
import { useState } from 'react';
import { publicService } from '@/services/publicService';
import toast from 'react-hot-toast';

export const usePublicContact = () => { // 🟢 Đổi tên hàm cho khớp tên file
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        content: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await publicService.sendContact(form);
            toast.success('YÊU CẦU ĐÃ ĐƯỢC GỬI ĐẾN BAN QUẢN TRỊ TÂN NGỌC LỰC');
            setForm({ name: '', email: '', phone: '', subject: '', content: '' });
        } catch (error) {
            const msg = error.response?.data?.message || 'GỬI THẤT BẠI - VUI LÒNG KIỂM TRA ĐƯỜNG TRUYỀN';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, handleChange, handleSubmit };
};