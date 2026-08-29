import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Plus, Edit2, Trash2, Save,
  Layers, Briefcase, PhoneCall, Upload, AlertCircle, CheckCircle, Globe, Languages
} from 'lucide-react';
import { 
  getProjects, fetchProjectsFromSupabase, addProject, updateProject, deleteProject,
  getCategories, fetchCategoriesFromSupabase, addCategory, updateCategory, deleteCategory,
  getContactInfo, fetchContactInfoFromSupabase, updateContactInfo
} from '../utils/projectData';
import Logo from '../components/Logo';

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const subView = searchParams.get('view') || 'list';
  const editingId = searchParams.get('id');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Tab control: 'categories', 'projects', 'contact'
  const [activeTab, setActiveTab] = useState('projects');
  
  // Local state for editing data (handling uploads and temporary updates in forms)
  const [editingData, setEditingData] = useState(null);
  
  // Loaded collections state
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contactData, setContactData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Success alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    status: 'idle', // 'idle', 'loading', 'success'
    successMessage: ''
  });

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setCategories(getCategories());
      setProjects(getProjects());
      setContactData(getContactInfo());
      
      // Async sync from Supabase
      Promise.all([
        fetchCategoriesFromSupabase(),
        fetchProjectsFromSupabase(),
        fetchContactInfoFromSupabase()
      ]).then(([dbCats, dbProjs, dbContact]) => {
        if (dbCats) setCategories(dbCats);
        if (dbProjs) setProjects(dbProjs);
        if (dbContact) setContactData(dbContact);
        setLoading(false);
      }).catch(err => {
        console.error('Error fetching admin data:', err);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  // Sync editingData with URL parameters for edit views
  useEffect(() => {
    if (subView === 'edit-project' && editingId) {
      const proj = projects.find(p => p.id === parseInt(editingId));
      if (proj) setEditingData(JSON.parse(JSON.stringify(proj)));
    } else if (subView === 'edit-category' && editingId) {
      const cat = categories.find(c => c.id === editingId);
      if (cat) setEditingData(JSON.parse(JSON.stringify(cat)));
    } else {
      setEditingData(null);
    }
  }, [subView, editingId, projects, categories]);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Auto-Translation Helper Function
  const handleAutoTranslate = async (fieldName, sourceVal) => {
    if (!sourceVal || !sourceVal.trim()) {
      showAlert('يرجى كتابة النص باللغة العربية أولاً ليتم ترجمته', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceVal)}&langpair=ar|en`);
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const translatedText = data.responseData.translatedText;
        setEditingData(prev => ({
          ...prev,
          [fieldName]: translatedText
        }));
      } else {
        showAlert('فشلت الترجمة التلقائية، يرجى المحاولة مجدداً أو تعبئته يدوياً', 'error');
      }
    } catch (e) {
      console.error('Translation error:', e);
      showAlert('حدث خطأ أثناء الاتصال بخدمة الترجمة', 'error');
    }
    setLoading(false);
  };

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'aura2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  // Base64 file converter with image compression
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1000;
          const maxHeight = 1000;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Category Actions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const catData = {
      id: (formData.get('id') || '').trim(),
      title: (formData.get('title') || '').trim(),
      titleEn: (formData.get('titleEn') || '').trim(),
      desc: formData.get('desc'),
      descEn: formData.get('descEn'),
      bannerImg: editingData?.bannerImg || ''
    };

    if (!catData.id || !catData.title) {
      showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);
    if (subView === 'edit-category') {
      const updated = await updateCategory(catData);
      setCategories(updated);
      showAlert('تم تعديل الفئة بنجاح');
    } else {
      if (categories.some(c => c.id === catData.id)) {
        showAlert('معرّف الفئة (ID) موجود بالفعل، يرجى استخدام معرّف فريد', 'error');
        setLoading(false);
        return;
      }
      const updated = await addCategory(catData);
      setCategories(updated);
      showAlert('تم إضافة الفئة بنجاح');
    }
    setLoading(false);
    setSearchParams({}); // return back to list view
  };

  const handleDeleteCategory = (id) => {
    setConfirmModal({
      show: true,
      title: 'تأكيد حذف الفئة',
      message: 'هل أنت متأكد من حذف هذه الفئة؟ سيتم حذفها نهائياً من القوائم.',
      status: 'idle',
      successMessage: 'تم حذف الفئة بنجاح',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, status: 'loading' }));
        const updated = await deleteCategory(id);
        setCategories(updated);
        setConfirmModal(prev => ({ ...prev, status: 'success' }));
        setTimeout(() => {
          setConfirmModal(prev => ({ ...prev, show: false }));
        }, 1500);
      }
    });
  };

  // Project Actions
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const projData = {
      title: (formData.get('title') || '').trim(),
      titleEn: (formData.get('titleEn') || '').trim(),
      subtitle: (formData.get('subtitle') || '').trim(),
      subtitleEn: (formData.get('subtitleEn') || '').trim(),
      desc: formData.get('desc'),
      descEn: formData.get('descEn'),
      category: (formData.get('category') || '').trim(),
      space: (formData.get('space') || '').trim(),
      duration: (formData.get('duration') || '').trim(),
      durationEn: (formData.get('durationEn') || '').trim(),
      year: (formData.get('year') || '').trim(),
      location: (formData.get('location') || '').trim(),
      locationEn: (formData.get('locationEn') || '').trim(),
      materials: (formData.get('materials') || '').trim(),
      materialsEn: (formData.get('materialsEn') || '').trim(),
      defaultImg: editingData?.defaultImg || '',
      gallery: editingData?.gallery || []
    };

    if (subView === 'edit-project' && editingId) {
      projData.id = parseInt(editingId);
    }

    if (!projData.title || !projData.category) {
      showAlert('يرجى ملء الحقول الأساسية: العنوان والقسم', 'error');
      return;
    }

    setLoading(true);
    if (subView === 'edit-project') {
      const updated = await updateProject(projData);
      setProjects(updated);
      showAlert('تم تعديل المشروع بنجاح');
    } else {
      const updated = await addProject(projData);
      setProjects(updated);
      showAlert('تم إضافة المشروع بنجاح');
    }
    setLoading(false);
    setSearchParams({}); // return back to list view
  };

  const handleDeleteProject = (id) => {
    setConfirmModal({
      show: true,
      title: 'تأكيد حذف المشروع',
      message: 'هل أنت متأكد من حذف هذا المشروع؟ سيتم إزالته نهائياً من معرض الأعمال.',
      status: 'idle',
      successMessage: 'تم حذف المشروع بنجاح',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, status: 'loading' }));
        const updated = await deleteProject(id);
        setProjects(updated);
        setConfirmModal(prev => ({ ...prev, status: 'success' }));
        setTimeout(() => {
          setConfirmModal(prev => ({ ...prev, show: false }));
        }, 1500);
      }
    });
  };

  // Contact Actions
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const info = {
      address: formData.get('address'),
      phone: formData.get('phone'),
      phoneLink: `tel:${formData.get('phone').replace(/\s+/g, '')}`,
      email: formData.get('email'),
      emailLink: `mailto:${formData.get('email')}`,
      hours: formData.get('hours'),
      whatsapp: formData.get('whatsapp'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram')
    };

    setLoading(true);
    const updated = await updateContactInfo(info);
    setContactData(updated);
    setLoading(false);
    showAlert('تم تحديث بيانات التواصل بنجاح');
  };

  // Password Lock view
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '90vh', backgroundColor: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', direction: 'rtl' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '380px', textAlign: 'right' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(161, 154, 140, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-gold)' }}>
              <Lock size={24} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.25rem', textAlign: 'center', fontFamily: 'var(--font-arabic)' }}>لوحة تحكم AURA NEST</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '1.75rem', textAlign: 'center', fontFamily: 'var(--font-arabic)' }}>يرجى إدخال كلمة المرور للوصول المباشر للوحة الإدارة</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>كلمة المرور</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)' }}
              />
              {authError && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block', fontFamily: 'var(--font-arabic)' }}>{authError}</span>}
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontFamily: 'var(--font-arabic)' }}>
              دخول لوحة التحكم
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', direction: 'rtl', textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
      
      {/* BRANDED NAVBAR HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(246, 244, 238, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(161, 154, 140, 0.15)',
          boxShadow: 'var(--shadow-sm)',
          height: '60px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Logo height={28} isWhite={false} />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--dark-charcoal)', fontFamily: 'var(--font-arabic)', borderRight: '1px solid rgba(161, 154, 140, 0.3)', paddingRight: '0.75rem', marginRight: '0.75rem' }}>
              لوحة التحكم
            </span>
          </div>

          {subView === 'list' && (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => setActiveTab('projects')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'projects' ? 800 : 600,
                  color: activeTab === 'projects' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  fontFamily: 'var(--font-arabic)',
                  borderBottom: activeTab === 'projects' ? '2px solid var(--primary-gold)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                المشاريع ({projects.length})
              </button>
              
              <button 
                onClick={() => setActiveTab('categories')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'categories' ? 800 : 600,
                  color: activeTab === 'categories' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  fontFamily: 'var(--font-arabic)',
                  borderBottom: activeTab === 'categories' ? '2px solid var(--primary-gold)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                الفئات ({categories.length})
              </button>

              <button 
                onClick={() => setActiveTab('contact')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'contact' ? 800 : 600,
                  color: activeTab === 'contact' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  fontFamily: 'var(--font-arabic)',
                  borderBottom: activeTab === 'contact' ? '2px solid var(--primary-gold)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                بيانات الاتصال
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Centered Action Alert Modal */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(63, 64, 66, 0.2)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 99999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              direction: 'rtl'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '6px',
                padding: '2rem 3rem',
                border: '1px solid var(--light-beige)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'center',
                maxWidth: '340px',
                width: '100%'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: alert.type === 'success' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: alert.type === 'success' ? '#2ecc71' : '#e74c3c' }}>
                {alert.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: 0, fontFamily: 'var(--font-arabic)' }}>
                {alert.message}
              </h4>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(63, 64, 66, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 99999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              direction: 'rtl'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'var(--white)',
                borderRadius: '8px',
                padding: '2.25rem 2rem',
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'center',
                border: '1px solid var(--light-beige)'
              }}
            >
              {confirmModal.status === 'idle' && (
                <>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.65rem', fontFamily: 'var(--font-arabic)' }}>
                    {confirmModal.title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', marginBottom: '2rem', lineHeight: '1.6', fontFamily: 'var(--font-arabic)' }}>
                    {confirmModal.message}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                      onClick={confirmModal.onConfirm}
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 1.75rem', fontSize: '0.85rem', fontFamily: 'var(--font-arabic)', backgroundColor: '#e74c3c', borderColor: '#e74c3c' }}
                    >
                      تأكيد الحذف
                    </button>
                    <button
                      onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                      className="btn"
                      style={{ padding: '0.65rem 1.75rem', fontSize: '0.85rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', fontFamily: 'var(--font-arabic)' }}
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              )}

              {confirmModal.status === 'loading' && (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ width: '36px', height: '36px', border: '2px solid var(--light-beige)', borderTopColor: '#e74c3c', borderRadius: '50%', margin: '0 auto 1.25rem auto', animation: 'spin 1s infinite linear' }} />
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', fontFamily: 'var(--font-arabic)', margin: 0 }}>يتم الآن معالجة الحذف...</p>
                </div>
              )}

              {confirmModal.status === 'success' && (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(46, 204, 113, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71', margin: '0 auto 1rem auto' }}>
                    <CheckCircle size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2ecc71', margin: 0, fontFamily: 'var(--font-arabic)' }}>
                    {confirmModal.successMessage}
                  </h4>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        {loading && subView === 'list' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ width: '30px', height: '30px', border: '2px solid var(--light-beige)', borderTopColor: 'var(--primary-gold)', borderRadius: '50%', margin: '0 auto 0.75rem auto', animation: 'spin 1s infinite linear' }} />
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', fontFamily: 'var(--font-arabic)' }}>يتم تحميل وتحديث البيانات...</p>
          </div>
        )}

        {/* LIST SUBVIEW */}
        {!loading && subView === 'list' && (
          <>
            {activeTab === 'categories' && (
              <div style={{ direction: 'rtl' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 800, fontFamily: 'var(--font-arabic)' }}>إدارة الفئات الهندسية</h3>
                  <button 
                    onClick={() => setSearchParams({ view: 'add-category' })}
                    className="btn btn-primary" 
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', fontFamily: 'var(--font-arabic)' }}
                  >
                    <Plus size={14} style={{ marginLeft: '0.25rem' }} />
                    <span>إضافة فئة جديدة</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      style={{ 
                        padding: '1.5rem', 
                        backgroundColor: 'var(--white)', 
                        border: '1px solid var(--light-beige)', 
                        borderRadius: '6px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem', 
                        textAlign: 'right' 
                      }}
                    >
                      {cat.bannerImg && (
                        <div style={{ height: '120px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                          <img src={cat.bannerImg} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: 0, fontFamily: 'var(--font-arabic)' }}>{cat.title}</h4>
                        {cat.titleEn && <span style={{ fontSize: '0.82rem', color: 'var(--text-gray)', display: 'block' }}>EN: {cat.titleEn}</span>}
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 600 }}>معرّف المسار: /{cat.id}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', lineHeight: '1.5', marginTop: '0.5rem', margin: 0 }}>{cat.desc}</p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--light-beige)', paddingTop: '0.75rem' }}>
                        <button 
                          onClick={() => setSearchParams({ view: 'edit-category', id: cat.id })}
                          className="btn" 
                          style={{ flexGrow: 1, padding: '0.45rem', fontSize: '0.82rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', justifyContent: 'center', fontFamily: 'var(--font-arabic)' }}
                        >
                          <Edit2 size={13} style={{ marginLeft: '0.2rem' }} />
                          <span>تعديل</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="btn" 
                          style={{ flexGrow: 1, padding: '0.45rem', fontSize: '0.82rem', border: '1px solid #f9d5d5', color: '#e74c3c', justifyContent: 'center', backgroundColor: '#fff6f6', fontFamily: 'var(--font-arabic)' }}
                        >
                          <Trash2 size={13} style={{ marginLeft: '0.2rem' }} />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div style={{ direction: 'rtl' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 800, fontFamily: 'var(--font-arabic)' }}>إدارة المشاريع (أعمالنا)</h3>
                  <button 
                    onClick={() => setSearchParams({ view: 'add-project' })}
                    className="btn btn-primary" 
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', fontFamily: 'var(--font-arabic)' }}
                  >
                    <Plus size={14} style={{ marginLeft: '0.25rem' }} />
                    <span>إضافة مشروع جديد</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {projects.map(proj => (
                    <div 
                      key={proj.id} 
                      style={{ 
                        padding: '1.5rem', 
                        backgroundColor: 'var(--white)', 
                        border: '1px solid var(--light-beige)', 
                        borderRadius: '6px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem', 
                        textAlign: 'right' 
                      }}
                    >
                      {(proj.customImg || proj.defaultImg) && (
                        <div style={{ height: '140px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                          <img src={proj.customImg || proj.defaultImg} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-gold)', fontWeight: 700, backgroundColor: 'var(--ivory)', padding: '0.2rem 0.5rem', borderRadius: '3px', fontFamily: 'var(--font-arabic)' }}>
                          {proj.category}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: '0.5rem 0 0 0', fontFamily: 'var(--font-arabic)' }}>{proj.title}</h4>
                        {proj.titleEn && <span style={{ fontSize: '0.82rem', color: 'var(--text-gray)', display: 'block' }}>EN: {proj.titleEn}</span>}
                        <span style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', display: 'block' }}>{proj.subtitle}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', lineHeight: '1.5', marginTop: '0.5rem', margin: 0 }}>
                          {proj.desc && proj.desc.length > 100 ? `${proj.desc.substring(0, 100)}...` : proj.desc}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                        <span>📍 {proj.location}</span>
                        <span>•</span>
                        <span>📐 {proj.space}</span>
                        <span>•</span>
                        <span>⏳ {proj.duration}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--light-beige)', paddingTop: '0.75rem' }}>
                        <button 
                          onClick={() => setSearchParams({ view: 'edit-project', id: proj.id })}
                          className="btn" 
                          style={{ flexGrow: 1, padding: '0.45rem', fontSize: '0.82rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', justifyContent: 'center', fontFamily: 'var(--font-arabic)' }}
                        >
                          <Edit2 size={13} style={{ marginLeft: '0.2rem' }} />
                          <span>تعديل</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(proj.id)}
                          className="btn" 
                          style={{ flexGrow: 1, padding: '0.45rem', fontSize: '0.82rem', border: '1px solid #f9d5d5', color: '#e74c3c', justifyContent: 'center', backgroundColor: '#fff6f6', fontFamily: 'var(--font-arabic)' }}
                        >
                          <Trash2 size={13} style={{ marginLeft: '0.2rem' }} />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div 
                style={{ 
                  padding: '2rem', 
                  backgroundColor: 'var(--white)', 
                  border: '1px solid var(--light-beige)', 
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-sm)',
                  direction: 'rtl', 
                  textAlign: 'right' 
                }}
              >
                <h3 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 800, marginBottom: '2rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '0.75rem', fontFamily: 'var(--font-arabic)' }}>
                  تعديل بيانات التواصل والموقع الأساسية
                </h3>
                
                <form onSubmit={handleContactSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="contact-admin-form">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>العنوان الفعلي (المقر الرئيسي)</label>
                    <input 
                      type="text" 
                      name="address" 
                      className="form-control" 
                      defaultValue={contactData.address || ''} 
                      placeholder="مثال: التجمع الخامس - الحي الثاني..."
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>رقم الهاتف الظاهر للمراسلة</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="form-control" 
                      defaultValue={contactData.phone || ''} 
                      placeholder="مثال: 01111 014 008"
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>البريد الإلكتروني الأساسي</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control" 
                      defaultValue={contactData.email || ''} 
                      placeholder="مثال: info@aura-nest.net"
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>رقم الواتساب الدولي (للإرسال المباشر)</label>
                    <input 
                      type="text" 
                      name="whatsapp" 
                      className="form-control" 
                      defaultValue={contactData.whatsapp || ''} 
                      placeholder="مثال: 201111014008"
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>رابط صفحة الفيسبوك (Facebook)</label>
                    <input 
                      type="text" 
                      name="facebook" 
                      className="form-control" 
                      defaultValue={contactData.facebook || ''} 
                      placeholder="مثال: https://www.facebook.com/..."
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>رابط حساب الإنستجرام (Instagram)</label>
                    <input 
                      type="text" 
                      name="instagram" 
                      className="form-control" 
                      defaultValue={contactData.instagram || ''} 
                      placeholder="مثال: https://instagram.com/..."
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>ساعات وأيام العمل الرسمية</label>
                    <input 
                      type="text" 
                      name="hours" 
                      className="form-control" 
                      defaultValue={contactData.hours || ''} 
                      placeholder="مثال: ١٠ ص — ٨ م (يومياً عدا الجمعة)"
                      style={{ fontFamily: 'var(--font-arabic)' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontFamily: 'var(--font-arabic)', fontSize: '0.9rem' }}>
                      <Save size={15} style={{ marginLeft: '0.4rem' }} />
                      <span>حفظ وتحديث البيانات</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* ADD/EDIT CATEGORY VIEW */}
        {(subView === 'add-category' || subView === 'edit-category') && (
          <div 
            style={{ 
              padding: '2rem', 
              backgroundColor: 'var(--white)', 
              border: '1px solid var(--light-beige)', 
              borderRadius: '6px',
              boxShadow: 'var(--shadow-sm)',
              direction: 'rtl', 
              textAlign: 'right' 
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '2rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '0.75rem', fontFamily: 'var(--font-arabic)' }}>
              {subView === 'edit-category' ? 'تعديل الفئة الهندسية' : 'إضافة فئة هندسية جديدة'}
            </h3>

            <form key={editingData?.id || 'new-category'} onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>معرّف الفئة (ID) بالإنجليزية (يُستخدم للرابط الإلكتروني)*</label>
                <input 
                  type="text" 
                  name="id" 
                  className="form-control" 
                  placeholder="مثال: interior"
                  defaultValue={editingData?.id || ''}
                  disabled={subView === 'edit-category'}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>اسم الفئة باللغة العربية (Title)*</label>
                <input 
                  type="text" 
                  id="cat_title_ar"
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: التصميم الداخلي والديكور"
                  defaultValue={editingData?.title || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>اسم الفئة باللغة الإنجليزية (Title EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('titleEn', document.getElementById('cat_title_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للفئة</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="titleEn" 
                  className="form-control" 
                  placeholder="e.g. Interior Design & Decoration"
                  value={editingData?.titleEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, titleEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>الوصف باللغة العربية (Description)</label>
                <textarea 
                  id="cat_desc_ar"
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً معبراً عن هذا التخصص الهندسي..."
                  defaultValue={editingData?.desc || ''}
                  rows="3"
                  style={{ resize: 'none', fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>الوصف باللغة الإنجليزية (Description EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('descEn', document.getElementById('cat_desc_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للوصف</span>
                  </button>
                </div>
                <textarea 
                  name="descEn" 
                  className="form-control" 
                  placeholder="e.g. Luxury interior design solutions..."
                  value={editingData?.descEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, descEn: e.target.value }))}
                  rows="3"
                  style={{ resize: 'none', fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>صورة الغلاف (Banner Image)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      flexGrow: 1, 
                      border: '1px dashed rgba(161, 154, 140, 0.5)', 
                      borderRadius: '4px', 
                      padding: '0.6rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--text-gray)',
                      fontFamily: 'var(--font-arabic)'
                    }}
                  >
                    <Upload size={14} />
                    <span>اختر ملف صورة</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const b64 = await convertFileToBase64(file);
                            setEditingData(prev => ({ ...prev, bannerImg: b64 }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {editingData?.bannerImg && (
                    <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                      <img src={editingData.bannerImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontFamily: 'var(--font-arabic)', fontSize: '0.9rem' }}>
                  <Save size={15} style={{ marginLeft: '0.4rem' }} />
                  <span>حفظ وتثبيت الفئة</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADD/EDIT PROJECT VIEW */}
        {(subView === 'add-project' || subView === 'edit-project') && (
          <div 
            style={{ 
              padding: '2rem', 
              backgroundColor: 'var(--white)', 
              border: '1px solid var(--light-beige)', 
              borderRadius: '6px',
              boxShadow: 'var(--shadow-sm)',
              direction: 'rtl', 
              textAlign: 'right' 
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '2rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '0.75rem', fontFamily: 'var(--font-arabic)' }}>
              {subView === 'edit-project' ? 'تعديل تفاصيل المشروع' : 'إضافة مشروع جديد للمعرض'}
            </h3>

            <form key={editingData?.id || 'new-project'} onSubmit={handleProjectSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              {/* Title AR */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>عنوان المشروع باللغة العربية*</label>
                <input 
                  type="text" 
                  id="proj_title_ar"
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: شقة سكنية فاخرة - التجمع"
                  defaultValue={editingData?.title || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                />
              </div>

              {/* Title EN */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>عنوان المشروع باللغة الإنجليزية (Title EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('titleEn', document.getElementById('proj_title_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للعنوان</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="titleEn" 
                  className="form-control" 
                  placeholder="e.g. Luxury Apartment - Fifth Settlement"
                  value={editingData?.titleEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, titleEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Subtitle AR */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>العنوان الفرعي باللغة العربية</label>
                <input 
                  type="text" 
                  id="proj_subtitle_ar"
                  name="subtitle" 
                  className="form-control" 
                  placeholder="مثال: فخامة معاصرة — التجمع الخامس"
                  defaultValue={editingData?.subtitle || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Subtitle EN */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>العنوان الفرعي باللغة الإنجليزية (Subtitle EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('subtitleEn', document.getElementById('proj_subtitle_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للعنوان الفرعي</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="subtitleEn" 
                  className="form-control" 
                  placeholder="e.g. Contemporary Luxury — New Cairo"
                  value={editingData?.subtitleEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Category Dropdown */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>القسم الهندسي التابع له*</label>
                <select 
                  name="category" 
                  className="form-control" 
                  value={editingData?.category || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingData(prev => ({ ...prev, category: val }));
                  }}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                >
                  <option value="" disabled>اختر القسم...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Description AR */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>الوصف التفصيلي باللغة العربية</label>
                <textarea 
                  id="proj_desc_ar"
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً مفصلاً لكافة تفاصيل الأعمال واللمسات الهندسية..."
                  defaultValue={editingData?.desc || ''}
                  rows="4"
                  style={{ resize: 'none', fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Description EN */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>الوصف التفصيلي باللغة الإنجليزية (Description EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('descEn', document.getElementById('proj_desc_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للوصف</span>
                  </button>
                </div>
                <textarea 
                  name="descEn" 
                  className="form-control" 
                  placeholder="e.g. A complete luxury execution for a residential penthouse..."
                  value={editingData?.descEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, descEn: e.target.value }))}
                  rows="4"
                  style={{ resize: 'none', fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Space */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>المساحة المقدرة (مشتركة لكلا اللغتين)</label>
                <input 
                  type="text" 
                  name="space" 
                  className="form-control" 
                  placeholder="مثال: 450 م²"
                  defaultValue={editingData?.space || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Year */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>عام الإنجاز (مشتركة لكلا اللغتين)</label>
                <input 
                  type="text" 
                  name="year" 
                  className="form-control" 
                  placeholder="مثال: 2025"
                  defaultValue={editingData?.year || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Duration AR */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>مدة التنفيذ باللغة العربية</label>
                <input 
                  type="text" 
                  id="proj_duration_ar"
                  name="duration" 
                  className="form-control" 
                  placeholder="مثال: 5 أشهر"
                  defaultValue={editingData?.duration || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Duration EN */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>مدة التنفيذ باللغة الإنجليزية (Duration EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('durationEn', document.getElementById('proj_duration_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للمدة</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="durationEn" 
                  className="form-control" 
                  placeholder="e.g. 5 Months"
                  value={editingData?.durationEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, durationEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Location AR */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>موقع المشروع باللغة العربية</label>
                <input 
                  type="text" 
                  id="proj_location_ar"
                  name="location" 
                  className="form-control" 
                  placeholder="مثال: التجمع الخامس، القاهرة"
                  defaultValue={editingData?.location || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Location EN */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>الموقع باللغة الإنجليزية (Location EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('locationEn', document.getElementById('proj_location_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للموقع</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="locationEn" 
                  className="form-control" 
                  placeholder="e.g. Fifth Settlement, Cairo"
                  value={editingData?.locationEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, locationEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Materials AR */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>المواصفات والمواد المستخدمة باللغة العربية</label>
                <input 
                  type="text" 
                  id="proj_materials_ar"
                  name="materials" 
                  className="form-control" 
                  placeholder="مثال: رخام طبيعي، خشب أرو، إضاءة مخفية ذكية"
                  defaultValue={editingData?.materials || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Materials EN */}
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', margin: 0 }}>المواصفات والمواد باللغة الإنجليزية (Materials EN)</label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslate('materialsEn', document.getElementById('proj_materials_ar')?.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-arabic)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Languages size={13} />
                    <span>ترجمة تلقائية للمواصفات</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name="materialsEn" 
                  className="form-control" 
                  placeholder="e.g. Natural marble, oak wood, smart indirect lighting"
                  value={editingData?.materialsEn || ''}
                  onChange={(e) => setEditingData(prev => ({ ...prev, materialsEn: e.target.value }))}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              {/* Main Image */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>الصورة الرئيسية للمشروع</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      flexGrow: 1, 
                      border: '1px dashed rgba(161, 154, 140, 0.5)', 
                      borderRadius: '4px', 
                      padding: '0.6rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--text-gray)',
                      fontFamily: 'var(--font-arabic)'
                    }}
                  >
                    <Upload size={14} />
                    <span>تحميل صورة رئيسية</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const b64 = await convertFileToBase64(file);
                            setEditingData(prev => ({ ...prev, defaultImg: b64 }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {editingData?.defaultImg && (
                    <div style={{ width: '42px', height: '42px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                      <img src={editingData.defaultImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>معرض الصور الكامل للمشروع</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      flexGrow: 1, 
                      border: '1px dashed rgba(161, 154, 140, 0.5)', 
                      borderRadius: '4px', 
                      padding: '0.6rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--text-gray)',
                      fontFamily: 'var(--font-arabic)'
                    }}
                  >
                    <Upload size={14} />
                    <span>أضف صور للمعرض</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          try {
                            const promises = files.map(file => convertFileToBase64(file));
                            const b64s = await Promise.all(promises);
                            setEditingData(prev => ({ 
                              ...prev, 
                              gallery: [...(prev?.gallery || []), ...b64s] 
                            }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {editingData?.gallery && editingData.gallery.length > 0 && (
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-gold)', whiteSpace: 'nowrap', fontFamily: 'var(--font-arabic)' }}>
                      ({editingData.gallery.length} صور)
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Preview thumbnails */}
              {editingData?.gallery && editingData.gallery.length > 0 && (
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0', borderTop: '1px solid var(--light-beige)' }}>
                  {editingData.gallery.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                      <img src={img} alt="Gallery Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updatedGallery = editingData.gallery.filter((_, i) => i !== idx);
                          setEditingData(prev => ({ ...prev, gallery: updatedGallery }));
                        }}
                        style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(231, 76, 60, 0.8)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontFamily: 'var(--font-arabic)', fontSize: '0.9rem' }}>
                  <Save size={15} style={{ marginLeft: '0.4rem' }} />
                  <span>حفظ وتثبيت المشروع</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 767px) {
          .contact-admin-form {
            grid-template-columns: 1fr !important;
          }
          .contact-admin-form > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
