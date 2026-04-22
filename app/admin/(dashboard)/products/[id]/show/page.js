'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts'; // 🟢 Triệu hồi nội công
import { getImageUrl, formatDate } from '@/lib/utils';

// VŨ KHÍ UI NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import { 
    MdArrowBack, MdEdit, MdInventory, MdRule, 
    MdDashboard, MdCalendarToday, MdLayers, MdVerified, MdAssignment 
} from 'react-icons/md';

export default function ShowProductPage({ params }) {
    // 1. UNWRAP PARAMS
    const { id } = use(params);
    const router = useRouter();

    // 2. DÙNG HOOK (Dọn sạch đống useState/useEffect cũ)
    const { product, loading } = useProduct(id);

    // 3. MÀN HÌNH CHỜ TRUY XUẤT
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 border-[12px] border-black border-t-orange-600 animate-spin shadow-[10px_10px_0_0_#000]"></div>
            <p className="font-black uppercase italic tracking-[0.5em] text-2xl">Decoding Technical Data...</p>
        </div>
    );

    if (!product) return (
        <div className="text-center p-32 space-y-6 uppercase font-archivo">
            <h1 className="text-9xl font-black opacity-10 italic">ERROR_404</h1>
            <p className="font-black text-red-600 tracking-widest text-2xl">Mã sản phẩm không tồn tại trong kho hàng!</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase animate-in fade-in zoom-in-95 duration-500">
            
            {/* 🔴 HEADER ĐIỀU HƯỚNG */}
            <PageHeader 
                title="HỒ SƠ SẢN PHẨM" 
                subTitle={`Industrial Spec Sheet / ID: #${id}`} 
                btnText="HIỆU CHỈNH" 
                btnHref={`/admin/products/${id}/edit`}
                isBack={true}
                backHref="/admin/products"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* 🔵 CỘT TRÁI: VISUAL & LOGISTICS (4/12) */}
                <div className="lg:col-span-4 space-y-10">
                    {/* KHỐI ẢNH CHÍNH */}
                    <div className="border-[6px] border-black p-2 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] group relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-black text-white p-2 z-10 shadow-[4px_4px_0_0_#ea580c]">
                            <MdVerified size={24} />
                        </div>
                        <div className="relative aspect-square bg-gray-50 border-2 border-black overflow-hidden">
                            {product.thumbnail ? (
                                <img 
                                    src={getImageUrl(product.thumbnail)} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-200">
                                    <MdInventory size={80} />
                                    <span className="font-black italic text-2xl mt-4">NO_ASSET</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KHỐI TRẠNG THÁI */}
                    <div className="border-4 border-black p-8 bg-black text-white space-y-6 shadow-[10px_10px_0_0_#ea580c]">
                        <h3 className="text-xs font-black flex items-center gap-2 border-b border-white/20 pb-4 italic tracking-[0.3em]">
                            <MdAssignment className="text-orange-600" /> LOGISTICS_MANIFEST
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-500 uppercase italic">Availability:</span>
                                <span className={`px-4 py-1 font-black italic border ${product.status === 1 ? 'bg-orange-600 border-orange-600 text-white' : 'bg-transparent border-white/20 text-gray-500'}`}>
                                    {product.status === 1 ? 'STOCK_ACTIVE' : 'LOCKED_STORAGE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-500 uppercase italic">Classification:</span>
                                <span className="font-black text-orange-600 underline decoration-2">{product.category_name || 'MASTER_CORE'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-500 uppercase italic">Refreshed:</span>
                                <span className="font-black italic">{formatDate(product.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🟠 CỘT PHẢI: SPECIFICATIONS & GALLERY (8/12) */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* TIÊU ĐỀ LỚN & ĐỊNH DANH */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-orange-600">
                            <div className="h-0.5 w-12 bg-black"></div>
                            <span className="text-[11px] font-black tracking-[0.4em]">Unit Identity Label</span>
                        </div>
                        <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] text-black">
                            {product.name}
                        </h2>
                    </div>

                    {/* SECTION 1: THÔNG SỐ KỸ THUẬT (ENGINEERING DATA) */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4">
                            <MdRule size={32} className="text-orange-600"/> ENGINEERING_SPECS
                        </h2>
                        
                        {product.attributes?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,0.05)] overflow-hidden">
                                {product.attributes.map(attr => (
                                    <div key={attr.id} className="flex bg-white hover:bg-orange-50 transition-colors group">
                                        <div className="w-1/2 p-5 text-[10px] font-black text-gray-400 border-r-2 border-black/10 group-hover:text-black transition-colors italic">
                                            // {attr.attribute_name?.toUpperCase()}
                                        </div>
                                        <div className="w-1/2 p-5 font-black text-xl tracking-tighter">
                                            {attr.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 border-4 border-black border-dashed bg-gray-50 text-center font-black italic text-gray-300">
                                NO TECHNICAL ATTRIBUTES REGISTERED.
                            </div>
                        )}
                    </section>

                    {/* SECTION 2: STANDARDS & APPLICATIONS */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <h3 className="text-xs font-black flex items-center gap-2 border-b-2 border-black pb-2 italic tracking-widest uppercase">
                                Quality standard
                            </h3>
                            <div className="text-lg font-black bg-gray-100 p-6 border-l-[12px] border-orange-600 shadow-sm italic">
                                {product.standard || 'TCVN / GENERIC_UNSET'}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xs font-black flex items-center gap-2 border-b-2 border-black pb-2 italic tracking-widest uppercase">
                                Real-world Application
                            </h3>
                            <div className="text-lg font-black bg-gray-100 p-6 border-l-[12px] border-black shadow-sm italic">
                                {product.application || 'MULTI_PURPOSE_USAGE'}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: THƯ VIỆN HÌNH ẢNH (ASSET REPOSITORY) */}
                    {product.images?.length > 0 && (
                        <section className="space-y-6 pt-6">
                            <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4 uppercase">
                                <MdDashboard size={32} className="text-orange-600"/> Visual_Repository
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pr-4">
                                {product.images.map(img => (
                                    <div key={img.id} className="border-4 border-black p-1 bg-white hover:-translate-y-2 transition-transform shadow-[6px_6px_0_0_#000] cursor-zoom-in">
                                        <img src={getImageUrl(img.image)} alt="" className="w-full h-32 object-cover border-2 border-black/5" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SECTION 4: NỘI DUNG CHI TIẾT (FULL DOCUMENTATION) */}
                    {product.content && (
                        <section className="space-y-6 pt-6">
                            <h2 className="flex items-center gap-4 text-2xl font-black italic border-b-4 border-black pb-4 uppercase">
                                <MdLayers size={32} className="text-orange-600"/> Detailed_Documentation
                            </h2>
                            <div className="border-[6px] border-black p-12 bg-white shadow-[20px_20px_0_0_rgba(0,0,0,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                                <div 
                                    className="prose prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-medium prose-p:normal-case italic" 
                                    dangerouslySetInnerHTML={{ __html: product.content }} 
                                />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}