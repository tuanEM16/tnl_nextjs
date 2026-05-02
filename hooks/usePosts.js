// Thêm 2 thư viện này lên đầu file hooks/usePosts.js nếu chưa có
import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';
import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/postService';
import { useApi } from './useApi';
import toast from 'react-hot-toast';
import { LAYOUT_TYPES, ABOUT_LAYOUTS } from '@/types';
// ==================== HOOK DANH SÁCH BÀI VIẾT ====================
export const usePosts = (initialFilters = {
  post_type: 'post',
  category_id: '',
  page_category_id: '',
  keyword: ''
}) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // Danh mục cho Tin tức
  const [pageCategories, setPageCategories] = useState([]); // Danh mục cho Trang tĩnh (Slot)
  const [filters, setFilters] = useState(initialFilters);

  // 🟢 Triệu hồi các API cần thiết
  const { loading: postsLoading, request: fetchPostsRequest } = useApi(postService.getAll);
  const { request: fetchCategoriesRequest } = useApi(postService.getCategories);
  const { request: fetchPageCategoriesRequest } = useApi(postService.getPageCategories);
  const { request: deleteRequest } = useApi(postService.delete);

  // 1. HÀM LẤY DANH SÁCH BÀI VIẾT (Có lọc)
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetchPostsRequest(filters);
      setPosts(res?.data || res || []);
    } catch (error) {
      toast.error('KHÔNG THỂ TẢI DANH SÁCH BÀI VIẾT');
    }
  }, [filters, fetchPostsRequest]);

  // 2. HÀM LẤY TOÀN BỘ DANH MỤC (Tin tức + Vị trí Web)
  const fetchAllCategories = useCallback(async () => {
    try {
      const [resCat, resPageCat] = await Promise.all([
        fetchCategoriesRequest(),
        fetchPageCategoriesRequest()
      ]);
      setCategories(resCat?.data || resCat || []);
      setPageCategories(resPageCat?.data || resPageCat || []);
    } catch (error) {
      console.error('❌ LỖI TẢI DANH MỤC:', error.message);
    }
  }, [fetchCategoriesRequest, fetchPageCategoriesRequest]);

  // Chạy một lần khi khởi động để lấy "đạn" (danh mục)
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Chạy mỗi khi bộ lọc thay đổi
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. XỬ LÝ ĐỔI LOẠI BÀI VIẾT (Reset các bộ lọc con)
  const handleTypeChange = (type) => {
    setFilters({
      post_type: type,
      category_id: '',
      page_category_id: '',
      keyword: '', // Có thể giữ lại keyword nếu muốn
    });
  };

  // 4. CẬP NHẬT BỘ LỌC TỪNG CÁI
  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    posts,
    categories,
    pageCategories,
    loading: postsLoading,
    filters,
    setFilter,
    handleTypeChange,
    // Hàm xóa bài viết có xác nhận
    handleDelete: async (id, title) => {
      if (!window.confirm(`TIÊU HỦY VĨNH VIỄN: ${title.toUpperCase()}?`)) return;
      try {
        await deleteRequest(id);
        toast.success('ĐÃ TIÊU HỦY THÀNH CÔNG');
        fetchPosts(); // Load lại danh sách sau khi xóa
      } catch (error) {
        toast.error('XÓA THẤT BẠI');
      }
    },
    refreshPosts: fetchPosts,
  };
};

// ==================== HOOK CHI TIẾT BÀI VIẾT ====================
export const usePost = (id) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const { loading, request: fetchById } = useApi(postService.getById);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchById(id);
        // 🟢 Fix bốc dữ liệu phẳng
        setPost(res?.data || res);
      } catch (error) {
        toast.error('KHÔNG TÌM THẤY DỮ LIỆU BÀI VIẾT');
        router.push('/admin/posts');
      }
    };
    load();
  }, [id, fetchById, router]);

  return { post, loading };
};

// ==================== HOOK FORM ADD/EDIT BÀI VIẾT ====================
// hooks/usePosts.js (Phần usePostForm)

