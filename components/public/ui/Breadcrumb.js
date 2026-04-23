// components/public/ui/Breadcrumb.js
import Link from 'next/link';
import { MdChevronRight, MdHome } from 'react-icons/md';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/" className="hover:text-orange-600 flex items-center gap-1 font-black transition-colors uppercase">
        <MdHome size={18} /> TRANG CHỦ
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <MdChevronRight className="text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-orange-600 font-black transition-colors uppercase">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-400 font-bold uppercase italic">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}