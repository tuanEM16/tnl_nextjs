// components/public/home/HeroBanner.js
'use client';
import Button from '../ui/Button';
import Container from '../ui/Container';

export default function HeroBanner() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden">
      {/* 🟢 Background Image: Đại ca thay bằng ảnh xưởng thép thực tế */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src="/images/placeholder.jpg" 
          alt="Tân Ngọc Lực Steel Factory" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* 🔴 Content Overaly */}
      <Container className="relative h-full flex items-center">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="inline-block bg-orange-600 text-white px-4 py-2 font-black text-xs tracking-[0.4em] uppercase">
            // Established in Tay Ninh
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase leading-none tracking-tighter">
            Cung cấp thép <br /> 
            <span className="text-orange-600 text-7xl md:text-9xl">Công trình</span> <br /> 
            uy tín số 1
          </h1>

          <p className="text-gray-300 font-bold text-lg max-w-xl leading-relaxed border-l-4 border-orange-600 pl-6">
            Tân Ngọc Lực tự hào là đơn vị cung ứng vật liệu thép xây dựng hàng đầu tại Tây Ninh, 
            cam kết chất lượng chuẩn ISO và thông số kỹ thuật chính xác 100%. [cite: 14, 30]
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <Button variant="primary">Xem sản phẩm ngay</Button>
            <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
              Liên hệ báo giá
            </Button>
          </div>
        </div>
      </Container>

      {/* 🔘 Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="border-4 border-white/20 p-10 backdrop-blur-sm">
          <p className="text-white font-black text-6xl italic opacity-20 tracking-tighter">TNL_STEEL</p>
        </div>
      </div>
    </section>
  );
}