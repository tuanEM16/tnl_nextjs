export default function AdminTable({ columns, data, loading, emptyText = "KHÔNG TÌM THẤY DỮ LIỆU" }) {
    return (
        <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-archivo uppercase">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black text-white text-[10px] font-black tracking-widest uppercase">
                        {columns.map((col, i) => (
                            <th key={i} className={`p-6 border-r border-white/10 ${col.className || ''}`}>
                                {col.header || col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-black text-sm uppercase">
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="p-20 text-center font-black animate-pulse italic opacity-40">PROCESSING ASSETS...</td>
                        </tr>
                    ) : data && data.length > 0 ? (
                        data.map((row, i) => (
                            <tr key={i} className="hover:bg-orange-50 transition-colors group">
                                {columns.map((col, j) => (
                                    <td key={j} className={`p-6 border-r border-black/5 ${col.cellClassName || ''}`}>
                                        {col.render 
                                            // Nếu cột dùng 'label' (form mới) thì truyền (value, row). Ngược lại (form cũ) truyền (row)
                                            ? (col.label ? col.render(row[col.key], row) : col.render(row)) 
                                            : row[col.accessor || col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-32 text-center font-black opacity-20 text-2xl italic uppercase tracking-widest">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}