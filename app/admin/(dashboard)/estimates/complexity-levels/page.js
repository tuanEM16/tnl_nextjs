'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/hooks/useEstimate';

export default function ComplexityLevelsPage() {
  const { data, loading, createItem, updateItem, deleteItem } = useEstimate('complexityLevels');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', k_factor: 1.0, sort_order: 0, status: 1 });

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    const success = await updateItem(editingId, editForm);
    if (success) setEditingId(null);
  };

  const handleSaveAdd = async () => {
    const success = await createItem(addForm);
    if (success) {
      setIsAdding(false);
      setAddForm({ name: '', k_factor: 1.0, sort_order: 0, status: 1 });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Độ phức tạp kết cấu</h1>
          <p className="text-sm text-zinc-500 mt-1">Quản lý hệ số K theo độ phức tạp của công trình</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/estimates" className="px-4 py-2 bg-zinc-100 text-zinc-700 font-medium rounded hover:bg-zinc-200 transition-colors">
            Quay lại
          </Link>
          <button onClick={() => { setIsAdding(true); setEditingId(null); }} className="px-4 py-2 bg-[#0e2188] text-white font-bold rounded hover:bg-[#e33127] transition-colors">
            + Thêm mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-zinc-500 py-8 text-center font-medium">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 border border-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">Tên mức độ</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase w-32">Hệ số K</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase w-24">Thứ tự</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  {editingId === item.id ? (
                    <>
                      <td className="px-2 py-2"><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188]" /></td>
                      <td className="px-2 py-2"><input type="number" step="0.001" value={editForm.k_factor} onChange={e => setEditForm({...editForm, k_factor: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" /></td>
                      <td className="px-2 py-2"><input type="number" value={editForm.sort_order} onChange={e => setEditForm({...editForm, sort_order: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" /></td>
                      <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                        <button onClick={handleSaveEdit} className="text-[#0e2188] hover:text-green-600 font-bold text-sm transition-colors">Lưu</button>
                        <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-700 font-bold text-sm transition-colors">Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-zinc-900">{item.name}</td>
                      <td className="px-4 py-3 text-center text-[#e33127] font-bold">{item.k_factor}</td>
                      <td className="px-4 py-3 text-center text-zinc-500">{item.sort_order}</td>
                      <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                        <button onClick={() => handleEditClick(item)} className="text-[#0e2188] hover:text-[#e33127] font-bold text-sm transition-colors">Sửa</button>
                        <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-800 font-bold text-sm transition-colors">Xóa</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {isAdding && (
                <tr className="bg-blue-50">
                  <td className="px-2 py-2"><input type="text" placeholder="Tên mức độ..." value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188]" autoFocus /></td>
                  <td className="px-2 py-2"><input type="number" step="0.001" placeholder="Hệ số K" value={addForm.k_factor} onChange={e => setAddForm({...addForm, k_factor: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" /></td>
                  <td className="px-2 py-2"><input type="number" value={addForm.sort_order} onChange={e => setAddForm({...addForm, sort_order: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" /></td>
                  <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                    <button onClick={handleSaveAdd} className="text-[#0e2188] hover:text-green-600 font-bold text-sm transition-colors">Lưu</button>
                    <button onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-zinc-700 font-bold text-sm transition-colors">Hủy</button>
                  </td>
                </tr>
              )}

              {!isAdding && data.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-zinc-500">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}