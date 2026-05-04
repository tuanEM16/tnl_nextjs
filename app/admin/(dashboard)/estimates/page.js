'use client';
import Link from 'next/link';
import { MdBusinessCenter, MdLayers, MdConstruction, MdHeight, MdAttachMoney, MdAssignment } from 'react-icons/md';

const MODULES = [
  { id: 'usage-types', label: 'Mục đích sử dụng', icon: <MdBusinessCenter size={32} />, desc: 'Quản lý các loại công trình (nhà kho, xưởng...)' },
  { id: 'material-types', label: 'Vật liệu bao che', icon: <MdLayers size={32} />, desc: 'Quản lý loại tôn, vách tường...' },
  { id: 'complexity-levels', label: 'Độ phức tạp kết cấu', icon: <MdConstruction size={32} />, desc: 'Hệ số k theo tải trọng, cầu trục' },
  { id: 'height-factors', label: 'Hệ số chiều cao', icon: <MdHeight size={32} />, desc: 'Hệ số khung và bao che theo độ cao' },
  { id: 'items', label: 'Hạng mục thi công', icon: <MdAssignment size={32} />, desc: 'Quản lý danh sách tên hạng mục (Cột thép, Xà gồ...)' },
  { id: 'price-rules', label: 'Cấu hình đơn giá', icon: <MdAttachMoney size={32} />, desc: 'Bảng giá chi tiết cho từng hạng mục' },
];

export default function EstimatesDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-2">Hệ thống Cấu hình Dự toán</h1>
      <p className="text-zinc-500 mb-8">Chọn module bạn muốn quản lý bên dưới</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map(mod => (
          <Link href={`/admin/estimates/${mod.id}`} key={mod.id}>
            <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md hover:border-[#0e2188] transition-all group cursor-pointer h-full">
              <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center text-[#0e2188] group-hover:bg-[#0e2188] group-hover:text-white transition-colors mb-4">
                {mod.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-800 mb-2">{mod.label}</h3>
              <p className="text-sm text-zinc-500">{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}