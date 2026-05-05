'use client';
import { useEffect, useRef, useState } from 'react';
import { useProjectMap } from '@/hooks/public/useProjectMap';
import 'leaflet/dist/leaflet.css'; // Tối ưu: Import CSS trực tiếp để tránh lỗi FOUC (vỡ layout) của Next.js

let L = null;

export default function ProjectMap() {
    const { locations, loading } = useProjectMap();
    const mapRef      = useRef(null);
    const mapInstance = useRef(null);
    const markersRef  = useRef([]);
    const [selected, setSelected] = useState(null);
    const [leafletReady, setLeafletReady] = useState(false);

    // ── 1. LOAD LEAFLET KHI Ở CLIENT ──────────────────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        import('leaflet').then(leaflet => {
            L = leaflet.default || leaflet;
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            setLeafletReady(true);
        });
    }, []);

    // ── 2. KHỞI TẠO BẢN ĐỒ KÈM CLEANUP ─────────────────────────────────────────
    useEffect(() => {
        if (!leafletReady || !mapRef.current) return;

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center:          [10.8, 106.5],
                zoom:            7,
                zoomControl:     true,
                scrollWheelZoom: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
            }).addTo(mapInstance.current);
        }

        // Tối ưu: Chống lỗi "Map container is already initialized" khi chuyển trang
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [leafletReady]);

    // ── 3. RENDER MARKERS KHI CÓ DATA ─────────────────────────────────────────
    useEffect(() => {
        if (!mapInstance.current || !L || locations.length === 0) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const customIcon = L.divIcon({
            className: '',
            html: `<div style="
                width: 28px; height: 28px;
                background: #c8371a;
                border: 3px solid #fff;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(200,55,26,0.5);
            "></div>`,
            iconSize:   [28, 28],
            iconAnchor: [14, 28],
            popupAnchor:[0, -30],
        });

        locations.forEach(loc => {
            const marker = L.marker([parseFloat(loc.lat), parseFloat(loc.lng)], { icon: customIcon })
                .addTo(mapInstance.current)
                .bindPopup(`
                    <div style="font-family:system-ui,sans-serif;min-width:180px">
                        <div style="font-weight:700;font-size:14px;color:#1a1a1a;margin-bottom:4px">
                            ${loc.title}
                        </div>
                        ${loc.location_name ? `<div style="color:#666;font-size:12px;margin-bottom:2px">📍 ${loc.location_name}</div>` : ''}
                        ${loc.year ? `<div style="color:#888;font-size:12px;margin-bottom:6px">🗓 Năm ${loc.year}</div>` : ''}
                        ${loc.description ? `<div style="font-size:12px;color:#444;margin-bottom:8px;line-height:1.4">${loc.description}</div>` : ''}
                        <a href="/projects/${loc.slug}" style="
                            display:inline-block;
                            background:#c8371a;color:#fff;
                            padding:4px 12px;border-radius:6px;
                            font-size:12px;font-weight:600;
                            text-decoration:none;
                        ">Xem dự án →</a>
                    </div>
                `, { maxWidth: 240 });

            marker.on('click', () => setSelected(loc));
            markersRef.current.push(marker);
        });

        // Tối ưu: Zoom vừa tất cả hoặc zoom thẳng nếu chỉ có 1 dự án
        if (locations.length > 1) {
            const group = L.featureGroup(markersRef.current);
            mapInstance.current.fitBounds(group.getBounds().pad(0.2));
        } else if (locations.length === 1) {
            mapInstance.current.setView([parseFloat(locations[0].lat), parseFloat(locations[0].lng)], 12);
        }
    }, [locations, leafletReady]);

    // ── 4. GIAO DIỆN ──────────────────────────────────────────────────────────
    return (
        <section style={{ padding: '60px 0', background: '#f8f8f6' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        display:        'inline-block',
                        background:     '#c8371a',
                        color:          '#fff',
                        fontSize:       '12px',
                        fontWeight:     '600',
                        letterSpacing:  '2px',
                        textTransform:  'uppercase',
                        padding:        '6px 16px',
                        borderRadius:   '20px',
                        marginBottom:   '12px'
                    }}>
                        Bản đồ dự án
                    </div>
                    <h2 style={{
                        fontSize:   'clamp(24px, 4vw, 36px)',
                        fontWeight: '700',
                        color:      '#1a1a1a',
                        margin:     '0 0 12px'
                    }}>
                        Dự Án Tiêu Biểu Trên Toàn Quốc
                    </h2>
                    <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                        {locations.length > 0
                            ? `${locations.length} dự án đã được thực hiện trên khắp cả nước`
                            : 'Các công trình thép chất lượng cao trải dài khắp Việt Nam'
                        }
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    {/* Bản đồ */}
                    <div style={{
                        flex:         1,
                        borderRadius: '16px',
                        overflow:     'hidden',
                        boxShadow:    '0 4px 24px rgba(0,0,0,0.12)',
                        minHeight:    '480px',
                        position:     'relative',
                        background:   '#e8e8e4',
                    }}>
                        {loading && (
                            <div style={{
                                position:       'absolute', inset: 0, zIndex: 10,
                                display:        'flex', alignItems: 'center', justifyContent: 'center',
                                background:     'rgba(248,248,246,0.9)',
                                fontSize:       '14px', color: '#666'
                            }}>
                                Đang tải bản đồ...
                            </div>
                        )}
                        <div ref={mapRef} style={{ width: '100%', height: '480px' }} />
                    </div>

                    {/* Danh sách dự án bên phải */}
                    <div style={{
                        width:        '280px',
                        flexShrink:   0,
                        maxHeight:    '480px',
                        overflowY:    'auto',
                        display:      'flex',
                        flexDirection:'column',
                        gap:          '10px',
                    }}>
                        {loading
                            ? [1,2,3].map(i => (
                                <div key={i} style={{
                                    height: '80px', borderRadius: '10px',
                                    background: '#e5e5e0', animation: 'pulse 1.5s infinite'
                                }}/>
                              ))
                            : (Array.isArray(locations) ? locations : []).map((loc, index) => (
                                <div
                                    key={loc.id}
                                    onClick={() => {
                                        setSelected(loc);
                                        mapInstance.current?.flyTo(
                                            [parseFloat(loc.lat), parseFloat(loc.lng)], 12,
                                            { duration: 1 }
                                        );
                                        // Tối ưu: Dùng trực tiếp Index mảng thay vì gọi .find()
                                        markersRef.current[index]?.openPopup(); 
                                    }}
                                    style={{
                                        padding:      '12px 14px',
                                        borderRadius: '10px',
                                        background:   selected?.id === loc.id ? '#fff5f3' : '#fff',
                                        border:       selected?.id === loc.id
                                                      ? '1.5px solid #c8371a'
                                                      : '1px solid #e5e5e0',
                                        cursor:       'pointer',
                                        transition:   'all 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        if (selected?.id !== loc.id) {
                                            e.currentTarget.style.borderColor = '#c8371a44';
                                            e.currentTarget.style.background  = '#fafafa';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (selected?.id !== loc.id) {
                                            e.currentTarget.style.borderColor = '#e5e5e0';
                                            e.currentTarget.style.background  = '#fff';
                                        }
                                    }}
                                >
                                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a', marginBottom: '4px', lineHeight: 1.3 }}>
                                        {loc.title}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                        {loc.location_name || loc.province || ''}
                                        {loc.year ? ` · ${loc.year}` : ''}
                                    </div>
                                </div>
                              ))
                        }
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.5; }
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 10px !important;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
                }
                .leaflet-popup-tip { background: #fff !important; }
            `}</style>
        </section>
    );
}