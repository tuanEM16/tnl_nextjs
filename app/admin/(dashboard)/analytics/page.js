'use client';
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MdTrendingUp, MdTrendingDown, MdRemove, MdRefresh, MdVisibility, MdSwapHoriz, MdContactPhone, MdArticle, MdMap, MdRequestQuote, MdInfo } from 'react-icons/md';

// ── COLORS CHO BIỂU ĐỒ TRÒN ───────────────────────────────────────────────────
const PIE_COLORS = ['#0e2188', '#e33127', '#3b82f6', '#10b981', '#8b5cf6', '#94a3b8'];

// ── BIỂU ĐỒ TRÒN THUẦN SVG ────────────────────────────────────────────────────
const PieChart = ({ data }) => {
    const [tooltip, setTooltip] = useState(null);
    const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    let currentAngle = 0;

    if (total === 0) return (
        <div className="flex items-center justify-center h-40 font-medium text-gray-400 text-sm">
            Chưa có dữ liệu
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-6 mt-4 relative w-full">
            <svg viewBox="-1 -1 2 2" className="w-32 h-32 -rotate-90 overflow-visible">
                {data.map((d, i) => {
                    const value = Number(d.value) || 0;
                    if (value === 0) return null;
                    const percentage = value / total;
                    const percentText = Math.round(percentage * 100);
                    const angle = percentage * Math.PI * 2;
                    const startX = Math.cos(currentAngle);
                    const startY = Math.sin(currentAngle);
                    currentAngle += angle;
                    const endX = Math.cos(currentAngle);
                    const endY = Math.sin(currentAngle);
                    const largeArcFlag = percentage > 0.5 ? 1 : 0;
                    
                    const handleMouseMove = (e) => {
                        setTooltip({
                            x: e.clientX,
                            y: e.clientY,
                            label: d.label,
                            value: d.value,
                            percent: percentText,
                            color: d.color
                        });
                    };

                    const handleMouseLeave = () => setTooltip(null);

                    if (percentage === 1) {
                        return (
                            <circle 
                                key={i} 
                                cx="0" 
                                cy="0" 
                                r="1" 
                                fill={d.color} 
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            />
                        );
                    }

                    const pathData = [
                        `M 0 0`,
                        `L ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `Z`
                    ].join(' ');

                    return (
                        <path 
                            key={i} 
                            d={pathData} 
                            fill={d.color} 
                            className="hover:opacity-85 transition-opacity cursor-pointer stroke-white stroke-[0.03]" 
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        />
                    );
                })}
            </svg>

            {/* Custom Tooltip */}
            {tooltip && (
                <div 
                    className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-[130%]"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tooltip.color }}></span>
                        <span className="font-semibold">{tooltip.label}</span>
                    </div>
                    <p className="text-gray-300 pl-4">{tooltip.value} lượt xem ({tooltip.percent}%)</p>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 w-full px-2">
                {data.map((d, i) => d.value > 0 && (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                        <span className="line-clamp-1 max-w-[100px]" title={d.label}>{d.label}</span>
                        <span className="text-gray-400 font-normal">({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, accent = false, change }) => {
    const TrendIcon = change > 0 ? MdTrendingUp : change < 0 ? MdTrendingDown : MdRemove;
    const trendColor = change > 0 ? 'text-emerald-600 bg-emerald-50' : change < 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100';

    return (
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${accent ? 'bg-[#0e2188] border-[#0e2188] text-white shadow-lg shadow-[#0e2188]/20' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${accent ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-500'}`}>
                    {Icon && <Icon size={24} />}
                </div>
                {change !== null && change !== undefined && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trendColor}`}>
                        <TrendIcon size={14} />
                        {change > 0 ? '+' : ''}{change}%
                    </div>
                )}
            </div>
            <div>
                <span className="text-3xl font-bold tracking-tight block mb-1">
                    {String(value ?? '—').padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-0.5">
                    <p className={`text-sm font-medium ${accent ? 'text-blue-100' : 'text-gray-500'}`}>{label}</p>
                    {sub && <span className={`text-xs ${accent ? 'text-blue-200' : 'text-gray-400'}`}>{sub}</span>}
                </div>
            </div>
        </div>
    );
};

// ── NGUỒN TRAFFIC ─────────────────────────────────────────────────────────────
const SOURCE_COLORS = {
    Google: 'bg-blue-500',
    Facebook: 'bg-blue-700',
    Zalo: 'bg-blue-400',
    Direct: 'bg-gray-800',
    Other: 'bg-gray-400',
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
        <div className="space-y-8 pb-12 font-sans">

            {/* ── HEADER ── */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Báo cáo & Phân tích
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Theo dõi lưu lượng truy cập và hiệu suất website của bạn.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
                        {periodOptions.map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${days === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {d} ngày
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:bg-gray-50 hover:text-[#0e2188] transition-all disabled:opacity-50"
                        title="Làm mới dữ liệu"
                    >
                        <MdRefresh size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {loading && !summary ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0e2188] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-sm">Đang đồng bộ dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* ── STAT CARDS ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Tổng lượt xem"
                            value={summary?.total_views ?? 0}
                            icon={MdVisibility}
                            change={summary?.view_change}
                            sub={`So với ${days} ngày trước`}
                        />
                        <StatCard
                            label="Xem sản phẩm"
                            value={summary?.product_views ?? 0}
                            icon={MdVisibility}
                            sub="Lượt truy cập trang chi tiết"
                        />
                        <StatCard
                            label="Trang thông tin"
                            sub="Trang chủ, Tin tức, Dự án..."
                            value={(summary?.total_views ?? 0) - (summary?.product_views ?? 0)}
                            icon={MdVisibility}
                        />
                        <StatCard
                            label="Tỷ lệ chuyển đổi"
                            value={`${summary?.conversions?.conversion_rate ?? '0.0'}%`}
                            icon={MdSwapHoriz}
                            accent
                            sub="Lượt xem → Báo giá/Liên hệ"
                        />
                    </div>

                    {/* ── 2 PIE CHARTS + TRAFFIC SOURCES ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Pie 1: Sản phẩm */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-bold text-gray-900">Tỷ trọng Sản phẩm</h3>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Lượt xem</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <PieChart data={productPieData} />
                            </div>
                        </div>

                        {/* Pie 2: Trang khác */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-bold text-gray-900">Tỷ trọng Trang khác</h3>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Phân bổ</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <PieChart data={otherPagesPieData} />
                            </div>
                        </div>

                        {/* Traffic sources */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-bold text-gray-900">Nguồn Traffic</h3>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Kênh dẫn</span>
                            </div>
                            {summary?.traffic_sources?.length > 0 ? (
                                <div className="space-y-5">
                                    {summary.traffic_sources.map((src, i) => {
                                        const pct = Math.round((parseInt(src.total) / totalTrafficSrc) * 100);
                                        const color = SOURCE_COLORS[src.source] || 'bg-gray-400';
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-700">{src.source}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{src.total} <span className="text-gray-400 font-normal text-xs ml-1">({pct}%)</span></span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center flex-1 text-sm font-medium text-gray-400">
                                    Chưa có dữ liệu nguồn
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── CONVERSION DETAIL + TOP PRODUCTS ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Conversion breakdown */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            <h3 className="text-base font-bold text-gray-900 mb-6">Hành trình Chuyển đổi</h3>
                            
                            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {[
                                    { label: 'Xem sản phẩm', val: summary?.conversions?.product_views, icon: MdVisibility, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Xem báo giá', val: summary?.estimate_views, icon: MdRequestQuote, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                                    { label: 'Xem dự án', val: summary?.project_views, icon: MdMap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { label: 'Xem tin tức', val: summary?.post_views, icon: MdArticle, color: 'text-purple-500', bg: 'bg-purple-50' },
                                    { label: 'Xem giới thiệu', val: summary?.about_views, icon: MdInfo, color: 'text-gray-500', bg: 'bg-gray-100' },
                                    { label: 'Gửi liên hệ', val: summary?.conversions?.contact_requests, icon: MdContactPhone, color: 'text-[#e33127]', bg: 'bg-red-50', highlight: true },
                                ].map((item, i) => (
                                    <div key={i} className="relative flex items-center justify-between py-3 z-10 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bg}`}>
                                                <item.icon size={16} className={item.color} />
                                            </div>
                                            <span className={`text-sm font-medium ${item.highlight ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className={`text-lg font-bold ${item.highlight ? 'text-[#e33127]' : 'text-gray-900'}`}>
                                            {String(item.val ?? 0).padStart(2, '0')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center bg-gray-50 rounded-xl">
                                <span className="text-3xl font-bold text-[#0e2188]">{summary?.conversions?.conversion_rate ?? '0.0'}%</span>
                                <p className="text-xs font-medium text-gray-500 mt-1 pb-4">Tỷ lệ chuyển đổi tổng thể</p>
                            </div>
                        </div>

                        {/* Top products */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-base font-bold text-gray-900">Sản phẩm xem nhiều nhất</h3>
                                <span className="text-xs font-semibold text-[#0e2188] bg-blue-50 px-3 py-1 rounded-full">{days} Ngày qua</span>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {topProducts.length > 0 ? topProducts.map((p, i) => (
                                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-lg font-bold w-6 text-center ${i < 3 ? 'text-[#e33127]' : 'text-gray-300'}`}>
                                                {i + 1}
                                            </span>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900">
                                                    {p.product_name || p.ref_slug || 'Không rõ'}
                                                </div>
                                                {p.category_name && (
                                                    <div className="text-xs font-medium text-gray-500 mt-0.5">
                                                        {p.category_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                                <div
                                                    className="h-full bg-[#0e2188] rounded-full"
                                                    style={{ width: `${Math.min((p.views / (topProducts[0]?.views || 1)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-right w-16">
                                                <span className="text-base font-bold text-gray-900">{p.views}</span>
                                                <p className="text-[10px] font-medium text-gray-400 uppercase">Lượt xem</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="px-6 py-16 text-center text-sm font-medium text-gray-400">
                                        Chưa có dữ liệu lượt xem sản phẩm. Cần gắn tracking vào trang chi tiết.
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