import api from '@/lib/api';

export const configService = {
    getAll: async () => {
        try {
            const res = await api.get('/config');
            return res.data; 
        } catch (error) {
            console.error("Error in configService.getAll:", error);
            throw error;
        }
    },

    show: () => api.get('/config').then(res => res.data),

    update: (data) => api.put('/config', data, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    }).then(res => res.data),
};