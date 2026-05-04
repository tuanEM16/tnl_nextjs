'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/public/useChat';

// Render markdown đơn giản: **bold**, link /products/slug
const renderContent = (text) => {
    const parts = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(
            /\[([^\]]+)\]\((\/[^)]+)\)/g,
            '<a href="$2" class="tnl-chat-link" target="_self">$1</a>'
        )
        .replace(/\/products\/([a-z0-9-]+)/g,
            '<a href="/products/$1" class="tnl-chat-link">Xem sản phẩm</a>'
        );
    return <span dangerouslySetInnerHTML={{ __html: parts }} />;
};

// Gợi ý câu hỏi nhanh
const QUICK_SUGGESTIONS = [
    'Thép hộp 50x50 dùng cho công trình gì?',
    'Phân biệt thép D16 và D20',
    'Báo giá thép tấm',
    'Công ty có giao hàng Tây Ninh không?'
];

export default function ChatBox() {
    const [isOpen, setIsOpen]       = useState(false);
    const [input, setInput]         = useState('');
    const [showSuggest, setShowSuggest] = useState(true);
    const { messages, loading, sendMessage, clearChat } = useChat();
    const messagesEndRef = useRef(null);
    const inputRef       = useRef(null);

    // Tự cuộn xuống tin mới nhất
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focus input khi mở chat
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        setShowSuggest(false);
        const msg = input;
        setInput('');
        await sendMessage(msg);
    };

    const handleSuggestion = async (text) => {
        setShowSuggest(false);
        setInput('');
        await sendMessage(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* ── Bong bóng chào mừng (Hiện khi chưa mở chat) ── */}
            {!isOpen && (
                <div 
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '38px',
                        right: '96px',
                        zIndex: 9998,
                        background: '#ffffff',
                        padding: '10px 16px',
                        borderRadius: '20px 20px 0px 20px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        color: '#c8371a',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        animation: 'tnlFloat 3s ease-in-out infinite',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    👋 Bạn cần tư vấn?
                </div>
            )}

            {/* ── Nút mở chatbox ── */}
            <button
                onClick={() => setIsOpen(o => !o)}
                aria-label="Mở trợ lý tư vấn"
                style={{
                    position:     'fixed',
                    bottom:       '24px',
                    right:        '24px',
                    zIndex:       9999,
                    width:        '60px',
                    height:       '60px',
                    borderRadius: '50%',
                    background:   '#c8371a',
                    border:       'none',
                    cursor:       'pointer',
                    boxShadow:    '0 4px 16px rgba(200,55,26,0.4)',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    transition:   'transform 0.2s, background 0.2s',
                    // Kích hoạt hiệu ứng gợn sóng khi khung chat đang đóng
                    animation:    isOpen ? 'none' : 'tnlPulse 2s infinite',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.animation = 'none'; // Tắt gợn sóng khi hover vào
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    if (!isOpen) e.currentTarget.style.animation = 'tnlPulse 2s infinite';
                }}
            >
                {isOpen ? (
                    // Icon X
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                ) : (
                    // Icon chat với hiệu ứng lắc nhẹ
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'tnlWiggle 3s infinite' }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                )}

                {/* Badge số tin chưa đọc — hiện khi đóng */}
                {!isOpen && messages.length > 1 && (
                    <span style={{
                        position:   'absolute',
                        top:        '-2px',
                        right:      '-2px',
                        background: '#facc15',
                        color:      '#78350f',
                        fontSize:   '12px',
                        fontWeight: '800',
                        borderRadius: '50%',
                        width:      '22px',
                        height:     '22px',
                        display:    'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border:     '2px solid #fff'
                    }}>
                        {messages.length - 1}
                    </span>
                )}
            </button>

            {/* ── Cửa sổ chat ── */}
            {isOpen && (
                <div style={{
                    position:      'fixed',
                    bottom:        '100px',
                    right:         '24px',
                    zIndex:        9998,
                    width:         '360px',
                    maxHeight:     '520px',
                    display:       'flex',
                    flexDirection: 'column',
                    background:    '#ffffff',
                    borderRadius:  '16px',
                    boxShadow:     '0 12px 40px rgba(0,0,0,0.2)',
                    overflow:      'hidden',
                    fontFamily:    'system-ui, sans-serif',
                    animation:     'tnlSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformOrigin: 'bottom right'
                }}>

                    {/* Header */}
                    <div style={{
                        background:  'linear-gradient(135deg, #c8371a 0%, #a02d14 100%)',
                        padding:     '14px 16px',
                        display:     'flex',
                        alignItems:  'center',
                        gap:         '10px',
                    }}>
                        <div style={{
                            width:        '36px',
                            height:       '36px',
                            borderRadius: '50%',
                            background:   'rgba(255,255,255,0.2)',
                            display:      'flex',
                            alignItems:   'center',
                            justifyContent: 'center',
                            flexShrink:   0
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px', lineHeight: 1.2 }}>
                                Trợ lý Tân Ngọc Lực
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>
                                Tư vấn thép xây dựng
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            title="Xóa lịch sử chat"
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border:     'none',
                                borderRadius: '6px',
                                padding:    '4px 8px',
                                cursor:     'pointer',
                                color:      '#fff',
                                fontSize:   '11px',
                            }}
                        >
                            Xóa
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex:       1,
                        overflowY:  'auto',
                        padding:    '16px 12px',
                        display:    'flex',
                        flexDirection: 'column',
                        gap:        '8px',
                        background: '#f8f8f6',
                        minHeight:  '200px',
                        maxHeight:  '340px',
                    }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    display:       'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    animation:     'tnlFadeIn 0.3s ease-out'
                                }}
                            >
                                <div style={{
                                    maxWidth:     '85%',
                                    padding:      '10px 14px',
                                    borderRadius: msg.role === 'user'
                                        ? '16px 16px 4px 16px'
                                        : '16px 16px 16px 4px',
                                    background:   msg.role === 'user' ? '#c8371a' : '#ffffff',
                                    color:        msg.role === 'user' ? '#ffffff' : '#1a1a1a',
                                    fontSize:     '14px',
                                    lineHeight:   1.55,
                                    boxShadow:    '0 1px 4px rgba(0,0,0,0.06)',
                                    border:       msg.role === 'user' ? 'none' : '1px solid #eaeaea',
                                }}>
                                    {renderContent(msg.content)}
                                </div>
                            </div>
                        ))}

                        {/* Loading dots */}
                        {loading && (
                            <div style={{ display: 'flex', gap: '4px', padding: '8px 0 0 8px' }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        width:        '6px',
                                        height:       '6px',
                                        borderRadius: '50%',
                                        background:   '#c8371a',
                                        opacity:      0.6,
                                        animation:    `tnlBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                                    }}/>
                                ))}
                            </div>
                        )}

                        {/* Gợi ý câu hỏi nhanh */}
                        {showSuggest && messages.length === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', animation: 'tnlFadeIn 0.5s ease-out' }}>
                                <div style={{ fontSize: '11px', color: '#888', paddingLeft: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                                    💡 Gợi ý cho bạn:
                                </div>
                                {QUICK_SUGGESTIONS.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestion(s)}
                                        style={{
                                            background:   '#fff',
                                            border:       '1px solid #e0e0e0',
                                            borderRadius: '12px',
                                            padding:      '8px 12px',
                                            cursor:       'pointer',
                                            fontSize:     '13px',
                                            color:        '#c8371a',
                                            textAlign:    'left',
                                            transition:   'all 0.2s',
                                            boxShadow:    '0 1px 2px rgba(0,0,0,0.02)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = '#c8371a';
                                            e.currentTarget.style.background  = '#fff5f3';
                                            e.currentTarget.style.transform   = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                            e.currentTarget.style.background  = '#fff';
                                            e.currentTarget.style.transform   = 'translateY(0)';
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding:     '12px',
                        borderTop:   '1px solid #f0f0f0',
                        display:     'flex',
                        gap:         '8px',
                        alignItems:  'flex-end',
                        background:  '#fff',
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập câu hỏi về thép..."
                            rows={1}
                            maxLength={500}
                            disabled={loading}
                            style={{
                                flex:        1,
                                border:      '1px solid #e0e0e0',
                                borderRadius: '20px',
                                padding:     '10px 14px',
                                fontSize:    '14px',
                                resize:      'none',
                                outline:     'none',
                                fontFamily:  'inherit',
                                lineHeight:  1.4,
                                background:  loading ? '#f5f5f5' : '#fff',
                                cursor:      loading ? 'not-allowed' : 'text',
                                maxHeight:   '80px',
                                overflowY:   'auto',
                                transition:  'border-color 0.2s'
                            }}
                            onFocus={e  => e.target.style.borderColor = '#c8371a'}
                            onBlur={e   => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            style={{
                                width:        '40px',
                                height:       '40px',
                                borderRadius: '50%',
                                background:   (!input.trim() || loading) ? '#f0f0f0' : '#c8371a',
                                border:       'none',
                                cursor:       (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                                display:      'flex',
                                alignItems:   'center',
                                justifyContent: 'center',
                                flexShrink:   0,
                                transition:   'background 0.2s',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={(!input.trim() || loading) ? '#a0a0a0' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* CSS Animation Definitions */}
            <style>{`
                /* Hiệu ứng gợn sóng (radar) cho nút chat */
                @keyframes tnlPulse {
                    0% { box-shadow: 0 0 0 0 rgba(200, 55, 26, 0.6); }
                    70% { box-shadow: 0 0 0 16px rgba(200, 55, 26, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(200, 55, 26, 0); }
                }
                
                /* Hiệu ứng nhấp nhô cho bong bóng chào mừng */
                @keyframes tnlFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }

                /* Hiệu ứng lắc nhẹ icon chat */
                @keyframes tnlWiggle {
                    0%, 10% { transform: rotate(0deg); }
                    15% { transform: rotate(-10deg); }
                    20% { transform: rotate(10deg); }
                    25% { transform: rotate(-10deg); }
                    30%, 100% { transform: rotate(0deg); }
                }

                /* Hoạt ảnh khi mở khung chat */
                @keyframes tnlSlideUp {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                /* Hoạt ảnh mượt mà khi tin nhắn xuất hiện */
                @keyframes tnlFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes tnlBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-4px); opacity: 1; }
                }

                .tnl-chat-link {
                    color: #c8371a;
                    text-decoration: underline;
                    font-weight: 600;
                }
                .tnl-chat-link:hover { opacity: 0.8; }
            `}</style>
        </>
    );
}