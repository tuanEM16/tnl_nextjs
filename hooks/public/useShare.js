'use client';

const REF_CODES = {
    facebook: 'fb',
    zalo:     'zl',
    google:   'gg',
    tiktok:   'tt',
    copy:     'cp', 
};

export const useShare = () => {
    const getUrl = (code) => {
        if (typeof window === 'undefined') return '';
        // Xóa ref cũ nếu có, gắn ref mới
        const url = new URL(window.location.href);
        url.searchParams.set('ref', REF_CODES[code] || code);
        return url.toString();
    };

    const shareToFacebook = () => {
        const url = getUrl('facebook');
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    const shareToZalo = () => {
        const url = getUrl('zalo');
        window.open(
            `https://zalo.me/share?url=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    const shareToTikTok = () => {
        // TikTok không có share API công khai → copy link
        copyLink('tiktok');
    };

    const copyLink = (platform = 'cp') => {
        const url = getUrl(platform);
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ Đã copy link!');
        }).catch(() => {
            // Fallback nếu clipboard không được phép
            prompt('Copy link này:', url);
        });
    };

    return { shareToFacebook, shareToZalo, shareToTikTok, copyLink };
};