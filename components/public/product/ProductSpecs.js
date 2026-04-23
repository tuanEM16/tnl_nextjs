// components/public/product/ProductSpecs.js
export default function ProductSpecs({ product }) {
  // 🟢 Dữ liệu từ bảng product và product_attribute (đã join từ backend)
  const technicalSpecs = [
    { label: "Tiêu chuẩn", value: product?.standard },
    { label: "Ứng dụng", value: product?.application },
    // Duyệt qua các thuộc tính động (Quy cách, Mác thép...)
    ...(product?.attributes || []).map(attr => ({
      label: attr.name,
      value: attr.value
    }))
  ];

  // Lọc bỏ những dòng không có dữ liệu
  const activeSpecs = technicalSpecs.filter(spec => spec.value);

  if (activeSpecs.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-2 bg-orange-600"></div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Thông số kỹ thuật</h3>
      </div>

      <div className="border-4 border-black overflow-hidden shadow-[10px_10px_0_0_#000]">
        <table className="w-full text-left border-collapse">
          <tbody>
            {activeSpecs.map((spec, index) => (
              <tr 
                key={index} 
                className={`border-b-2 border-black/10 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="py-4 px-6 font-black uppercase text-xs tracking-widest text-gray-400 border-r-2 border-black/5 w-1/3">
                  // {spec.label}
                </td>
                <td className="py-4 px-6 font-bold text-sm italic text-black">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}