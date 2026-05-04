'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export const useChat = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý tư vấn thép của **Tân Ngọc Lực**. Tôi có thể giúp bạn tìm hiểu về sản phẩm, thông số kỹ thuật hoặc hỗ trợ liên hệ báo giá. Bạn cần tư vấn gì không? 😊'
        }
    ]);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim() || loading) return;

        // Thêm tin nhắn người dùng vào UI ngay lập tức
        const newUserMsg = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);
        setError(null);

        try {
            // Chỉ gửi lịch sử không kể tin nhắn chào mừng đầu tiên (index 0)
            const historyToSend = messages
                .slice(1) // bỏ tin nhắn chào mừng mặc định
                .slice(-10) // giữ 10 tin nhắn gần nhất để tiết kiệm token
                .map(m => ({ role: m.role, content: m.content }));

            const res = await api.post('/chat', {
                message: userMessage,
                history: historyToSend
            });

            // axios tự unwrap .data, backend trả { success, data: { reply } }
            const reply = res.data?.data?.reply;
            if (!reply) throw new Error('Không nhận được phản hồi');

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: reply }
            ]);

        } catch (err) {
            // Lấy message lỗi từ backend nếu có (giống pattern usePublicProducts)
            const errMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
            console.error('LỖI CHATBOX:', errMsg);
            setError(errMsg);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: '⚠️ Xin lỗi, trợ lý đang bận. Vui lòng thử lại hoặc liên hệ hotline **0366 638 969**.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    }, [messages, loading]);

    const clearChat = useCallback(() => {
        setMessages([{
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý tư vấn thép của **Tân Ngọc Lực**. Bạn cần tư vấn gì không? 😊'
        }]);
        setError(null);
    }, []);

    return { messages, loading, error, sendMessage, clearChat };
};