export const usePostForm = (id = null) => {
    const router = useRouter();
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    // 1. Khởi tạo State Form
    const [formData, setFormData] = useState({
        title: '',
        post_type: 'post',
        category_id: '',
        page_category_id: '',
        description: '',
        content: '', // Đây là nơi sẽ chứa chuỗi JSON nếu là trang Giới thiệu
        status: 1,
        layout: 'text',
        sort_order: 0,
        meta_title: '',
        meta_description: '',
        meta_content: '',
        meta: {}, // Object tạm để quản lý dữ liệu UI trang Giới thiệu
    });

    const [categories, setCategories] = useState([]);
    const [pageCategories, setPageCategories] = useState([]); 
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [fetching, setFetching] = useState(!!id);

    const { loading: submitting, request: createRequest } = useApi(postService.create);
    const { loading: updating, request: updateRequest } = useApi(postService.update);
    const { request: fetchById } = useApi(postService.getById);

    // 2. Load danh mục ban đầu
    useEffect(() => {
        const loadData = async () => {
            try {
                const [resCat, resPageCat] = await Promise.all([
                    postService.getCategories(),
                    postService.getPageCategories()
                ]);
                setCategories(resCat?.data || resCat || []);
                setPageCategories(resPageCat?.data || resPageCat || []);
            } catch (error) { console.error('Lỗi tải danh mục'); }
        };
        loadData();
    }, []);

    // 3. Nhận diện trang Giới thiệu dựa trên post_type và slug danh mục
    const selectedPageCat = pageCategories.find(c => c.id?.toString() === formData.page_category_id?.toString());
    const isAboutPage = formData.post_type === 'page' && selectedPageCat && 
        (selectedPageCat.slug?.includes('gioi-thieu') || selectedPageCat.name?.toLowerCase().includes('giới'));

    // 4. Load bài cũ và giải nén JSON nếu là trang Giới thiệu[cite: 1]
    useEffect(() => {
        if (!id) return;
        const loadPost = async () => {
            try {
                const res = await fetchById(id);
                const post = res?.data || res;
                
                let parsedMeta = {};
                // Nếu là trang giới thiệu, bóc tách JSON từ cột content[cite: 1]
                if (post.post_type === 'page' && post.content) {
                    try {
                        parsedMeta = JSON.parse(post.content);
                    } catch (e) { parsedMeta = {}; }
                }

                setFormData({
                    ...post,
                    category_id: post.category_id?.toString() || '',
                    page_category_id: post.page_category_id?.toString() || '',
                    layout: post.layout || 'text',
                    meta: parsedMeta, // Đưa dữ liệu đã parse vào meta để UI hiển thị[cite: 1]
                });
                if (post.image) setPreview(`${imageUrl}/${post.image}`);
            } catch (error) { router.push('/admin/posts'); }
            finally { setFetching(false); }
        };
        loadPost();
    }, [id, fetchById, router, imageUrl]);

    // 5. Hàm cập nhật Meta và đóng gói ngược lại JSON vào content[cite: 1]
    const updateMeta = (newMeta) => {
        setFormData(prev => ({
            ...prev,
            meta: newMeta,
            content: JSON.stringify(newMeta) // Đồng bộ JSON vào cột content[cite: 1]
        }));
    };

    return {
        formData, categories, pageCategories, fetching, isAboutPage,
        loading: submitting || updating, preview,
        
        handleChange: (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })),

        handleContentChange: (value) => {
            // Nếu không phải About Page, nội dung HTML sẽ được lưu bình thường[cite: 1]
            if (!isAboutPage) {
                const targetField = formData.post_type === 'page' ? 'meta_content' : 'content';
                setFormData(prev => ({ ...prev, [targetField]: value }));
            }
        },

        handleImageChange: (e) => {
            const file = e.target.files?.[0];
            if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
        },
        
        // CÁC HÀM THAO TÁC META DATA (Dành riêng cho trang Giới thiệu)[cite: 1]
        handleMetaChange: (e) => updateMeta({ ...(formData.meta || {}), [e.target.name]: e.target.value }),
        
        handleAboutQuillChange: (name, value) => updateMeta({ ...(formData.meta || {}), [name]: value }),
        
        handleArrayChange: (arrayName, index, field, value) => {
            const newArray = [...((formData.meta || {})[arrayName] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            updateMeta({ ...(formData.meta || {}), [arrayName]: newArray });
        },

        handleAddArrayItem: (arrayName, defaultItem) => {
            const newArray = [...((formData.meta || {})[arrayName] || []), { ...defaultItem, id: Date.now() }];
            updateMeta({ ...(formData.meta || {}), [arrayName]: newArray });
        },

        handleRemoveArrayItem: (arrayName, index) => {
            const newArray = [...((formData.meta || {})[arrayName] || [])];
            newArray.splice(index, 1);
            updateMeta({ ...(formData.meta || {}), [arrayName]: newArray });
        },

        // 6. Gửi dữ liệu (Submit)
        handleSubmit: async (e) => {
            e.preventDefault();
            const data = new FormData();
            
            // Chỉ append các trường thực sự có trong Database để tránh lỗi "Unknown column"[cite: 1]
            const dbFields = [
                'title', 'post_type', 'category_id', 'page_category_id', 
                'description', 'content', 'status', 'layout', 'sort_order',
                'meta_title', 'meta_description', 'meta_content'
            ];

            dbFields.forEach(key => {
                if (formData[key] !== undefined) data.append(key, formData[key]);
            });

            if (imageFile) data.append('image', imageFile);

            try {
                id ? await updateRequest(id, data) : await createRequest(data);
                toast.success('LƯU NỘI DUNG THÀNH CÔNG!');
                router.push('/admin/posts');
            } catch (error) { toast.error('CÓ LỖI XẢY RA!'); }
        },
    };
};

