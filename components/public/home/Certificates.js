'use client';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export default function Certificates() {
  // 🟢 Dữ liệu mẫu (Sau này đại ca bốc từ DB thì truyền qua props)
  const certs = [
    { id: 1, title: 'Hàng Việt Nam Chất Lượng Cao', year: '2024', image: '/certs/cert-1.jpg' },
    { id: 2, title: 'Chứng Nhận ISO 9001:2015', year: '2023', image: '/certs/cert-2.jpg' },
    { id: 3, title: 'Thương Hiệu Mạnh Quốc Gia', year: '2025', image: '/certs/cert-3.jpg' },
    { id: 4, title: 'Top 10 Nội Thất Uy Tín', year: '2026', image: '/certs/cert-4.jpg' },
  ];

  return (
    <section className="py-24 bg-zinc-50 overflow-hidden font-archivo">
      <Container>
        {/* Tiêu đề "khè" khách */}
        <div className="mb-16">
          <p className="text-[10px] font-black tracking-[0.4em] text-orange-600 uppercase mb-2 italic">
            // Trusted & Certified
          </p>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
            CHỨNG NHẬN <span className="text-zinc-300">&</span> <br />
            <span className="text-orange-600">GIẢI THƯỞNG.</span>
          </h2>
        </div>

        {/* Lưới chứng chỉ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {certs.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Cái khung ảnh đúng chất "Thép" */}
              <div className="relative aspect-[3/4] border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0_0_#000] group-hover:shadow-[12px_12px_0_0_#ea580c] transition-all duration-500">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                />
                
                {/* Overlay thông tin khi hover */}
                <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-orange-600 font-black italic text-sm mb-2">YEAR: {item.year}</span>
                  <h3 className="text-white font-black uppercase text-lg leading-none tracking-tighter">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Nhãn tên bên dưới cho khách dễ đọc (lúc chưa hover) */}
              <div className="mt-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">
                   {item.title}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}