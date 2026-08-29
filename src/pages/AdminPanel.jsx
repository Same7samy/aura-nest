import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Settings, Plus, Edit2, Trash2, Save, X, 
  Layers, Briefcase, PhoneCall, Image, Upload, AlertCircle, CheckCircle 
} from 'lucide-react';
import { 
  getProjects, fetchProjectsFromSupabase, addProject, updateProject, deleteProject,
  getCategories, fetchCategoriesFromSupabase, addCategory, updateCategory, deleteCategory,
  getContactInfo, fetchContactInfoFromSupabase, updateContactInfo
} from '../utils/projectData';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Tab control: 'categories', 'projects', 'contact'
  const [activeTab, setActiveTab] = useState('projects');
  
  // Loaded collections state
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contactData, setContactData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Modal controllers
  const [categoryModal, setCategoryModal] = useState({ open: false, isEdit: false, data: null });
  const [projectModal, setProjectModal] = useState({ open: false, isEdit: false, data: null });
  
  // Success alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

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

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 3000);
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

  // Base64 file converter with image compression to prevent exceeding localStorage quota
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
      id: formData.get('id'),
      title: formData.get('title'),
      desc: formData.get('desc'),
      bannerImg: categoryModal.data?.bannerImg || ''
    };

    if (!catData.id || !catData.title) {
      showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);
    if (categoryModal.isEdit) {
      const updated = await updateCategory(catData);
      setCategories(updated);
      showAlert('تم تعديل الفئة بنجاح');
    } else {
      // Check for duplicate ID
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
    setCategoryModal({ open: false, isEdit: false, data: null });
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذفها من القوائم.')) {
      setLoading(true);
      const updated = await deleteCategory(id);
      setCategories(updated);
      setLoading(false);
      showAlert('تم حذف الفئة بنجاح');
    }
  };

  // Project Actions
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Parse specs/materials from form
    const projData = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      desc: formData.get('desc'),
      category: formData.get('category'),
      space: formData.get('space'),
      duration: formData.get('duration'),
      year: formData.get('year'),
      location: formData.get('location'),
      materials: formData.get('materials'),
      defaultImg: projectModal.data?.defaultImg || '',
      gallery: projectModal.data?.gallery || []
    };

    if (projectModal.isEdit && projectModal.data) {
      projData.id = projectModal.data.id;
    }

    if (!projData.title || !projData.category) {
      showAlert('يرجى ملء الحقول الأساسية: العنوان والقسم', 'error');
      return;
    }

    setLoading(true);
    if (projectModal.isEdit) {
      const updated = await updateProject(projData);
      setProjects(updated);
      showAlert('تم تعديل المشروع بنجاح');
    } else {
      const updated = await addProject(projData);
      setProjects(updated);
      showAlert('تم إضافة المشروع بنجاح');
    }
    setLoading(false);
    setProjectModal({ open: false, isEdit: false, data: null });
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setLoading(true);
      const updated = await deleteProject(id);
      setProjects(updated);
      setLoading(false);
      showAlert('تم حذف المشروع بنجاح');
    }
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
      <div style={{ minHeight: '90vh', backgroundColor: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--light-beige)', boxShadow: 'var(--shadow-md)', textAlign: 'right' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-gold)' }}>
              <Lock size={28} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.5rem', textAlign: 'center' }}>لوحة تحكم AURA NEST</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', marginBottom: '2rem', textAlign: 'center' }}>الرجاء إدخال كلمة المرور للوصول إلى لوحة الإدارة</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">كلمة المرور</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                style={{ direction: 'rtl' }}
              />
              {authError && <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{authError}</span>}
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.95rem' }}>
              دخول لوحة التحكم
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '5rem' }}>
      
      {/* Alert Component */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '90px',
              left: '50%',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              borderRadius: '6px',
              backgroundColor: alert.type === 'success' ? '#2ecc71' : '#e74c3c',
              color: 'var(--white)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-arabic)'
            }}
          >
            {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        {/* Header Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-gold)', fontWeight: 700, display: 'block' }}>الإدارة العامة للمحتوى</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: 0 }}>لوحة الإدارة والتحكم</h1>
          </div>
          
          {/* Quick Stats or Status */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
              حالة الخادم: <span style={{ color: '#2ecc71', fontWeight: 700 }}>متصل سحابياً (Live)</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--light-beige)', paddingBottom: '1px', direction: 'rtl' }}>
          <button 
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '3px solid var(--primary-gold)' : '3px solid transparent',
              color: activeTab === 'projects' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s'
            }}
          >
            <Briefcase size={18} />
            <span>المشاريع ({projects.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '3px solid var(--primary-gold)' : '3px solid transparent',
              color: activeTab === 'categories' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s'
            }}
          >
            <Layers size={18} />
            <span>الفئات الرئيسية ({categories.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('contact')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'contact' ? '3px solid var(--primary-gold)' : '3px solid transparent',
              color: activeTab === 'contact' ? 'var(--dark-charcoal)' : 'var(--text-gray)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s'
            }}
          >
            <PhoneCall size={18} />
            <span>بيانات التواصل</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--light-beige)', borderTopColor: 'var(--primary-gold)', borderRadius: '50%', margin: '0 auto 1rem auto', animation: 'spin 1s infinite linear' }} />
            <p style={{ color: 'var(--text-gray)' }}>يرجى الانتظار... يتم تحميل وتحديث البيانات</p>
          </div>
        )}

        {!loading && activeTab === 'categories' && (
          <div style={{ direction: 'rtl' }}>
            {/* Top Bar inside Tab */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-charcoal)', fontWeight: 800 }}>إدارة الفئات الهندسية</h3>
              <button 
                onClick={() => setCategoryModal({ open: true, isEdit: false, data: null })}
                className="btn btn-primary" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                <Plus size={16} style={{ marginLeft: '0.5rem' }} />
                <span>إضافة فئة جديدة</span>
              </button>
            </div>

            {/* Categories Table/List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {categories.map(cat => (
                <div key={cat.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--light-beige)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
                  {cat.bannerImg && (
                    <div style={{ height: '120px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                      <img src={cat.bannerImg} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-charcoal)', margin: 0 }}>{cat.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 600 }}>معرّف المسار: /{cat.id}</span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)', lineHeight: '1.5', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{cat.desc}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--light-beige)', paddingTop: '0.75rem' }}>
                    <button 
                      onClick={() => setCategoryModal({ open: true, isEdit: true, data: cat })}
                      className="btn" 
                      style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.85rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', justifyContent: 'center' }}
                    >
                      <Edit2 size={14} style={{ marginLeft: '0.25rem' }} />
                      <span>تعديل</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="btn" 
                      style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.85rem', border: '1px solid #f9d5d5', color: '#e74c3c', justifyContent: 'center', backgroundColor: '#fff6f6' }}
                    >
                      <Trash2 size={14} style={{ marginLeft: '0.25rem' }} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'projects' && (
          <div style={{ direction: 'rtl' }}>
            {/* Top Bar inside Tab */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-charcoal)', fontWeight: 800 }}>إدارة المشاريع (أعمالنا)</h3>
              <button 
                onClick={() => setProjectModal({ open: true, isEdit: false, data: null })}
                className="btn btn-primary" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                <Plus size={16} style={{ marginLeft: '0.5rem' }} />
                <span>إضافة مشروع جديد</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {projects.map(proj => (
                <div key={proj.id} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--light-beige)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'right' }}>
                  {(proj.customImg || proj.defaultImg) && (
                    <div style={{ height: '140px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                      <img src={proj.customImg || proj.defaultImg} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 700, backgroundColor: 'var(--ivory)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                      {proj.category}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: '0.5rem 0 0 0' }}>{proj.title}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', display: 'block' }}>{proj.subtitle}</span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)', lineHeight: '1.5', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {proj.desc && proj.desc.length > 100 ? `${proj.desc.substring(0, 100)}...` : proj.desc}
                    </p>
                  </div>
                  
                  {/* Specs summary tag preview */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                    <span>📍 {proj.location}</span>
                    <span>•</span>
                    <span>📐 {proj.space}</span>
                    <span>•</span>
                    <span>⏳ {proj.duration}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--light-beige)', paddingTop: '0.75rem' }}>
                    <button 
                      onClick={() => setProjectModal({ open: true, isEdit: true, data: proj })}
                      className="btn" 
                      style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.85rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', justifyContent: 'center' }}
                    >
                      <Edit2 size={14} style={{ marginLeft: '0.25rem' }} />
                      <span>تعديل التفاصيل</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)}
                      className="btn" 
                      style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.85rem', border: '1px solid #f9d5d5', color: '#e74c3c', justifyContent: 'center', backgroundColor: '#fff6f6' }}
                    >
                      <Trash2 size={14} style={{ marginLeft: '0.25rem' }} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'contact' && (
          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--light-beige)', direction: 'rtl', textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-charcoal)', fontWeight: 800, marginBottom: '2rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '0.75rem' }}>
              تعديل بيانات التواصل والموقع الأساسية
            </h3>
            
            <form onSubmit={handleContactSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="contact-admin-form">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">العنوان الفعلي (المقر الرئيسي)</label>
                <input 
                  type="text" 
                  name="address" 
                  className="form-control" 
                  defaultValue={contactData.address || ''} 
                  placeholder="مثال: التجمع الخامس - الحي الثاني..."
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">رقم الهاتف الظاهر للمراسلة</label>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  defaultValue={contactData.phone || ''} 
                  placeholder="مثال: 01111 014 008"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">البريد الإلكتروني الأساسي</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  defaultValue={contactData.email || ''} 
                  placeholder="مثال: info@aura-nest.net"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">رقم الواتساب الدولي (للإرسال المباشر)</label>
                <input 
                  type="text" 
                  name="whatsapp" 
                  className="form-control" 
                  defaultValue={contactData.whatsapp || ''} 
                  placeholder="مثال: 201111014008"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">رابط صفحة الفيسبوك (Facebook)</label>
                <input 
                  type="text" 
                  name="facebook" 
                  className="form-control" 
                  defaultValue={contactData.facebook || ''} 
                  placeholder="مثال: https://www.facebook.com/..."
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">رابط حساب الإنستجرام (Instagram)</label>
                <input 
                  type="text" 
                  name="instagram" 
                  className="form-control" 
                  defaultValue={contactData.instagram || ''} 
                  placeholder="مثال: https://instagram.com/..."
                />
              </div>

              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label">ساعات وأيام العمل الرسمية</label>
                <input 
                  type="text" 
                  name="hours" 
                  className="form-control" 
                  defaultValue={contactData.hours || ''} 
                  placeholder="مثال: ١٠ ص — ٨ م (يومياً عدا الجمعة)"
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
                  <Save size={16} style={{ marginLeft: '0.5rem' }} />
                  <span>حفظ وتحديث بيانات الاتصال</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Categories Add/Edit Modal */}
      {categoryModal.open && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(63, 64, 66, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'var(--white)', textAlign: 'right', direction: 'rtl', position: 'relative' }}
          >
            <button 
              onClick={() => setCategoryModal({ open: false, isEdit: false, data: null })}
              style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '1.5rem', borderRight: '3px solid var(--primary-gold)', paddingRight: '0.5rem' }}>
              {categoryModal.isEdit ? 'تعديل الفئة الهندسية' : 'إضافة فئة هندسية جديدة'}
            </h3>

            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">معرّف الفئة (ID) بالإنجليزية (يُستخدم للرابط الإلكتروني)*</label>
                <input 
                  type="text" 
                  name="id" 
                  className="form-control" 
                  placeholder="مثال: design"
                  defaultValue={categoryModal.data?.id || ''}
                  disabled={categoryModal.isEdit}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">اسم الفئة (Title)*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: التصميم الداخلي والديكور"
                  defaultValue={categoryModal.data?.title || ''}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">وصف مختصر (Description)</label>
                <textarea 
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً معبراً عن هذا التخصص الهندسي..."
                  defaultValue={categoryModal.data?.desc || ''}
                  rows="3"
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">صورة الغلاف (Banner Image)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label 
                    style={{ 
                      flexGrow: 1, 
                      border: '1px dashed rgba(161, 154, 140, 0.5)', 
                      borderRadius: '4px', 
                      padding: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.5rem', 
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: 'var(--text-gray)'
                    }}
                  >
                    <Upload size={16} />
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
                            setCategoryModal(prev => ({
                              ...prev,
                              data: { ...prev.data, bannerImg: b64 }
                            }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {categoryModal.data?.bannerImg && (
                    <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                      <img src={categoryModal.data.bannerImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.9rem' }}>
                <Save size={16} style={{ marginLeft: '0.5rem' }} />
                <span>حفظ الفئة</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Projects Add/Edit Modal */}
      {projectModal.open && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(63, 64, 66, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem', overflowY: 'auto' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ width: '100%', maxWidth: '680px', padding: '2rem', backgroundColor: 'var(--white)', textAlign: 'right', direction: 'rtl', position: 'relative', margin: 'auto' }}
          >
            <button 
              onClick={() => setProjectModal({ open: false, isEdit: false, data: null })}
              style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '1.5rem', borderRight: '3px solid var(--primary-gold)', paddingRight: '0.5rem' }}>
              {projectModal.isEdit ? 'تعديل تفاصيل المشروع' : 'إضافة مشروع جديد للمعرض'}
            </h3>

            <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label">عنوان المشروع الأساسي*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: شقة سكنية فاخرة - التجمع"
                  defaultValue={projectModal.data?.title || ''}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">العنوان الفرعي (موقع أو طابع التنفيذ)</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  className="form-control" 
                  placeholder="مثال: فخامة معاصرة — التجمع الخامس"
                  defaultValue={projectModal.data?.subtitle || ''}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">القسم الهندسي التابع له*</label>
                <select 
                  name="category" 
                  className="form-control" 
                  defaultValue={projectModal.data?.category || ''}
                  required
                >
                  <option value="" disabled>اختر القسم...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label">الوصف التفصيلي للمشروع والعمل الهندسي</label>
                <textarea 
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً مفصلاً لكافة تفاصيل الأعمال واللمسات الهندسية..."
                  defaultValue={projectModal.data?.desc || ''}
                  rows="4"
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Specs & Materials fields */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">المساحة المقدرة</label>
                <input 
                  type="text" 
                  name="space" 
                  className="form-control" 
                  placeholder="مثال: 450 م²"
                  defaultValue={projectModal.data?.space || ''}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">مدة التنفيذ</label>
                <input 
                  type="text" 
                  name="duration" 
                  className="form-control" 
                  placeholder="مثال: 5 أشهر"
                  defaultValue={projectModal.data?.duration || ''}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">عام الإنجاز</label>
                <input 
                  type="text" 
                  name="year" 
                  className="form-control" 
                  placeholder="مثال: 2025"
                  defaultValue={projectModal.data?.year || ''}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">موقع المشروع التفصيلي</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  placeholder="مثال: التجمع الخامس، القاهرة"
                  defaultValue={projectModal.data?.location || ''}
                />
              </div>

              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label">المواصفات الفنية والمواد الأساسية المستخدمة</label>
                <input 
                  type="text" 
                  name="materials" 
                  className="form-control" 
                  placeholder="مثال: رخام طبيعي، خشب أرو، إضاءة مخفية ذكية"
                  defaultValue={projectModal.data?.materials || ''}
                />
              </div>

              {/* Main Image upload */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الصورة الرئيسية للمشروع</label>
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
                      color: 'var(--text-gray)'
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
                            setProjectModal(prev => ({
                              ...prev,
                              data: { ...prev.data, defaultImg: b64 }
                            }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {projectModal.data?.defaultImg && (
                    <div style={{ width: '42px', height: '42px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)' }}>
                      <img src={projectModal.data.defaultImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple Gallery Images upload */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">معرض الصور الكامل للمشروع</label>
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
                      color: 'var(--text-gray)'
                    }}
                  >
                    <Upload size={14} />
                    <span>أضف صور للمعرض (متعدد)</span>
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
                            setProjectModal(prev => ({
                              ...prev,
                              data: { 
                                ...prev.data, 
                                gallery: [...(prev.data?.gallery || []), ...b64s] 
                              }
                            }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                  {projectModal.data?.gallery && projectModal.data.gallery.length > 0 && (
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-gold)', whiteSpace: 'nowrap' }}>
                      ({projectModal.data.gallery.length} صور)
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Image Previews inside modal to support individual deletions */}
              {projectModal.data?.gallery && projectModal.data.gallery.length > 0 && (
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0', borderTop: '1px solid var(--light-beige)' }}>
                  {projectModal.data.gallery.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                      <img src={img} alt="Gallery Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updatedGallery = projectModal.data.gallery.filter((_, i) => i !== idx);
                          setProjectModal(prev => ({
                            ...prev,
                            data: { ...prev.data, gallery: updatedGallery }
                          }));
                        }}
                        style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(231, 76, 60, 0.8)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, justifyContent: 'center', padding: '0.9rem' }}>
                  <Save size={16} style={{ marginLeft: '0.5rem' }} />
                  <span>حفظ وتثبيت المشروع</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setProjectModal({ open: false, isEdit: false, data: null })}
                  className="btn" 
                  style={{ flexGrow: 1, justifyContent: 'center', padding: '0.9rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
