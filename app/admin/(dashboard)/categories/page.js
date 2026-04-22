'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoryService } from '@/services/categoryService';
import { MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll({ tree: true });
      setCategories(res.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    try {
      await categoryService.delete(id);
      toast.success('Xóa thành công');
      fetchCategories();
    } catch (error) {
      toast.error('Xóa thất bại');
    }
  };


  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <tbody key={node.id}>
        <tr className="border-b hover:bg-gray-50">
          {/* CỘT 1: HÌNH ẢNH */}
          <td className="px-6 py-3 w-32">
            <div className="w-16 h-10 border rounded overflow-hidden bg-gray-100">
              {node.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${node.image}`}
                  alt={node.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/100x60?text=NO+IMG'}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[10px] text-gray-400">N/A</div>
              )}
            </div>
          </td>

          {/* CỘT 2: TÊN DANH MỤC */}
          <td className="px-6 py-3">
            <span style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && '↳ '}
              <span className={level === 0 ? "font-bold" : ""}>{node.name}</span>
            </span>
          </td>

          <td className="px-6 py-3 text-sm text-gray-500 italic">{node.slug}</td>
          <td className="px-6 py-3 font-mono text-center">{node.sort_order}</td>

          <td className="px-6 py-3">
            <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${node.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {node.status === 1 ? 'Hiển thị' : 'Ẩn'}
            </span>
          </td>

          <td className="px-6 py-3">
            <div className="flex gap-2">
              <Link href={`/admin/categories/${node.id}/show`} className="text-blue-600 hover:scale-125 transition-transform">
                <MdVisibility size={20} />
              </Link>
              <Link href={`/admin/categories/${node.id}/edit`} className="text-indigo-600 hover:scale-125 transition-transform">
                <MdEdit size={20} />
              </Link>
              <button onClick={() => handleDelete(node.id, node.name)} className="text-red-600 hover:scale-125 transition-transform">
                <MdDelete size={20} />
              </button>
            </div>
          </td>
        </tr>
        {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
      </tbody>
    ));
  };

  if (loading) return <div className="p-20 font-black italic animate-pulse uppercase">Forging categories...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-6 font-archivo">
        <h1 className="text-6xl font-black uppercase tracking-tighter">DANH MỤC<span className="text-orange-600">.</span></h1>
        <Link
          href="/admin/categories/add"
          className="flex items-center gap-2 bg-black hover:bg-orange-600 text-white px-8 py-4 text-xs font-black uppercase tracking-widest transition-all"
        >
          <MdAdd /> Thêm mới
        </Link>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden">
        <table className="min-w-full divide-y divide-black">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Ảnh</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Tên danh mục</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Slug</th>
              <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Thứ tự</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Thao tác</th>
            </tr>
          </thead>
          {renderTree(categories)}
        </table>
      </div>
    </div>
  );
}