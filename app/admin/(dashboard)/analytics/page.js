'use client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MdTrendingUp, MdTrendingDown, MdRemove, MdRefresh, MdVisibility, MdSwapHoriz, MdContactPhone, MdArticle, MdMap, MdRequestQuote, MdInfo } from 'react-icons/md';

// ── COLORS CHO BIỂU ĐỒ TRÒN ───────────────────────────────────────────────────
const PIE_COLORS = ['#000000', '#ea580c', '#3b82f6', '#22c55e', '#a855f7', '#64748b'];

// ── BIỂU ĐỒ TRÒN THUẦN SVG ────────────────────────────────────────────────────
const PieChart = ({ data }) => {
    const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    let currentAngle = 0;

    if (total === 0) return (
        <div className="flex items-center justify-center h-40 font-black italic text-gray-300 text-[10px] tracking-widest">
            NO_DATA_SIGNAL
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-6 mt-4">
            <svg viewBox="-1 -1 2 2" className="w-32 h-32 -rotate-90 overflow-visible drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                {data.map((d, i) => {
                    const value = Number(d.value) || 0;
                    if (value === 0) return null;
                    const percentage = value / total;
                    const angle = percentage * Math.PI * 2;
                    const startX = Math.cos(currentAngle);
                    const startY = Math.sin(currentAngle);
                    currentAngle += angle;
                    const endX = Math.cos(currentAngle);
                    const endY = Math.sin(currentAngle);
                    const largeArcFlag = percentage > 0.5 ? 1 : 0;
                    
                    if (percentage === 1) {
                        return <circle key={i} cx="0" cy="0" r="1" fill={d.color} stroke="#000" strokeWidth="0.05" />
                    }

                    const pathData = [
                        `M 0 0`,
                        `L ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `Z`
                    ].join(' ');

                    return <path key={i} d={pathData} fill={d.color} stroke="#000" strokeWidth="0.05" className="hover:opacity-80 transition-opacity cursor-pointer" />;
                })}
            </svg>
            <div className="flex flex-wrap justify-center gap-3 w-full px-2">
                {data.map((d, i) => d.value > 0 && (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] font-black uppercase">
                        <span className="w-3 h-3 border-2 border-black" style={{ backgroundColor: d.color }}></span>
                        <span className="line-clamp-1 max-w-[90px]" title={d.label}>{d.label}</span>
                        <span className="text-gray-400">({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, accent = false, change }) => {
    const TrendIcon = change > 0 ? MdTrendingUp : change < 0 ? MdTrendingDown : MdRemove;
    const trendColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400';

    return (
        <div className={`border-[6px] border-black p-8 shadow-[12px_12px_0_0_#000] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all duration-200 ${accent ? 'bg-orange-600' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-8">
                <p className={`text-[10px] font-black tracking-[0.2em] uppercase ${accent ? 'text-white' : 'text-gray-400'}`}>{label}</p>
                {Icon && <Icon size={28} className={accent ? 'text-white' : 'text-black'} />}
            </div>
            <div className="flex items-end justify-between">
                <span className={`text-6xl font-black tracking-tighter leading-none ${accent ? 'text-white' : 'text-black'}`}>
                    {String(value ?? '—').padStart(2, '0')}
                </span>
                <div className="flex flex-col items-end gap-1">
                    {change !== null && change !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-black italic ${accent ? 'text-white' : trendColor}`}>
                            <TrendIcon size={14} />
                            {change > 0 ? '+' : ''}{change}%
                        </div>
                    )}
                    {sub && <span className={`text-[9px] font-black italic ${accent ? 'text-orange-200' : 'text-gray-400'}`}>{sub}</span>}
                </div>
            </div>
        </div>
    );
};

// ── NGUỒN TRAFFIC ─────────────────────────────────────────────────────────────
const SOURCE_COLORS = {
    Google: 'bg-blue-600',
    Facebook: 'bg-blue-900',
    Zalo: 'bg-blue-400',
    Direct: 'bg-black',
    Other: 'bg-gray-500',
};

// ── TRANG CHÍNH ───────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const { summary, topProducts, loading, days, setDays, refetch } = useAnalytics(30);

    const periodOptions = [7, 14, 30, 90];
    const totalTrafficSrc = summary?.traffic_sources?.reduce((s, r) => s + parseInt(r.total), 0) || 1;

    // ── XỬ LÝ DỮ LIỆU PIE CHART 1 (SẢN PHẨM) ──
    const productPieData = topProducts.slice(0, 4).map((p, i) => ({
        label: p.product_name || p.ref_slug || 'Sản phẩm',
        value: parseInt(p.views) || 0,
        color: PIE_COLORS[i]
    }));
    const otherProductsViews = topProducts.slice(4).reduce((sum, p) => sum + (parseInt(p.views) || 0), 0);
    if (otherProductsViews > 0) {
        productPieData.push({ label: 'Sản phẩm khác', value: otherProductsViews, color: PIE_COLORS[4] });
    }

    // ── XỬ LÝ DỮ LIỆU PIE CHART 2 (TRANG KHÁC) ──
    const postViews = parseInt(summary?.post_views) || 0;
    const projectViews = parseInt(summary?.project_views) || 0;
    const estimateViews = parseInt(summary?.estimate_views) || 0;
    const aboutViews = parseInt(summary?.about_views) || 0;

    const otherViews = Math.max(0, (parseInt(summary?.total_views) || 0) - (parseInt(summary?.product_views) || 0) - postViews - projectViews - estimateViews - aboutViews);
    
    const otherPagesPieData = [
        { label: 'Tin tức', value: postViews, color: PIE_COLORS[0] },
        { label: 'Dự án', value: projectViews, color: PIE_COLORS[1] },
        { label: 'Báo giá', value: estimateViews, color: PIE_COLORS[3] },
        { label: 'Giới thiệu', value: aboutViews, color: PIE_COLORS[4] },
        { label: 'Trang chủ & Khác', value: otherViews, color: PIE_COLORS[2] }
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">

            {/* ── HEADER ── */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-[6px] border-black pb-10">
                <div>
                    <div className="bg-black text-orange-600 w-fit px-4 py-1 text-[10px] font-black tracking-[0.3em] italic mb-4 shadow-[4px_4px_0_0_#ea580c]">
                        ANALYTICS // INTELLIGENCE_CENTER
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black uppercase">
                        DATA<br /><span className="text-orange-600">REPORT</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex border-[4px] border-black overflow-hidden shadow-[6px_6px_0_0_#000]">
                        {periodOptions.map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-5 py-3 text-xs font-black transition-colors border-r-[3px] border-black last:border-r-0 ${days === d ? 'bg-black text-white' : 'bg-white text-black hover:bg-orange-50'}`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="p-4 border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all disabled:opacity-50"
                    >
                        <MdRefresh size={22} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {loading && !summary ? (
                <div className="flex items-center gap-6 py-20 justify-center">
                    <div className="w-14 h-14 border-[8px] border-black border-t-orange-600 animate-spin shadow-[6px_6px_0_0_#000]" />
                    <p className="font-black italic text-xs tracking-[0.4em] animate-pulse">SYNCING_DATA_FEED...</p>
                </div>
            ) : (
                <>
                    {/* ── STAT CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Tổng lượt xem"
                            value={summary?.total_views ?? 0}
                            icon={MdVisibility}
                            change={summary?.view_change}
                            sub={`SO VỚI ${days} NGÀY TRƯỚC`}
                        />
                        <StatCard
                            label="Xem sản phẩm"
                            value={summary?.product_views ?? 0}
                            icon={MdVisibility}
                            sub="PRODUCT_PAGE_HITS"
                        />
                        <StatCard
                            label="Trang khác"
                            sub="HOME · NEWS · PROJECT"
                            value={(summary?.total_views ?? 0) - (summary?.product_views ?? 0)}
                            icon={MdVisibility}
                        />
                        <StatCard
                            label="Tỷ lệ chuyển đổi"
                            value={`${summary?.conversions?.conversion_rate ?? '0.0'}%`}
                            icon={MdSwapHoriz}
                            accent
                            sub="XEM → BÁO GIÁ/LIÊN HỆ"
                        />
                    </div>

                    {/* ── 2 PIE CHARTS + TRAFFIC SOURCES ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Pie 1: Sản phẩm */}
                        <div className="bg-white border-[6px] border-black p-6 shadow-[12px_12px_0_0_#000] flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                                <h3 className="text-sm font-black italic tracking-widest">TỶ TRỌNG SẢN PHẨM</h3>
                                <span className="text-[9px] font-black text-gray-400 italic">TOP_VIEWS</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <PieChart data={productPieData} />
                            </div>
                        </div>

                        {/* Pie 2: Trang khác */}
                        <div className="bg-white border-[6px] border-black p-6 shadow-[12px_12px_0_0_#000] flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                                <h3 className="text-sm font-black italic tracking-widest">TỶ TRỌNG TRANG KHÁC</h3>
                                <span className="text-[9px] font-black text-gray-400 italic">CATEGORIES</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <PieChart data={otherPagesPieData} />
                            </div>
                        </div>

                        {/* Traffic sources */}
                        <div className="bg-white border-[6px] border-black p-6 shadow-[12px_12px_0_0_#ea580c] flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                                <h3 className="text-sm font-black italic tracking-widest">NGUỒN TRAFFIC</h3>
                                <span className="text-[9px] font-black text-gray-400 italic">SOURCES</span>
                            </div>
                            {summary?.traffic_sources?.length > 0 ? (
                                <div className="space-y-4">
                                    {summary.traffic_sources.map((src, i) => {
                                        const pct = Math.round((parseInt(src.total) / totalTrafficSrc) * 100);
                                        const color = SOURCE_COLORS[src.source] || 'bg-gray-500';
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-black">{src.source}</span>
                                                    <span className="text-[11px] font-black text-gray-500">{src.total} ({pct}%)</span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-100 border border-black overflow-hidden">
                                                    <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center flex-1 text-[10px] font-black italic text-gray-300 tracking-widest">
                                    NO_TRAFFIC_DATA
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── CONVERSION DETAIL + TOP PRODUCTS ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Conversion breakdown */}
                        <div className="bg-black text-white border-[6px] border-black p-8 shadow-[12px_12px_0_0_#ea580c] space-y-6">
                            <h3 className="text-sm font-black italic tracking-widest text-orange-600 border-b-4 border-white/20 pb-4">
                                CONVERSION_FUNNEL
                            </h3>
                            {[
                                { label: 'Xem sản phẩm', val: summary?.conversions?.product_views, icon: MdVisibility },
                                { label: 'Gửi liên hệ', val: summary?.conversions?.contact_requests, icon: MdContactPhone },
                                { label: 'Xem báo giá', val: summary?.estimate_views, icon: MdRequestQuote },
                                { label: 'Xem dự án', val: summary?.project_views, icon: MdMap },
                                { label: 'Xem tin tức', val: summary?.post_views, icon: MdArticle },
                                { label: 'Xem giới thiệu', val: summary?.about_views, icon: MdInfo },
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between items-center pb-4 border-b border-white/10 ${item.highlight ? 'border-orange-600' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className={item.highlight ? 'text-orange-600' : 'text-gray-400'} />
                                        <span className={`text-[10px] font-black tracking-widest ${item.highlight ? 'text-orange-600' : 'text-gray-400'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <span className={`text-2xl font-black ${item.highlight ? 'text-orange-600' : 'text-white'}`}>
                                        {String(item.val ?? 0).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-2 text-center">
                                <span className="text-4xl font-black text-orange-600">{summary?.conversions?.conversion_rate ?? '0.0'}%</span>
                                <p className="text-[9px] font-black italic text-gray-500 mt-1">CONVERSION_RATE</p>
                            </div>
                        </div>

                        {/* Top products */}
                        <div className="lg:col-span-2 bg-white border-[6px] border-black shadow-[12px_12px_0_0_#000] overflow-hidden">
                            <div className="bg-black text-white px-8 py-4 flex justify-between items-center">
                                <span className="text-[10px] font-black italic tracking-widest">TOP_PRODUCTS // MOST_VIEWED</span>
                                <span className="text-orange-600 text-[10px] font-black">{days}D</span>
                            </div>
                            <div className="divide-y-[4px] divide-black">
                                {topProducts.length > 0 ? topProducts.map((p, i) => (
                                    <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <span className="text-4xl font-black text-black/10 w-10 shrink-0">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <div className="font-black text-sm text-black leading-tight">
                                                    {p.product_name || p.ref_slug || 'Không rõ'}
                                                </div>
                                                {p.category_name && (
                                                    <div className="text-[10px] font-bold text-gray-400 mt-0.5">
                                                        {p.category_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-black">{p.views}</span>
                                                <p className="text-[9px] font-black italic text-gray-400">VIEWS</p>
                                            </div>
                                            <div className="w-24 h-2 bg-gray-100 border border-black overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-600"
                                                    style={{ width: `${Math.min((p.views / (topProducts[0]?.views || 1)) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="px-8 py-16 text-center text-[10px] font-black italic text-gray-300 tracking-widest">
                                        NO_PRODUCT_DATA — START TRACKING BY ADDING useTrackView TO PRODUCT PAGES
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}