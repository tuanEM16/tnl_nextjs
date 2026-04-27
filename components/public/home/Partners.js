// components/public/home/Partners.js
'use client';
import { useState, useEffect } from 'react';
import { partnerService } from '@/services/partnerService';
import { certificateService } from '@/services/certificateService'; // 🟢 Triệu hồi thêm chứng chỉ
import { getImageUrl } from '@/lib/utils'; // 🟢 Hàm bốc link ảnh chuẩn
import Container from '../ui/Container';

export default function Partners() {
  const [logos, setLogos] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

const fetchHomeData = async () => {
    try {
        const partnerRes = await partnerService.getAll();
        // 🟢 CHỈ LẤY ĐỐI TÁC THÔI
        const activePartners = (partnerRes.data || []).filter(p => p.status === 1);
        
        const combined = activePartners.map(p => ({ 
            id: `p-${p.id}`, 
            name: p.name, 
            img: p.logo 
        }));

        setLogos(combined);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

  // Nếu đang load thì đại ca có thể để trống hoặc làm skeleton
  if (loading) return <div className="py-20 bg-white border-t-4 border-black text-center font-bold uppercase italic">Đang bốc dữ liệu...</div>;

  return (
    <section className="py-20 bg-white border-t-4 border-black">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* TIÊU ĐỀ BÊN TRÁI */}
          <div className="space-y-4">
            <span className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase">// TRUSTED_BY</span>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Đối tác & <br/>Chứng nhận</h2>
            <p className="text-gray-500 font-bold text-sm">
              Sản phẩm của Tân Ngọc Lực đạt các tiêu chuẩn kiểm định khắt khe nhất ngành thép từ năm 2007.
            </p>
          </div>

          {/* LOGO CHẠY NGANG (GRID) */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
            {logos.map(item => (
              <div key={item.id} className="h-24 border-2 border-black/10 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all hover:border-black shadow-[4px_4px_0_0_transparent] hover:shadow-[4px_4px_0_0_#000] bg-white">
                <img 
                  src={getImageUrl(item.img)} 
                  alt={item.name} 
                  className="max-h-full max-w-full object-contain" 
                  onError={(e) => e.target.src = '/images/placeholder.jpg'} // 🟢 Nếu mất ảnh thì hiện placeholder
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}