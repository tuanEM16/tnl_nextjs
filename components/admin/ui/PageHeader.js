'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function PageHeader({ 
    title, 
    subTitle, 
    btnText, 
    btnHref, 
    btnAction, 
    isBack = false,
    backHref 
}) {
    const router = useRouter();

    const handleBack = () => {
        if (backHref) router.push(backHref);
        else router.back();
    };

    // Style chung cho nút bấm chuẩn NickelBronx
    const btnStyle = "flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] hover:bg-orange-600 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
            <div className="flex items-end gap-6">
                {isBack && (
                    <button 
                        onClick={handleBack}
                        className="mb-1 p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:shadow-none"
                    >
                        <MdArrowBack size={20} />
                    </button>
                )}
                <div>
                    {subTitle && <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-2 italic">{subTitle}</p>}
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-black">
                        {title}<span className="text-orange-600">.</span>
                    </h1>
                </div>
            </div>

            {btnText && (
                // 🟢 NẾU CÓ btnHref THÌ LÀM LINK, KHÔNG THÌ LÀM BUTTON
                btnHref ? (
                    <Link href={btnHref} className={btnStyle}>
                        {btnText}
                    </Link>
                ) : (
                    <button onClick={btnAction} className={btnStyle}>
                        {btnText}
                    </button>
                )
            )}
        </header>
    );
}