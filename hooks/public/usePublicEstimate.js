import { useState, useEffect } from 'react';
import { publicEstimateService } from '@/services/publicEstimateService';

export const useEstimateOptions = () => {
  const [options, setOptions] = useState({ usageTypes: [], materialTypes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await publicEstimateService.getOptions();
        if (res.success) {
          setOptions(res.data);
        }
      } catch (error) {
        console.error('Lỗi lấy tuỳ chọn dự toán:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  return { options, loading };
};

export const useCalculateEstimate = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (data) => {
    setLoading(true);
    try {
      const res = await publicEstimateService.calculate(data);
      if (res.success) {
        setResult(res.data);
      }
    } catch (error) {
      console.error('Lỗi tính toán dự toán:', error);
    } finally {
      setLoading(false);
    }
  };

  return { calculate, result, loading };
};