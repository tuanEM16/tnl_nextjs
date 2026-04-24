import { Toaster } from 'react-hot-toast';
import './globals.css';
import { publicService } from '@/services/publicService';
import { getImageUrl } from '@/lib/utils';

export async function generateMetadata() {
  try {
    const res = await publicService.getConfig();
    // 🟢 Dựa vào ảnh Response của đại ca: res là {success: true, data: {...}}
    // Nên config chính là res.data
    const config = res?.data; 

    if (!config || !config.favicon) {
      return { title: 'Tân Ngọc Lực Steel' };
    }

    const faviconUrl = getImageUrl(config.favicon);
    console.log("LINK FAVICON ĐÃ BỐC:", faviconUrl); // 🟢 F12 xem nó ra link đúng không

    return {
      title: config.site_name || 'Tân Ngọc Lực',
      description: config.slogan,
      // 🔴 ÉP TRÌNH DUYỆT NHẬN ICON MỚI
      icons: {
        icon: [
          { url: faviconUrl },
          { url: faviconUrl, sizes: '32x32', type: 'image/webp' },
        ],
        shortcut: [faviconUrl],
        apple: [faviconUrl],
      },
    };
  } catch (error) {
    return { title: 'Tân Ngọc Lực Steel' };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}