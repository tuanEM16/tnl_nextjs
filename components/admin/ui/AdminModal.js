// components/admin/ui/AdminModal.js
import { MdClose, MdWarning } from 'react-icons/md';

export default function AdminModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "XÁC NHẬN HÀNH ĐỘNG", 
    message = "BẠN CÓ CHẮC CHẮN MUỐN THỰC HIỆN ĐIỀU NÀY?",
    type = "danger" // danger | info
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* OVERLAY */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            />

            {/* MODAL CONTENT */}
            <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 space-y-6 animate-in fade-in zoom-in duration-200">
                
                {/* ICON & TITLE */}
                <div className="flex items-start gap-4">
                    <div className={`p-3 border-2 border-black shadow-[4px_4px_0_0_#000] ${
                        type === "danger" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                    }`}>
                        <MdWarning size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tighter uppercase leading-none text-black">
                            {title}<span className="text-orange-600">.</span>
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 italic tracking-widest uppercase">
                            Verification Required
                        </p>
                    </div>
                </div>

                {/* MESSAGE */}
                <p className="font-bold text-sm leading-relaxed border-l-4 border-black pl-4 py-2 uppercase text-black">
                    {message}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 border-4 border-black p-4 font-black text-xs uppercase hover:bg-gray-100 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        HỦY BỎ
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 p-4 font-black text-xs uppercase text-white shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
                            type === "danger" ? "bg-red-600" : "bg-black"
                        }`}
                    >
                        XÁC NHẬN →
                    </button>
                </div>

                {/* CLOSE BUTTON */}
                <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white border-4 border-black p-1 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]"
                >
                    <MdClose size={20} />
                </button>
            </div>
        </div>
    );
}