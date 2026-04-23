import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';

// ==================== HOOK DANH SÁCH SẢN PHẨM ====================
export const useProducts = (initialFilters = { category_id: '', keyword: '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const { loading, request: fetchProductsRequest } = useApi(productService.getAll);
  const { request: fetchCategoriesRequest } = useApi(categoryService.getAll);
  const { request: deleteRequest } = useApi(productService.delete);

  // 🟢 Khóa mục tiêu params để chống lặp vô tận
  const filterKey = JSON.stringify(filters);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetchProductsRequest(JSON.parse(filterKey));
      setProducts(res?.data?.data || res?.data || res || []);
    } catch (error) {
      toast.error('LỖI TRUY XUẤT KHO HÀNG');
    }
  }, [fetchProductsRequest, filterKey]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetchCategoriesRequest();
      setCategories(res?.data || res || []);
    } catch (error) {
      console.error('Lỗi tải danh mục');
    }
  }, [fetchCategoriesRequest]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`XÁC NHẬN TIÊU HỦY DỮ LIỆU: ${name.toUpperCase()}?`)) return;
    try {
      await deleteRequest(id);
      toast.success('ĐÃ LOẠI BỎ KHỎI HỆ THỐNG');
      fetchProducts();
    } catch (error) {
      toast.error('THAO TÁC THẤT BẠI - KIỂM TRA RÀNG BUỘC ĐƠN HÀNG');
    }
  };

  return { products, categories, loading, filters, setFilter, handleDelete, refresh: fetchProducts };
};

// ==================== HOOK CHI TIẾT SẢN PHẨM ====================
export const useProduct = (id) => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const { loading, request: fetchById } = useApi(productService.getById);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchById(id);
        setProduct(res?.data || res);
      } catch (error) {
        toast.error('MÃ SẢN PHẨM KHÔNG TỒN TẠI');
        router.push('/admin/products');
      }
    };
    load();
  }, [id, fetchById, router]);

  return { product, loading };
};

// hooks/useProducts.js

export const useProductForm = (id = null) => {
    const router = useRouter();
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    // 1. QUẢN LÝ TRẠNG THÁI (STATES)
    const [formData, setFormData] = useState({
        category_id: '', name: '', description: '', content: '', standard: '', application: '', status: 1,
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [images, setImages] = useState([]); 
    const [imagesPreviews, setImagesPreviews] = useState([]); 
    const [deletedImageIds, setDeletedImageIds] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [productAttributes, setProductAttributes] = useState([{ attribute_id: '', value: '' }]);
    const [fetching, setFetching] = useState(!!id);

    // 2. TRIỆU HỒI API (REQUESTS)
    const { loading: submitting, request: createRequest } = useApi(productService.create);
    const { request: updateRequest } = useApi(productService.update);
    const { request: fetchById } = useApi(productService.getById);
    const { request: fetchCategories } = useApi(categoryService.getAll);
    const { request: fetchAttributes } = useApi(productService.getAttributes);

    // 3. ĐỒNG BỘ DỮ LIỆU NỀN (Categories & Attributes)
    useEffect(() => {
        const loadBaseData = async () => {
            try {
                const [catRes, attrRes] = await Promise.all([
                    fetchCategories({ tree: true }),
                    fetchAttributes(),
                ]);
                setCategories(catRes?.data?.data || catRes?.data || catRes || []);
                setAttributes(attrRes?.data?.data || attrRes?.data || attrRes || []);
            } catch (error) { toast.error('LỖI ĐỒNG BỘ THÔNG SỐ'); }
        };
        loadBaseData();
    }, [fetchCategories, fetchAttributes]);

    // 4. LOAD DỮ LIỆU CŨ KHI EDIT
    useEffect(() => {
        if (!id) { setFetching(false); return; }
        const loadProduct = async () => {
            try {
                const res = await fetchById(id);
                const p = res?.data || res;
                setFormData({
                    category_id: p.category_id?.toString() || '',
                    name: p.name || '',
                    description: p.description || '',
                    content: p.content || '',
                    standard: p.standard || '',
                    application: p.application || '',
                    status: p.status ?? 1,
                });
                if (p.thumbnail) setThumbnailPreview(`${imageUrl}/${p.thumbnail}`);
                if (p.images?.length) {
                    setImagesPreviews(p.images.map(img => ({ id: img.id, url: `${imageUrl}/${img.image}`, isOld: true })));
                }
                if (p.attributes?.length) {
                    setProductAttributes(p.attributes.map(attr => ({ attribute_id: attr.attribute_id, value: attr.value })));
                }
            } catch (error) { 
                toast.error('KHÔNG TÌM THẤY SẢN PHẨM');
                router.push('/admin/products'); 
            } finally { setFetching(false); }
        };
        loadProduct();
    }, [id, fetchById, router, imageUrl]);

    // 5. CÁC HÀM XỬ LÝ (HANDLERS)
    const addAttributeRow = () => setProductAttributes([...productAttributes, { attribute_id: '', value: '' }]);
    
    const removeAttributeRow = (index) => {
        const newRows = productAttributes.filter((_, i) => i !== index);
        setProductAttributes(newRows.length > 0 ? newRows : [{ attribute_id: '', value: '' }]);
    };

    const updateAttributeRow = (index, field, value) => {
        const newRows = [...productAttributes];
        newRows[index][field] = value;
        setProductAttributes(newRows);
    };

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files || []);
        setImages(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(f => ({ url: URL.createObjectURL(f), isOld: false }));
        setImagesPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImagePreview = (index) => {
        const target = imagesPreviews[index];
        if (target.isOld) {
            setDeletedImageIds(prev => [...prev, target.id]);
        } else {
            const newImagesIndex = imagesPreviews.slice(0, index).filter(p => !p.isOld).length;
            setImages(prev => prev.filter((_, i) => i !== newImagesIndex));
        }
        setImagesPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            if (id) data.append('_method', 'PUT');
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (thumbnail) data.append('thumbnail', thumbnail);
            images.forEach((file) => data.append('images', file)); 
            if (deletedImageIds.length > 0) data.append('deleted_images', JSON.stringify(deletedImageIds));
            
            const cleanAttributes = productAttributes.filter(a => a.attribute_id && a.value.trim() !== '');
            data.append('attributes', JSON.stringify(cleanAttributes));

            if (id) {
                await updateRequest(id, data);
                toast.success('CẬP NHẬT THÀNH CÔNG');
            } else {
                await createRequest(data);
                toast.success('NHẬP KHO THÀNH CÔNG');
            }
            router.push('/admin/products');
        } catch (error) { toast.error('LỖI DỮ LIỆU HỆ THỐNG'); }
    };

    // 6. XUẤT KHO (RETURN)
    return {
        formData, thumbnailPreview, imagesPreviews, categories, attributes, productAttributes,
        fetching, loading: submitting,
        handleChange: (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })),
        handleThumbnailChange: (e) => {
            const file = e.target.files?.[0];
            if (file) { setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); }
        },
        handleImagesChange, 
        removeImagePreview,
        addAttributeRow,
        removeAttributeRow,
        updateAttributeRow,
        handleSubmit
    };
};