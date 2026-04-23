'use client';
import { MdLayers, MdFilterList } from 'react-icons/md';

export default function ProductFilter({ categories, currentCategory, onCategoryChange }) {
  return (
    <aside className="space-y-10"> {/* 🟢 Thẻ mở là aside */}
      <div className="border-b-4 border-black pb-4 flex items-center gap-3">
        <MdFilterList size={24} />
        <h2 className="text-xl font-black italic uppercase">BỘ LỌC HÀNG</h2>
      </div>

      {/* LỌC THEO DANH MỤC */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] flex items-center gap-2">
          <MdLayers /> PHÂN LOẠI THÉP
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`text-left px-4 py-3 font-black text-xs uppercase border-2 transition-all ${
              !currentCategory ? "bg-black text-white border-black" : "border-gray-100 hover:border-black"
            }`}
          >
            TẤT CẢ SẢN PHẨM
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`text-left px-4 py-3 font-black text-xs uppercase border-2 transition-all ${
                currentCategory == cat.id ? "bg-black text-white border-black shadow-[4px_4px_0_0_#ea580c]" : "border-gray-100 hover:border-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </aside> 
  );
}