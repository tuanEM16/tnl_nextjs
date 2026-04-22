// components/admin/ui/AdminForm.js
import { MdSave } from 'react-icons/md';

/**
 * @param {Array} fields - Mảng cấu hình các field (name, label, type, options, required...)
 * @param {Object} formData - State chứa dữ liệu form
 * @param {Function} onChange - Hàm xử lý khi nhập liệu
 * @param {Function} onSubmit - Hàm xử lý khi gửi form
 * @param {boolean} loading - Trạng thái đang xử lý
 * @param {string} btnText - Chữ trên nút Submit
 */
export default function AdminForm({ 
    fields = [], 
    formData = {}, 
    onChange, 
    onSubmit, 
    loading = false, 
    btnText = "LƯU DỮ LIỆU →" 
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-8 font-archivo uppercase">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {fields.map((field, index) => {
                    // Kiểm tra nếu field chiếm trọn 1 dòng (full width)
                    const isFullWidth = field.fullWidth || field.type === 'textarea';
                    
                    return (
                        <div key={index} className={`space-y-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                            <label className="text-[10px] font-black text-gray-400 italic tracking-widest block">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="w-full border-2 border-black p-4 font-black text-xs outline-none bg-gray-50 focus:bg-orange-50 transition-all cursor-pointer shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]"
                                    required={field.required}
                                >
                                    {field.options?.map((opt, i) => (
                                        <option key={i} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    rows={field.rows || 4}
                                    placeholder={field.placeholder}
                                    className="w-full border-2 border-black p-4 font-bold text-sm outline-none focus:bg-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] normal-case"
                                    required={field.required}
                                />
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    placeholder={field.placeholder}
                                    className={`w-full border-2 border-black p-4 font-black outline-none transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] ${
                                        field.name === 'name' ? 'text-xl' : 'text-sm'
                                    } focus:bg-black focus:text-white placeholder:text-gray-200`}
                                    required={field.required}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* SUBMIT BUTTON */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0_0_#ea580c] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
            >
                <MdSave size={24} />
                {loading ? 'PROCESSING...' : btnText}
            </button>
        </form>
    );
}