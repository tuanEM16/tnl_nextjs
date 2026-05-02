'use client';
import { 
  MdVerified, 
  MdEngineering, 
  MdMilitaryTech, 
  MdHandshake, 
  MdLightbulb, 
  MdStar 
} from 'react-icons/md';

/**
 * Component hiển thị các giá trị cốt lõi.
 * @param {Array} data - Mảng các giá trị được truyền từ metaData.values trong bảng 'post'.
 */
export default function CoreValues({ data }) {
  // Đảm bảo data là một mảng để tránh lỗi khi thực hiện map()
  const values = Array.isArray(data) ? data : [];
  
  // Nếu không có dữ liệu hoặc mảng rỗng, component sẽ không hiển thị gì
  if (values.length === 0) return null;

  // Hàm render icon dựa trên tên icon lưu trong database
  const renderIcon = (iconName) => {
    switch(iconName?.toLowerCase()) {
      case 'quality': return <MdVerified size={40} />;
      case 'engineering': return <MdEngineering size={40} />;
      case 'military': return <MdMilitaryTech size={40} />;
      case 'innovation': return <MdLightbulb size={40} />;
      case 'star': return <MdStar size={40} />;
      default: return <MdHandshake size={40} />;
    }
  };

  return (
    <div className="mb-32 font-archivo">
      {/* 🔴 TIÊU ĐỀ KHỐI */}
      <div className="text-center mb-16">
        <span className="text-orange-600 font-black tracking-widest uppercase text-xs border-2 border-orange-600 px-4 py-2 inline-block mb-4 shadow-[4px_4px_0_0_#ea580c]">
          // NỀN TẢNG VỮNG CHẮC
        </span>
        <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-black">
          GIÁ TRỊ CỐT LÕI
        </h2>
      </div>

      {/* 🔴 DANH SÁCH GIÁ TRỊ (Dạng Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto px-4 md:px-0">
        {values.map((item, idx) => (
          <div 
            key={idx} 
            className="relative p-8 md:p-10 border-4 border-black bg-white shadow-[12px_12px_0_0_#000] hover:bg-black hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#ea580c] transition-all duration-300 group flex flex-col h-full overflow-hidden cursor-default"
          >
            {/* Số thứ tự chìm (Watermark) tạo phong cách Brutalism */}
            <div className="absolute -top-6 -right-4 text-[160px] font-black text-gray-100 group-hover:text-zinc-800 transition-colors z-0 pointer-events-none select-none leading-none">
              {String(idx + 1).padStart(2, '0')}
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon bọc trong khối vuông */}
              <div className="text-black group-hover:text-white mb-8 transition-colors bg-orange-100 group-hover:bg-orange-600 w-fit p-4 border-2 border-black group-hover:border-orange-600">
                {renderIcon(item.icon)}
              </div>

              {/* Tiêu đề giá trị[cite: 1] */}
              <h3 className="text-2xl md:text-3xl font-black italic uppercase mb-6 leading-none text-black group-hover:text-white transition-colors">
                {item.title}
              </h3>

              {/* Nội dung mô tả (Hỗ trợ HTML từ ReactQuill)[cite: 1] */}
              <div className="mt-auto">
                <div 
                  className="font-bold text-gray-500 group-hover:text-gray-300 leading-relaxed text-sm md:text-base transition-colors [&>p]:mb-4 last:[&>p]:mb-0 [&_strong]:text-black group-hover:[&_strong]:text-orange-400"
                  dangerouslySetInnerHTML={{ __html: item.desc || '' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}