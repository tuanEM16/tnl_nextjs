import Link from 'next/link';
import { getImageUrl, formatCurrency } from '@/lib/utils';
import { MdSearch, MdPhoneInTalk } from 'react-icons/md';

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white border border-zinc-100 rounded-sm overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#0e2188]/10 hover:-translate-y-1">
      {/* 🟢 HÌNH ẢNH SẢN PHẨM */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        <img
          src={getImageUrl(product.thumbnail)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Overlay cao cấp khi hover */}
        <div className="absolute inset-0 bg-[#0e2188]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <Link 
            href={`/products/${product.slug}`}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0e2188] shadow-xl hover:bg-[#e33127] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            <MdSearch size={22} />
          </Link>
        </div>
      </div>

      {/* 🔴 THÔNG TIN CHI TIẾT */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[1px] bg-[#e33127]"></span>
          <span className="text-[10px] font-bold text-[#e33127] tracking-[0.2em] uppercase">
            {product.category_name || 'ENGINEERING UNIT'}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block flex-grow mb-6">
          <h3 className="text-lg font-bold uppercase tracking-tight text-[#0e2188] leading-tight group-hover:text-[#e33127] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* GIÁ CẢ & HÀNH ĐỘNG */}
        <div className="pt-5 border-t border-zinc-50 mt-auto">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Đơn giá tham khảo</span>
              <span className="font-bold text-xl text-[#0e2188] tracking-tight">
                {formatCurrency(product.price)}
              </span>
            </div>
            
            <a 
              href="tel:0366638969" 
              className="w-10 h-10 rounded-sm bg-zinc-50 flex items-center justify-center text-[#0e2188] hover:bg-[#e33127] hover:text-white transition-all duration-300"
              title="Gọi báo giá"
            >
              <MdPhoneInTalk size={20} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Accent corner trang trí */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-[#0e2188]/5 -mr-4 -mt-4 rotate-45 group-hover:bg-[#e33127]/10 transition-colors" />
    </div>
  );
}