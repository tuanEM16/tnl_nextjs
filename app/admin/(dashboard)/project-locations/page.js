'use client';
import { useProjectLocations } from '@/hooks/useProjectLocations';
import AdminTable from '@/components/admin/ui/AdminTable';
import PageHeader from '@/components/admin/ui/PageHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProjectLocationsPage() {
    const { locations, loading, destroy } = useProjectLocations();
    const router = useRouter();

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa tọa độ dự án này khỏi bản đồ?')) return;
        try {
            await destroy(id);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    const columns = [
        { key: 'title', label: 'Dự án', render: (val) => val },
        { key: 'location_name', label: 'Địa điểm', render: (val) => val },
        { key: 'province', label: 'Tỉnh/Thành', render: (val) => val },
        { key: 'year', label: 'Năm', render: (val) => val },
        {
            key: 'coordinates',
            label: 'Tọa độ',
            render: (_, row) => row ? (
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                    {parseFloat(row.lat).toFixed(4)}, {parseFloat(row.lng).toFixed(4)}
                </span>
            ) : null
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (val) => (
                <span style={{
                    background: val ? '#dcfce7' : '#fee2e2',
                    color: val ? '#166534' : '#991b1b',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'
                }}>
                    {val ? 'Hiển thị' : 'Ẩn'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => router.push(`/admin/project-locations/${row.id}/edit`)}
                        style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                        Sửa
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                        Xóa
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <PageHeader title="Bản đồ Dự án" />
                <Link
                    href="/admin/project-locations/add"
                    style={{
                        background: '#c8371a', color: '#fff', padding: '10px 20px', borderRadius: '8px',
                        fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 6px rgba(200,55,26,0.3)'
                    }}
                >
                    + Thêm tọa độ
                </Link>
            </div>

            <AdminTable
                columns={columns}
                data={locations}
                loading={loading}
                emptyText="Chưa có dự án nào trên bản đồ"
            />
        </div>
    );
}