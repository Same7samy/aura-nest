import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Plus, Edit2, Trash2, Save,
  Layers, Briefcase, PhoneCall, Upload, AlertCircle, CheckCircle
} from 'lucide-react';
import { 
  getProjects, fetchProjectsFromSupabase, addProject, updateProject, deleteProject,
  getCategories, fetchCategoriesFromSupabase, addCategory, updateCategory, deleteCategory,
  getContactInfo, fetchContactInfoFromSupabase, updateContactInfo
} from '../utils/projectData';

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

  // Password Lock view (renders centered block directly)
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
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem', direction: 'rtl', textAlign: 'right' }}>
      
      {/* Alert Component */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              backgroundColor: alert.type === 'success' ? '#2ecc71' : '#e74c3c',
              color: 'var(--white)',
              boxShadow: 'var(--shadow-md)',
              fontFamily: 'var(--font-arabic)'
            }}
          >
            {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontSize: '0.9rem' }}>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Compact Header Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--light-beige)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: 0, fontFamily: 'var(--font-arabic)' }}>لوحة التحكم AURA NEST</h1>
          
          {/* Tab Navigation directly in the header */}
          {subView === 'list' && (
            <div style={{ display: 'flex', gap: '0.25rem', direction: 'rtl', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveTab('projects')}
                style={{
                  padding: '0.45rem 0.85rem',
                  background: activeTab === 'projects' ? 'var(--primary-gold)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeTab === 'projects' ? 'var(--white)' : 'var(--text-gray)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.25s',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                <Briefcase size={14} />
                <span>المشاريع ({projects.length})</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('categories')}
                style={{
                  padding: '0.45rem 0.85rem',
                  background: activeTab === 'categories' ? 'var(--primary-gold)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeTab === 'categories' ? 'var(--white)' : 'var(--text-gray)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.25s',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                <Layers size={14} />
                <span>الفئات ({categories.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('contact')}
                style={{
                  padding: '0.45rem 0.85rem',
                  background: activeTab === 'contact' ? 'var(--primary-gold)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  color: activeTab === 'contact' ? 'var(--white)' : 'var(--text-gray)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.25s',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                <PhoneCall size={14} />
                <span>بيانات الاتصال</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Contents */}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--dark-charcoal)', fontWeight: 800, fontFamily: 'var(--font-arabic)' }}>إدارة الفئات الهندسية</h3>
                  <button 
                    onClick={() => setSearchParams({ view: 'add-category' })}
                    className="btn btn-primary" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontFamily: 'var(--font-arabic)' }}
                  >
                    <Plus size={14} style={{ marginLeft: '0.25rem' }} />
                    <span>إضافة فئة جديدة</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--light-beige)', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {cat.bannerImg && (
                          <div style={{ width: '70px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                            <img src={cat.bannerImg} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: 0, fontFamily: 'var(--font-arabic)' }}>{cat.title}</h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 600 }}>معرّف المسار: /{cat.id}</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', lineHeight: '1.5', marginTop: '0.25rem', margin: 0 }}>{cat.desc}</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button 
                            onClick={() => setSearchParams({ view: 'edit-category', id: cat.id })}
                            className="btn" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', fontFamily: 'var(--font-arabic)' }}
                          >
                            <Edit2 size={13} style={{ marginLeft: '0.2rem' }} />
                            <span>تعديل</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="btn" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', border: '1px solid #f9d5d5', color: '#e74c3c', backgroundColor: 'transparent', fontFamily: 'var(--font-arabic)' }}
                          >
                            <Trash2 size={13} style={{ marginLeft: '0.2rem' }} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div style={{ direction: 'rtl' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--dark-charcoal)', fontWeight: 800, fontFamily: 'var(--font-arabic)' }}>إدارة المشاريع (أعمالنا)</h3>
                  <button 
                    onClick={() => setSearchParams({ view: 'add-project' })}
                    className="btn btn-primary" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', fontFamily: 'var(--font-arabic)' }}
                  >
                    <Plus size={14} style={{ marginLeft: '0.25rem' }} />
                    <span>إضافة مشروع جديد</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--light-beige)', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {(proj.customImg || proj.defaultImg) && (
                          <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--light-beige)', flexShrink: 0 }}>
                            <img src={proj.customImg || proj.defaultImg} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flexGrow: 1, minWidth: '200px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-gold)', fontWeight: 700, backgroundColor: 'rgba(161, 154, 140, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '3px', fontFamily: 'var(--font-arabic)' }}>
                            {proj.category}
                          </span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark-charcoal)', margin: '0.35rem 0 0 0', fontFamily: 'var(--font-arabic)' }}>{proj.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', display: 'block' }}>{proj.subtitle}</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                            <span>📍 {proj.location}</span>
                            <span>📐 {proj.space}</span>
                            <span>⏳ {proj.duration}</span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexShrink: 0 }}>
                          <button 
                            onClick={() => setSearchParams({ view: 'edit-project', id: proj.id })}
                            className="btn" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--light-beige)', color: 'var(--text-gray)', fontFamily: 'var(--font-arabic)' }}
                          >
                            <Edit2 size={13} style={{ marginLeft: '0.2rem' }} />
                            <span>تعديل</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(proj.id)}
                            className="btn" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', border: '1px solid #f9d5d5', color: '#e74c3c', backgroundColor: 'transparent', fontFamily: 'var(--font-arabic)' }}
                          >
                            <Trash2 size={13} style={{ marginLeft: '0.2rem' }} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div style={{ direction: 'rtl', textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal)', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'var(--font-arabic)' }}>
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
          <div style={{ direction: 'rtl', textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '1.5rem', fontFamily: 'var(--font-arabic)' }}>
              {subView === 'edit-category' ? 'تعديل الفئة الهندسية' : 'إضافة فئة هندسية جديدة'}
            </h3>

            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
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
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>اسم الفئة (Title)*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: التصميم الداخلي والديكور"
                  defaultValue={editingData?.title || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>وصف مختصر (Description)</label>
                <textarea 
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً معبراً عن هذا التخصص الهندسي..."
                  defaultValue={editingData?.desc || ''}
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
          <div style={{ direction: 'rtl', textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '1.5rem', fontFamily: 'var(--font-arabic)' }}>
              {subView === 'edit-project' ? 'تعديل تفاصيل المشروع' : 'إضافة مشروع جديد للمعرض'}
            </h3>

            <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>عنوان المشروع الأساسي*</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control" 
                  placeholder="مثال: شقة سكنية فاخرة - التجمع"
                  defaultValue={editingData?.title || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>العنوان الفرعي (موقع أو طابع التنفيذ)</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  className="form-control" 
                  placeholder="مثال: فخامة معاصرة — التجمع الخامس"
                  defaultValue={editingData?.subtitle || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>القسم الهندسي التابع له*</label>
                <select 
                  name="category" 
                  className="form-control" 
                  defaultValue={editingData?.category || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                  required
                >
                  <option value="" disabled>اختر القسم...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>الوصف التفصيلي للمشروع والعمل الهندسي</label>
                <textarea 
                  name="desc" 
                  className="form-control" 
                  placeholder="اكتب وصفاً مفصلاً لكافة تفاصيل الأعمال واللمسات الهندسية..."
                  defaultValue={editingData?.desc || ''}
                  rows="4"
                  style={{ resize: 'none', fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>المساحة المقدرة</label>
                <input 
                  type="text" 
                  name="space" 
                  className="form-control" 
                  placeholder="مثال: 450 م²"
                  defaultValue={editingData?.space || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>مدة التنفيذ</label>
                <input 
                  type="text" 
                  name="duration" 
                  className="form-control" 
                  placeholder="مثال: 5 أشهر"
                  defaultValue={editingData?.duration || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>عام الإنجاز</label>
                <input 
                  type="text" 
                  name="year" 
                  className="form-control" 
                  placeholder="مثال: 2025"
                  defaultValue={editingData?.year || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>موقع المشروع التفصيلي</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  placeholder="مثال: التجمع الخامس، القاهرة"
                  defaultValue={editingData?.location || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                <label className="form-label" style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem' }}>المواصفات الفنية والمواد الأساسية المستخدمة</label>
                <input 
                  type="text" 
                  name="materials" 
                  className="form-control" 
                  placeholder="مثال: رخام طبيعي، خشب أرو، إضاءة مخفية ذكية"
                  defaultValue={editingData?.materials || ''}
                  style={{ fontFamily: 'var(--font-arabic)' }}
                />
              </div>

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
