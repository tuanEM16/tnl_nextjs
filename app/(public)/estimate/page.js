'use client';
import { useState } from 'react';
import Container from '@/components/public/ui/Container';
import { useEstimateOptions, useCalculateEstimate } from '@/hooks/public/usePublicEstimate';
import { usePublicConfig } from '@/hooks/public/usePublicConfig';

export default function EstimatePage() {
  const { options, loading: loadingOptions } = useEstimateOptions();
  const { calculate, result, loading: calculating } = useCalculateEstimate();
  const { config, loading: configLoading } = usePublicConfig();

  const [formData, setFormData] = useState({
    length: 20,
    width: 10,
    height: 6,
    usage_type_id: 1,
    material_type_id: 1,
    complexity_id: 1
  });

  const [needsCustomQuote, setNeedsCustomQuote] = useState(false);

  const handleChange = (e) => {
    setNeedsCustomQuote(false);
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.height > 25) {
      setNeedsCustomQuote(true);
      return;
    }
    calculate(formData);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loadingOptions || configLoading) {
    return <div className="py-32 text-center font-black tracking-widest text-[#0e2188]">ĐANG TẢI DỮ LIỆU...</div>;
  }

  if (formData.usage_type_id === 1 && options.usageTypes?.length > 0 && !options.usageTypes.find(t => t.id === 1)) {
     setFormData(prev => ({...prev, usage_type_id: options.usageTypes[0].id}));
  }
  if (formData.material_type_id === 1 && options.materialTypes?.length > 0 && !options.materialTypes.find(t => t.id === 1)) {
     setFormData(prev => ({...prev, material_type_id: options.materialTypes[0].id}));
  }
  if (formData.complexity_id === 1 && options.complexityLevels?.length > 0 && !options.complexityLevels.find(t => t.id === 1)) {
     setFormData(prev => ({...prev, complexity_id: options.complexityLevels[0].id}));
  }

  return (
    <main className="py-24 bg-zinc-50 min-h-screen font-sans">
      <Container>
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-8 border-t-4 border-[#0e2188] shadow-xl">
              <h1 className="text-3xl font-black text-[#0e2188] mb-8 uppercase tracking-tight">Tính chi phí sơ bộ</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Chiều dài (m)</label>
                    <input type="number" name="length" value={formData.length} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 p-4 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-colors" required min="1" max="500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Chiều rộng (m)</label>
                    <input type="number" name="width" value={formData.width} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 p-4 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-colors" required min="1" max="200" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Chiều cao (m)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className={`w-full bg-zinc-50 border p-4 font-bold outline-none transition-colors ${needsCustomQuote ? 'border-[#e33127] text-[#e33127]' : 'border-zinc-200 text-[#0e2188] focus:border-[#e33127]'}`} required min="1" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Độ phức tạp kết cấu (k)</label>
                  <select name="complexity_id" value={formData.complexity_id} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 p-4 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-colors cursor-pointer">
                    {options.complexityLevels?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Mục đích sử dụng</label>
                  <select name="usage_type_id" value={formData.usage_type_id} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 p-4 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-colors cursor-pointer">
                    {options.usageTypes?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Loại vật liệu bao che</label>
                  <select name="material_type_id" value={formData.material_type_id} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 p-4 font-bold text-[#0e2188] outline-none focus:border-[#e33127] transition-colors cursor-pointer">
                    {options.materialTypes?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={calculating} className="w-full bg-[#e33127] text-white font-black uppercase tracking-widest py-5 hover:bg-[#0e2188] transition-colors disabled:opacity-50 mt-4">
                  {calculating ? 'Đang xử lý...' : 'Nhận Báo Giá Sơ Bộ'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#0e2188] p-8 lg:p-12 text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
              {needsCustomQuote ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e33127] mb-4 shadow-[0_0_30px_rgba(227,49,39,0.5)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Yêu Cầu Thiết Kế Chuyên Sâu</h2>
                    <p className="text-white/80 leading-relaxed text-lg border-l-4 border-[#e33127] pl-4">
                      Công trình có chiều cao vượt quá <strong>25m</strong> đòi hỏi tính toán kết cấu phức tạp, chịu tải trọng gió và các tiêu chuẩn an toàn đặc biệt. Hệ thống không thể cung cấp báo giá tự động cho quy mô này.
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-sm space-y-6 border border-white/20">
                    <p className="font-bold uppercase tracking-widest text-sm text-[#e33127]">Liên hệ ngay để được kỹ sư tư vấn:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <a href={`tel:${config?.hotline || config?.phone || ''}`} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-[#e33127] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div>
                          <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Hotline Kỹ Thuật</span>
                          <span className="block font-bold text-lg">{config?.hotline || config?.phone || 'Đang cập nhật'}</span>
                        </div>
                      </a>

                      <a href={`mailto:${config?.email || ''}`} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-[#e33127] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Gửi Yêu Cầu</span>
                          <span className="block font-bold text-lg truncate">{config?.email || 'Đang cập nhật'}</span>
                        </div>
                      </a>
                    </div>

                    <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                      <div className="w-12 h-12 bg-white/5 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <div>
                        <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Đến trực tiếp văn phòng</span>
                        <span className="block font-bold leading-relaxed">{config?.address || 'Đang cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#e33127] mb-2 border-b-2 border-[#e33127] pb-4 inline-block">Bảng Tổng Hợp Chi Phí</h2>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium border-b border-white/10 pb-8">
                    <div>
                      <span className="text-white/50 block mb-1">Diện tích nền</span>
                      <span className="text-3xl font-black">{result.summary.floor_area} m²</span>
                    </div>
                    <div>
                      <span className="text-white/50 block mb-1">Diện tích bao che</span>
                      <span className="text-3xl font-black">{result.summary.total_cover_area} m²</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 p-4 hover:bg-white/10 transition-colors">
                        <span className="font-bold text-sm">{item.item_name}</span>
                        <span className="font-black text-lg">{formatCurrency(item.total_price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tổng chi phí dự kiến</p>
                    <p className="text-5xl lg:text-6xl font-black text-[#e33127] tracking-tighter">{formatCurrency(result.summary.total_estimated)}</p>
                    <p className="text-xs text-white/40 mt-4 italic">* Đây là mức giá sơ bộ tham khảo. Vui lòng liên hệ trực tiếp để có báo giá chính xác nhất theo bản vẽ thiết kế.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4 relative z-10">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="font-black tracking-widest text-xl uppercase">Nhập thông số để<br/>xem báo giá sơ bộ</p>
                </div>
              )}
              
              <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-white opacity-5 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-white opacity-5 pointer-events-none"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 border-t-4 border-[#e33127] shadow-lg">
              <h3 className="text-xl font-black text-[#0e2188] mb-6 uppercase tracking-tight flex items-center gap-3">
                <svg className="w-6 h-6 text-[#e33127]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Công thức dự toán thép
              </h3>
              <div className="space-y-6 text-zinc-700 leading-relaxed">
                <p className="bg-zinc-50 p-4 border-l-4 border-[#e33127] font-bold text-sm lg:text-base">
                  Trọng lượng thép = Diện tích (m²) × Định mức (kg/m²) × Hệ số kết cấu (1 + k)
                </p>
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Định mức tham khảo theo loại công trình:</p>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <span>Nhà kho nhẹ, mái che</span>
                      <span className="font-bold text-[#0e2188]">15 - 20 kg/m²</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <span>Nhà xưởng công nghiệp (không cầu trục)</span>
                      <span className="font-bold text-[#0e2188]">20 - 30 kg/m²</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <span>Nhà xưởng nặng (có cầu trục)</span>
                      <span className="font-bold text-[#0e2188]">30 - 45 kg/m²</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <span>Nhà cao tầng, trung tâm thương mại</span>
                      <span className="font-bold text-[#0e2188]">40 - 60 kg/m²</span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-zinc-500 italic">
                  * Hệ số kết cấu (k) dao động từ 0.1 đến 0.3 tùy thuộc vào độ phức tạp, nhịp kèo, và tải trọng phụ.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 border-t-4 border-[#0e2188] shadow-lg overflow-x-auto">
              <h3 className="text-xl font-black text-[#0e2188] mb-6 uppercase tracking-tight flex items-center gap-3">
                <svg className="w-6 h-6 text-[#e33127]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Bảng giá thi công tham khảo
              </h3>
              
              <div className="min-w-full inline-block align-middle">
                <div className="border border-zinc-200 rounded-sm overflow-hidden h-[300px] overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-50">
                  <table className="min-w-full divide-y divide-zinc-200 relative">
                    <thead className="bg-zinc-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Hạng mục</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Vật liệu</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200 text-sm">
                      {options?.priceRules?.length > 0 ? (
                        options.priceRules.map((rule, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-4 py-3 text-zinc-800 font-medium">
                              {rule.item_name}
                              <span className="block text-xs text-zinc-400 mt-1">{rule.usage_name}</span>
                            </td>
                            <td className="px-4 py-3 text-zinc-600">{rule.material_name}</td>
                            <td className="px-4 py-3 text-right font-bold text-[#e33127] whitespace-nowrap">
                              {formatCurrency(rule.unit_price)} <span className="text-zinc-500 text-xs font-normal">/ {rule.unit}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-zinc-500 text-sm">Đang cập nhật bảng giá...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </main>
  );
}