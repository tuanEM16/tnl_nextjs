'use client';
import { MdVerified, MdEngineering, MdMilitaryTech, MdHandshake } from 'react-icons/md';

export default function CoreValues({ data }) {
  // Trả về mảng rỗng nếu chưa có dữ liệu để tránh lỗi map()
  const values = Array.isArray(data) ? data : [];
  if (values.length === 0) return null;

  // Hàm render icon linh hoạt
  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'quality': return <MdVerified size={40} />;
      case 'engineering': return <MdEngineering size={40} />;
      case 'military': return <MdMilitaryTech size={40} />;
      default: return <MdHandshake size={40} />;
    }
  };

  return (
    <div className="mb-32">
      <div className="text-center mb-16">
        <span className="text-orange-600 font-black tracking-widest uppercase text-xs">
          // NỀN TẢNG VỮNG CHẮC
        </span>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-4 text-black">
          GIÁ TRỊ CỐT LÕI
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {values.map((item, idx) => (
          <div key={idx} className="p-10 border-4 border-black bg-white shadow-[10px_10px_0_0_#000] hover:bg-black hover:text-white transition-all group flex flex-col h-full">
            <div className="text-orange-600 group-hover:text-orange-500 mb-6 transition-colors">
              {renderIcon(item.icon)}
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4 leading-tight">{item.title}</h3>
            <div 
              className="font-bold text-gray-500 group-hover:text-gray-300 leading-relaxed mt-auto prose prose-sm"
              dangerouslySetInnerHTML={{ __html: item.desc || '' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}