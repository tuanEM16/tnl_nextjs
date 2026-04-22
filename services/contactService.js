import api from '@/lib/api';

export const contactService = {
    getAll: (params) => api.get('/contacts', { params }).then(res => res.data),
    getById: (id) => api.get(`/contacts/${id}`).then(res => res.data),
    updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }).then(res => res.data),
    delete: (id) => api.delete(`/contacts/${id}`).then(res => res.data),
};