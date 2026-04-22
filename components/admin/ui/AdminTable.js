'use client';
import { MdEdit, MdVisibility, MdDelete } from 'react-icons/md';
import Link from 'next/link';

export default function AdminTable({ columns, data, loading, onSearch, onDelete, slug }) {
    return (
        <div className="border-4 border-black shadow-[12px_12px_0_0_#000] overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
                <thead className="bg-black text-white text-xs uppercase tracking-[0.2em]">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="p-4 border-r border-gray-800">{col.label}</th>
                        ))}
                        <th className="p-4 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                    {loading ? (
                        <tr><td colSpan={columns.length + 1} className="p-10 text-center font-black italic">ĐANG TRUY XUẤT DỮ LIỆU...</td></tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id} className="hover:bg-orange-50 transition-colors">
                                {columns.map((col, index) => (
                                    <td key={index} className="p-4 border-r-2 border-black font-bold text-sm">
                                        {col.render ? col.render(item) : item[col.key]}
                                    </td>
                                ))}
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <Link href={`/admin/${slug}/${item.id}/show`} className="p-2 border-2 border-black hover:bg-blue-600 hover:text-white transition-all">
                                            <MdVisibility size={16} />
                                        </Link>
                                        <Link href={`/admin/${slug}/${item.id}/edit`} className="p-2 border-2 border-black hover:bg-green-600 hover:text-white transition-all">
                                            <MdEdit size={16} />
                                        </Link>
                                        <button onClick={() => onDelete(item.id)} className="p-2 border-2 border-black hover:bg-red-600 hover:text-white transition-all">
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}