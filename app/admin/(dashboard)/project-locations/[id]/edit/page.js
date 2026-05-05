'use client';
import { useState, useEffect, useRef } from 'react';
import { useProjectLocations } from '@/hooks/useProjectLocations';
import AdminForm from '@/components/admin/ui/AdminForm';
import { useRouter, useParams } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

const AdminMapPicker = ({ defaultLat, defaultLng, onSelect }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        import('leaflet').then(leaflet => {
            const L = leaflet.default || leaflet;
            if (!mapInstance.current && mapRef.current) {
                const initLat = defaultLat ? parseFloat(defaultLat) : 10.8;
                const initLng = defaultLng ? parseFloat(defaultLng) : 106.5;

                mapInstance.current = L.map(mapRef.current).setView([initLat, initLng], defaultLat ? 13 : 7);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

                const icon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconAnchor: [12, 41]
                });

                if (defaultLat && defaultLng) {
                    markerRef.current = L.marker([initLat, initLng], { icon }).addTo(mapInstance.current);
                }

                mapInstance.current.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        markerRef.current = L.marker([lat, lng], { icon }).addTo(mapInstance.current);
                    }
                    onSelect(lat, lng);
                });
            }
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [defaultLat, defaultLng]);

    return (
        <div className="mb-4">
            <div className="text-[13px] font-bold mb-2 text-[#1a1a1a]">📍 Click trực tiếp lên bản đồ để chọn nhanh tọa độ:</div>
            <div ref={mapRef} className="w-full h-[260px] rounded-lg z-10 border-2 border-black shadow-[4px_4px_0_0_#000]" />
        </div>
    );
};

export default function EditProjectLocationPage() {
    const params = useParams();
    const id = params.id;
    const { locations, update } = useProjectLocations();
    const router = useRouter();
    
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (locations && locations.length > 0) {
            const item = locations.find(loc => loc.id.toString() === id);
            if (item) setFormData(item);
        }
    }, [locations, id]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            await update(id, formData);
            router.push('/admin/project-locations');
        } catch (err) {
            setFormError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
            setSaving(false);
        }
    };

    const getFormFields = () => [
        { name: 'location_name', label: 'Tên địa điểm', type: 'text', required: true, placeholder: 'VD: KCN Trảng Bàng' },
        { name: 'province', label: 'Tỉnh / Thành phố', type: 'text', required: false, placeholder: 'VD: Tây Ninh' },
        { name: 'lat', label: 'Vĩ độ (Latitude)', type: 'text', required: true, placeholder: 'VD: 11.3502' },
        { name: 'lng', label: 'Kinh độ (Longitude)', type: 'text', required: true, placeholder: 'VD: 106.1001' },
        { name: 'year', label: 'Năm thi công', type: 'number', required: false, placeholder: 'VD: 2024' },
        { name: 'sort_order', label: 'Thứ tự hiển thị', type: 'number', required: false, defaultValue: 0 },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 1, label: 'Hiển thị' }, { value: 0, label: 'Ẩn' }] },
    ];

    if (!formData) return <div className="p-6 font-bold uppercase tracking-widest text-gray-500">Đang tải dữ liệu tọa độ...</div>;

    return (
        <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-3xl">
            <h2 className="mb-6 text-xl font-black uppercase tracking-widest">Chỉnh sửa tọa độ</h2>
            {formError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-bold border border-red-300">{formError}</div>}
            
            <AdminMapPicker 
                defaultLat={formData.lat} 
                defaultLng={formData.lng} 
                onSelect={(lat, lng) => setFormData(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }))} 
            />
            
            <AdminForm 
                fields={getFormFields()} 
                formData={formData} 
                onChange={handleFormChange} 
                onSubmit={handleFormSubmit} 
                loading={saving} 
                btnText="CẬP NHẬT TỌA ĐỘ →" 
            />
        </div>
    );
}