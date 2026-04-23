// components/public/home/Partners.js
'use client';
import Container from '../ui/Container';

export default function Partners() {
  // Sau này đại ca bốc từ API home_section (name='partners' và name='certificates') 
  const partners = [
    { id: 1, name: 'Hoa Sen Group', logo: '/images/placeholder.jpg' },
    { id: 2, name: 'Hòa Phát', logo: '/images/placeholder.jpg' },
    { id: 3, name: 'Pomina', logo: '/images/placeholder.jpg' },
    { id: 4, name: 'VinaKyoei', logo: '/images/placeholder.jpg' },
  ];

  return (
    <section className="py-20 bg-white border-t-4 border-black">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* TIÊU ĐỀ BÊN TRÁI */}
          <div className="space-y-4">
            <span className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase">// TRUSTED_BY</span>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Đối tác & <br/>Chứng nhận</h2>
            <p className="text-gray-500 font-bold text-sm">Sản phẩm của Tân Ngọc Lực đạt các tiêu chuẩn kiểm định khắt khe nhất ngành thép[cite: 16, 30].</p>
          </div>

          {/* LOGO CHẠY NGANG (GRID) */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map(item => (
              <div key={item.id} className="h-24 border-2 border-black/10 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all hover:border-black shadow-[4px_4px_0_0_transparent] hover:shadow-[4px_4px_0_0_#000]">
                <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}