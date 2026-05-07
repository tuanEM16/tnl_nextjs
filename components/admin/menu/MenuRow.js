'use client';
import { useState } from 'react';
import { MdDragIndicator, MdEdit, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';

export default function MenuRow({ item, level = 0, allMenus, onEdit, onDelete, provided }) {
    const [expanded, setExpanded] = useState(true);
    const children = allMenus.filter(m => parseInt(m.parent_id) === item.id);

    return (
        <>
            <tr 
                ref={provided?.innerRef} 
                {...provided?.draggableProps}
                className={`border-b border-black/10 hover:bg-orange-50 transition-colors ${!item.status ? 'opacity-40' : ''}`}
            >
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                        
                        {/* Gắn dragHandleProps vào khu vực icon để nắm kéo */}
                        <div {...provided?.dragHandleProps} className="cursor-grab active:cursor-grabbing flex items-center">
                            <MdDragIndicator size={16} className="text-gray-300 hover:text-black" />
                        </div>

                        {children.length > 0 && (
                            <button onClick={() => setExpanded(e => !e)} className="text-gray-400 hover:text-black">
                                {expanded ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
                            </button>
                        )}
                        <span className="font-black text-sm uppercase">{item.name}</span>
                        {level > 0 && (
                            <span className="text-[9px] font-bold text-gray-400 border border-gray-200 px-1">SUB</span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{item.link}</td>
                <td className="px-4 py-3">
                    <span className="text-[10px] font-black border border-black px-2 py-0.5 uppercase">{item.type}</span>
                </td>
                <td className="px-4 py-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 uppercase ${item.position === 'mainmenu' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {item.position === 'mainmenu' ? 'Header' : 'Footer'}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-center">{item.sort_order}</td>
                <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => onEdit(item)}
                            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
                        >
                            <MdEdit size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(item)}
                            className="p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                            <MdDelete size={14} />
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && children.map(child => (
                <MenuRow
                    key={child.id} item={child} level={level + 1}
                    allMenus={allMenus} onEdit={onEdit} onDelete={onDelete}
                />
            ))}
        </>
    );
}