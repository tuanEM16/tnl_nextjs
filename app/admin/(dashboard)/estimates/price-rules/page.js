'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/hooks/useEstimate';
import { estimateService } from '@/services/estimateService';
import toast from 'react-hot-toast';

export default function PriceRulesPage() {
  const { data, loading, createItem, updateItem, deleteItem } = useEstimate('priceRules');
  const [options, setOptions] = useState({ usageTypes: [], materialTypes: [], items: [] });
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ usage_type_id: '', material_type_id: '', item_id: '', unit_price: 0, unit: 'm²', factor_default: 1.0, sort_order: 0, status: 1 });
  
  const [filter, setFilter] = useState({ usage_type_id: '', material_type_id: '', item_id: '' });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [usageRes, materialRes, itemsRes] = await Promise.all([
          estimateService.usageTypes.getAll(),
          estimateService.materialTypes.getAll(),
          estimateService.items.getAll()
        ]);
        const usageTypes = usageRes.data || [];
        const materialTypes = materialRes.data || [];
        const items = itemsRes.data || [];
        setOptions({ usageTypes, materialTypes, items });
        
        if (usageTypes.length > 0 && materialTypes.length > 0) {
          setAddForm(prev => ({ ...prev, usage_type_id: usageTypes[0].id, material_type_id: materialTypes[0].id }));
        }
      } catch (error) {
        console.error("Lỗi tải danh mục");
      }
    };
    fetchOptions();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const usageCounts = data.reduce((acc, item) => {
    acc[item.usage_type_id] = (acc[item.usage_type_id] || 0) + 1;
    return acc;
  }, {});

  const getPriceColorClass = (usageName, usageId) => {
    if (!usageName) return 'text-zinc-500';
    const count = usageCounts[usageId] || 0;
    if (count < 8) return 'text-zinc-500'; 
    
    const name = usageName.toLowerCase();
    if (name.includes('rất cao')) return 'text-red-600';
    if (name.includes('cao')) return 'text-orange-500';
    if (name.includes('trung bình')) return 'text-blue-600';
    if (name.includes('thấp')) return 'text-green-600';
    return 'text-[#0e2188]';
  };

  const checkDuplicate = (form, isEdit = false) => {
    if (!form.item_id) return false;
    return data.find(item => 
      item.item_id &&
      Number(item.item_id) === Number(form.item_id) &&
      Number(item.usage_type_id) === Number(form.usage_type_id) &&
      Number(item.material_type_id) === Number(form.material_type_id) &&
      (!isEdit || item.id !== editingId)
    );
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    if (checkDuplicate(editForm, true)) {
      toast.error('Hạng mục này với Mục đích và Vật liệu tương ứng đã tồn tại. Vui lòng kiểm tra lại!');
      return;
    }

    const { id, usage_name, material_name, item_name, ...cleanData } = editForm;
    const payload = { 
      ...cleanData, 
      usage_type_id: Number(cleanData.usage_type_id), 
      material_type_id: Number(cleanData.material_type_id),
      item_id: Number(cleanData.item_id)
    };
    
    const success = await updateItem(editingId, payload);
    if (success) setEditingId(null);
  };

  const handleSaveAdd = async () => {
    if (!addForm.item_id) {
      toast.error('Vui lòng chọn Hạng mục trước khi lưu!');
      return;
    }

    if (checkDuplicate(addForm)) {
      toast.error('Hạng mục này với Mục đích và Vật liệu tương ứng đã tồn tại. Vui lòng kiểm tra lại!');
      return;
    }

    const payload = { 
        ...addForm, 
        usage_type_id: Number(addForm.usage_type_id), 
        material_type_id: Number(addForm.material_type_id),
        item_id: Number(addForm.item_id)
    };
    const success = await createItem(payload);
    if (success) {
      setIsAdding(false);
      setAddForm(prev => ({ ...prev, item_id: '', unit_price: 0, unit: 'm²', factor_default: 1.0, sort_order: 0 }));
    }
  };

  const incompleteUsages = options.usageTypes.filter(u => {
    const count = usageCounts[u.id] || 0;
    return count > 0 && count < 8;
  });

  const filteredData = data.filter(item => {
    if (item.item_id === null) return false;
    if (filter.usage_type_id && item.usage_type_id !== Number(filter.usage_type_id)) return false;
    if (filter.material_type_id && item.material_type_id !== Number(filter.material_type_id)) return false;
    if (filter.item_id && item.item_id !== Number(filter.item_id)) return false;
    return true;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Cấu hình Đơn giá</h1>
          <p className="text-sm text-zinc-500 mt-1">Quản lý đơn giá chi tiết cho từng hạng mục thi công</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/estimates" className="px-4 py-2 bg-zinc-100 text-zinc-700 font-medium rounded hover:bg-zinc-200 transition-colors">Quay lại</Link>
          <button onClick={() => { setIsAdding(true); setEditingId(null); }} className="px-4 py-2 bg-[#0e2188] text-white font-bold rounded hover:bg-[#e33127] transition-colors">
            + Thêm mới
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-wrap gap-4 items-center">
        <span className="text-sm font-bold text-zinc-600">Bộ lọc:</span>
        <select value={filter.item_id} onChange={e => setFilter({...filter, item_id: e.target.value})} className="border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188] flex-1 min-w-[200px]">
          <option value="">-- Tất cả Hạng mục --</option>
          {options.items.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
        <select value={filter.usage_type_id} onChange={e => setFilter({...filter, usage_type_id: e.target.value})} className="border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188] flex-1 min-w-[200px]">
          <option value="">-- Tất cả Mục đích SD --</option>
          {options.usageTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
        <select value={filter.material_type_id} onChange={e => setFilter({...filter, material_type_id: e.target.value})} className="border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188] flex-1 min-w-[200px]">
          <option value="">-- Tất cả Vật liệu --</option>
          {options.materialTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
        <button onClick={() => setFilter({ usage_type_id: '', material_type_id: '', item_id: '' })} className="px-4 py-2 bg-zinc-200 text-zinc-700 font-medium rounded hover:bg-zinc-300 transition-colors text-sm whitespace-nowrap">
          Xóa lọc
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500 py-8 text-center font-medium">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full divide-y divide-zinc-200 border border-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">Hạng mục</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">Mục đích SD / Vật liệu</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Đơn giá / Đơn vị</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase">Hệ số</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {filteredData.map(item => {
                const priceColor = getPriceColorClass(item.usage_name, item.usage_type_id);
                
                return (
                  <tr key={item.id} className={`transition-colors ${(!item.unit_price || item.unit_price === 0) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-zinc-50'}`}>
                    {editingId === item.id ? (
                      <>
                        <td className="px-2 py-2">
                          <select value={editForm.item_id ?? ''} onChange={e => setEditForm({...editForm, item_id: e.target.value})} className="w-full border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188]">
                            <option value="">-- Chọn hạng mục (Ẩn) --</option>
                            {options.items.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2 space-y-1">
                          <select value={editForm.usage_type_id ?? ''} onChange={e => setEditForm({...editForm, usage_type_id: e.target.value})} className="w-full border border-zinc-300 p-1.5 text-xs rounded focus:outline-none focus:border-[#0e2188]">
                            {options.usageTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                          </select>
                          <select value={editForm.material_type_id ?? ''} onChange={e => setEditForm({...editForm, material_type_id: e.target.value})} className="w-full border border-zinc-300 p-1.5 text-xs rounded focus:outline-none focus:border-[#0e2188]">
                            {options.materialTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex gap-1 justify-end">
                            <input type="number" value={editForm.unit_price} onChange={e => setEditForm({...editForm, unit_price: Number(e.target.value)})} className="w-32 border border-zinc-300 p-2 text-sm text-right rounded focus:outline-none focus:border-[#0e2188]" />
                            <input type="text" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})} className="w-12 border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" step="0.01" value={editForm.factor_default} onChange={e => setEditForm({...editForm, factor_default: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" />
                        </td>
                        <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                          <button onClick={handleSaveEdit} className="text-[#0e2188] hover:text-[#e33127] font-bold text-sm transition-colors">Lưu</button>
                          <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-700 font-bold text-sm transition-colors">Hủy</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-zinc-900">{item.item_name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="block text-[#0e2188] font-bold">{item.usage_name}</span>
                          <span className="block text-zinc-500 text-xs mt-1">{item.material_name}</span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${priceColor}`}>
                          {formatCurrency(item.unit_price)} <span className="text-zinc-400 text-xs font-normal">/{item.unit}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-zinc-700">{item.factor_default}</td>
                        <td className="px-4 py-3 text-center space-x-4">
                          <button onClick={() => handleEditClick(item)} className="text-[#0e2188] hover:text-[#e33127] font-bold text-sm transition-colors">Sửa</button>
                          <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-800 font-bold text-sm transition-colors">Xóa</button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {isAdding && (
                <tr className="bg-blue-50">
                  <td className="px-2 py-2">
                    <select value={addForm.item_id ?? ''} onChange={e => setAddForm({...addForm, item_id: e.target.value})} className="w-full border border-zinc-300 p-2 text-sm rounded focus:outline-none focus:border-[#0e2188]">
                      <option value="">-- Chọn hạng mục (Ẩn) --</option>
                      {options.items.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 space-y-1">
                    <select value={addForm.usage_type_id ?? ''} onChange={e => setAddForm({...addForm, usage_type_id: e.target.value})} className="w-full border border-zinc-300 p-1.5 text-xs rounded focus:outline-none focus:border-[#0e2188]">
                      {options.usageTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <select value={addForm.material_type_id ?? ''} onChange={e => setAddForm({...addForm, material_type_id: e.target.value})} className="w-full border border-zinc-300 p-1.5 text-xs rounded focus:outline-none focus:border-[#0e2188]">
                      {options.materialTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-1 justify-end">
                      <input type="number" placeholder="Đơn giá" value={addForm.unit_price} onChange={e => setAddForm({...addForm, unit_price: Number(e.target.value)})} className="w-32 border border-zinc-300 p-2 text-sm text-right rounded focus:outline-none focus:border-[#0e2188]" />
                      <input type="text" placeholder="Đơn vị" value={addForm.unit} onChange={e => setAddForm({...addForm, unit: e.target.value})} className="w-12 border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" />
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" step="0.01" value={addForm.factor_default} onChange={e => setAddForm({...addForm, factor_default: Number(e.target.value)})} className="w-full border border-zinc-300 p-2 text-sm text-center rounded focus:outline-none focus:border-[#0e2188]" />
                  </td>
                  <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                    <button onClick={handleSaveAdd} className="text-[#0e2188] hover:text-[#e33127] font-bold text-sm transition-colors">Lưu</button>
                    <button onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-zinc-700 font-bold text-sm transition-colors">Hủy</button>
                  </td>
                </tr>
              )}

              {!isAdding && filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-zinc-500">Không tìm thấy dữ liệu phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-[#0e2188]">
            <strong className="block mb-2 text-base">Lưu ý hệ thống:</strong>
            <ul className="list-disc ml-5 space-y-1.5">
              <li>Hệ thống tự động chặn nếu bạn nhập trùng <strong className="font-bold">Hạng mục + Mục đích + Vật liệu</strong>.</li>
              <li>Mỗi mục đích cần đủ 8 trường hợp hạng mục để hiển thị màu sắc phân biệt. Khi chưa đủ, đơn giá sẽ có màu <span className="text-zinc-500 font-bold">Xám mặc định</span>.</li>
              <li>
                Màu sắc đơn giá khi đủ dữ kiện:{' '}
                {options.usageTypes?.length > 0 ? options.usageTypes.map((u, idx) => {
                  let colorClass = 'text-[#0e2188]';
                  const name = u.name.toLowerCase();
                  if (name.includes('rất cao')) colorClass = 'text-red-600';
                  else if (name.includes('cao')) colorClass = 'text-orange-500';
                  else if (name.includes('trung bình')) colorClass = 'text-blue-600';
                  else if (name.includes('thấp')) colorClass = 'text-green-600';
                  
                  return (
                    <span key={u.id}>
                      <span className={`${colorClass} font-bold`}>{u.name}</span>
                      {idx < options.usageTypes.length - 1 && ' / '}
                    </span>
                  );
                }) : <span className="text-zinc-500 italic">Đang tải...</span>}.
              </li>
            </ul>
            
            {incompleteUsages.length > 0 && (
              <div className="mt-4 pt-3 border-t border-blue-200">
                <strong className="text-red-600 block mb-1">Cảnh báo thiếu dữ kiện:</strong>
                <ul className="list-disc ml-5 space-y-1 text-red-600/90">
                  {incompleteUsages.map(u => (
                    <li key={u.id}>Mục đích <strong>{u.name}</strong> mới có <strong>{usageCounts[u.id]}/8</strong> trường hợp. Vui lòng nhập đủ!</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}