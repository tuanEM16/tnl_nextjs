// components/admin/ui/ImageUploader.js
import { MdCloudUpload } from 'react-icons/md';

export default function ImageUploader({ 
    preview, 
    onImageChange, 
    label = "SELECTION VISUAL ASSET",
    required = false
}) {
    return (
        <div className="space-y-4 font-archivo">
            <label className="text-[10px] font-black text-gray-400 italic uppercase block text-center">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative border-2 border-dashed border-black p-4 text-center cursor-pointer hover:bg-gray-50 group bg-gray-50/50 min-h-[200px] flex items-center justify-center overflow-hidden">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={onImageChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    required={required}
                />
                
                {preview ? (
                    <div className="space-y-3 relative z-0">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-auto max-h-60 object-contain border border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]" 
                        />
                        <p className="text-[9px] font-black text-gray-400 italic tracking-widest">[ VISUAL UPDATED ]</p>
                    </div>
                ) : (
                    <div className="space-y-3 py-10 relative z-0">
                        <MdCloudUpload size={40} className="mx-auto mb-2 text-gray-300 group-hover:text-black" />
                        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Click to Select Media File</p>
                    </div>
                )}
            </div>
        </div>
    );
}