// ==================== HOOK EDITOR TOOLS (EXCEL, OCR, UPLOAD ẢNH QUILL) ====================
export const useEditorTools = (quillRef) => {
  const [isScanning, setIsScanning] = useState(false);

  // 🟢 HÀM NHẬP EXCEL THÀNH BẢNG HTML
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      
      const range = XLSX.utils.decode_range(ws['!ref']);
      let tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 4px solid black; margin: 20px 0;">';
      
      // Tạo Header (Dòng đầu tiên)
      tableHtml += '<tr>';
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
        const cell = ws[cellAddress];
        tableHtml += `<th style="border: 2px solid black; padding: 8px; background: #f3f4f6; font-weight: 900; text-align: center;">${cell ? cell.v : ''}</th>`;
      }
      tableHtml += '</tr>';
      
      // Tạo Data Rows
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        tableHtml += '<tr>';
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellAddress];
          tableHtml += `<td style="border: 2px solid black; padding: 8px; text-align: center;">${cell ? cell.v : ''}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      
      // Đẩy vào Quill Editor
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range_selection = editor.getSelection(true);
        editor.clipboard.dangerouslyPasteHTML(range_selection.index, tableHtml);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // Reset input để có thể chọn lại file cũ
  };

  // 🟢 HÀM QUÉT ẢNH OCR BÓC TÁCH THÔNG SỐ THÉP
  const handleImageOCR = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const worker = await createWorker('vie', 1, { logger: m => console.log(m) });
      await worker.setParameters({ tessedit_pageseg_mode: 6 });
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0);
      let tableHtml = `<table style="width:100%; border-collapse:collapse; border:4px solid black;">`;
      tableHtml += `<tr><th>Quy cách</th><th>m</th><th>kg/m</th><th>kg/cây</th></tr>`;

      rows.forEach(row => {
        // Regex tách chuẩn cho dòng thép (Bám sát theo code của bạn)
        const match = row.match(/(H[\d\sxXmm\.]+)\s+(\d+)\s+([\d\.]+)\s+([\d\.]+)/);
        if (match) {
          const [, spec, m, kgm, kgcay] = match;
          tableHtml += `<tr><td>${spec}</td><td>${m}</td><td>${kgm}</td><td>${kgcay}</td></tr>`;
        }
      });
      tableHtml += `</table>`;

      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
      }
    } catch (err) {
      console.error('Lỗi OCR:', err);
    } finally {
      setIsScanning(false);
      e.target.value = null;
    }
  };

  // 🟢 HÀM XỬ LÝ UPLOAD ẢNH TRỰC TIẾP TRONG QUILL
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      try {
        const res = await fetch('http://localhost:5000/api/posts/upload-content', { 
          method: 'POST', 
          body: uploadData 
        });
        const result = await res.json();
        
        if (result.filename && quillRef.current) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', `http://localhost:5000/uploads/${result.filename}`);
        }
      } catch (error) {
        console.error('Lỗi upload ảnh nội dung:', error);
      }
    };
  }, [quillRef]);

  return { isScanning, handleExcelImport, handleImageOCR, imageHandler };
};
// ==================== HOOK FORM ADD/EDIT CHO TRANG GIỚI THIỆU (ABOUT SECTION) ====================
export const useSectionForm = (id = null) => {
  const router = useRouter();
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  // 🟢 State gộp chung cả dữ liệu của bảng `about_section` và `about_section_meta`
  const [formData, setFormData] = useState({
    name: '',
    layout: 'text',
    sort_order: 0,
    status: 1,
    // Các trường bắt đầu bằng meta_ sẽ được Backend bóc ra lưu vào bảng about_section_meta
    meta_title: '',
    meta_description: '',
    meta_content: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [oldImage, setOldImage] = useState('');
  const [fetching, setFetching] = useState(!!id);
  const [loading, setLoading] = useState(false);

  // 🟢 (Tùy chọn) Đại ca thay thế bằng service thật sau (VD: aboutService.create, aboutService.update)
  // const { loading: submitting, request: createRequest } = useApi(aboutService.create);
  // const { loading: updating, request: updateRequest } = useApi(aboutService.update);
  // const { request: fetchById } = useApi(aboutService.getById);

  // 🟢 Load dữ liệu cũ khi Sửa (Trang Edit)
  useEffect(() => {
    if (!id) return;
    const loadSection = async () => {
      try {
        // MOCK DATA: Chờ ghép API thật
        // const res = await fetchById(id);
        // const section = res?.data || res;
        // setFormData({ ... })
        setFetching(false);
      } catch (error) {
        toast.error('KHÔNG TÌM THẤY DỮ LIỆU SECTION');
        router.push('/admin/about');
      } finally {
        setFetching(false);
      }
    };
    loadSection();
  }, [id, router]);

  return {
    formData,
    fetching,
    loading, // Nếu dùng useApi thì đổi thành: submitting || updating
    preview,
    oldImage,
    
    // Hàm xử lý nhập text thông thường
    handleChange: (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    
    // Hàm xử lý chọn ảnh bìa (Cover Asset)
    handleImageChange: (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    
    // Hàm Submit gửi lên API
    handleSubmit: async (e) => {
      e.preventDefault();
      setLoading(true);

      // Đóng gói dữ liệu bắn lên API
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('meta_image', imageFile);

      try {
        // CALL API TẠI ĐÂY:
        // id ? await updateRequest(id, data) : await createRequest(data);
        
        console.log("Dữ liệu chuẩn bị bắn lên API:", Object.fromEntries(data));
        toast.success(id ? 'CẬP NHẬT THÀNH CÔNG!' : 'TẠO SECTION THÀNH CÔNG!');
        
        // Tạo xong thì đá về danh sách
        setTimeout(() => router.push('/admin/about'), 1000);
      } catch (error) {
        toast.error('CÓ LỖI XẢY RA KHI LƯU DỮ LIỆU');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  };
};