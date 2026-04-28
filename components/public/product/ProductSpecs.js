// components/public/product/ProductSpecs.js
export default function ProductSpecs({ product }) {
  // 🟢 Dữ liệu từ bảng product và product_attribute (giữ nguyên logic)
  const technicalSpecs = [
    { label: "Tiêu chuẩn", value: product?.standard },
    { label: "Ứng dụng", value: product?.application },
    ...(product?.attributes || []).map(attr => ({
      label: attr.name,
      value: attr.value
    }))
  ];

  const activeSpecs = technicalSpecs.filter(spec => spec.value);

  if (activeSpecs.length === 0) return null;

  return (
    <div className="mt-12 font-sans">
      {/* Header Section theo style Armenia Travel: Chữ Navy, gạch đỏ mảnh */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[2px] bg-[#e33127]"></span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-[#0e2188]">
          Thông số kỹ thuật
        </h3>
      </div>

      {/* Layout Table: Tối giản, bỏ viền đen dày, dùng line mỏng và khoảng trắng */}
      <div className="overflow-hidden border border-zinc-100 rounded-sm bg-white">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-zinc-50">
            {activeSpecs.map((spec, index) => (
              <tr 
                key={index} 
                className="group transition-colors hover:bg-zinc-50/50"
              >
                {/* Label: Chữ xám, tracking rộng, uppercase */}
                <td className="py-5 px-8 w-1/3 bg-zinc-50/30">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block">
                    {spec.label}
                  </span>
                </td>
                
                {/* Value: Chữ Navy đậm, font-medium */}
                <td className="py-5 px-8">
                  <span className="text-sm font-semibold text-[#0e2188] tracking-tight">
                    {spec.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Decorative footer line cho spec block */}
      <div className="mt-4 flex justify-end">
        <div className="w-12 h-[1px] bg-zinc-100"></div>
      </div>
    </div>
  );
}