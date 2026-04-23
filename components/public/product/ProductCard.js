// components/public/product/ProductCard.js
import Link from 'next/link';
import { getImageUrl, formatCurrency } from '@/lib/utils';
import { MdSearch, MdPhoneInTalk } from 'react-icons/md';

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden flex flex-col h-full">
      {/* 🟢 HÌNH ẢNH SẢN PHẨM */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 border-b-4 border-black">
        <img
          src={getImageUrl(product.thumbnail)}
          alt={product.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
        />
        {/* Lớp phủ khi hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Link 
            href={`/products/${product.slug}`}
            className="p-3 bg-white border-2 border-black hover:bg-orange-600 hover:text-white transition-all"
          >
            <MdSearch size={24} />
          </Link>
        </div>
      </div>

      {/* 🔴 THÔNG TIN CHI TIẾT */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-orange-600 tracking-widest uppercase">
            // {product.category_name || 'STEEL_UNIT'}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-lg font-black italic uppercase leading-tight hover:text-orange-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* GIÁ CẢ & HÀNH ĐỘNG */}
        <div className="pt-4 border-t-2 border-dashed border-gray-200 mt-auto">
          <div className="flex justify-between items-center">
            <span className="font-black text-lg text-black italic">
              {formatCurrency(product.price)}
            </span>
            <a 
              href="tel:0366638969" 
              className="text-orange-600 hover:scale-110 transition-transform"
              title="Gọi báo giá"
            >
              <MdPhoneInTalk size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}