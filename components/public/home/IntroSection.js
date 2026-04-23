// components/public/home/IntroSection.js
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';

export default function IntroSection() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* TEXT CONTENT */}
          <div className="space-y-8">
            <SectionTitle 
              subtitle="Về chúng tôi" 
              title="Công ty TNHH Tân Ngọc Lực" 
            />
            
            <div className="space-y-6 text-gray-700 font-medium leading-loose text-lg">
              <p>
                Với nhiều năm kinh nghiệm trong ngành vật liệu xây dựng, Tân Ngọc Lực không chỉ là nhà cung cấp 
                mà còn là đối tác chiến lược của hàng ngàn công trình tại Tây Ninh và các khu vực lân cận. [cite: 8, 14]
              </p>
              <p className="font-bold italic border-l-4 border-black pl-4">
                "Chúng tôi tin rằng, mỗi thanh thép chắc chắn là nền móng cho những công trình trường tồn."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-6">
              <div className="border-t-4 border-black pt-4">
                <span className="block text-4xl font-black text-orange-600">10+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Năm kinh nghiệm</span>
              </div>
              <div className="border-t-4 border-black pt-4">
                <span className="block text-4xl font-black text-orange-600">500+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dự án hoàn thành</span>
              </div>
            </div>

            <Button variant="outline">Tìm hiểu thêm về TNL</Button>
          </div>

          {/* IMAGE DECORATION */}
          <div className="relative">
            <div className="aspect-[4/5] border-[10px] border-black overflow-hidden shadow-[25px_25px_0_0_#ea580c]">
              <img 
                src="/images/placeholder.jpg" 
                alt="Construction Site" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
            {/* Lớp khung đen trang trí kiểu Nickelbronx */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-8 border-r-8 border-black -z-10"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}