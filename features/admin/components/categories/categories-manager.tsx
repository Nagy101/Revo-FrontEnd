"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/categories/hooks/useCategories"
import type { Category } from "@/features/categories/types"

// --- Custom Toast Component ---
function CustomToast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: '#111', border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        boxShadow: `0 10px 40px ${type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}`,
        borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12
      }}
    >
      {type === 'success' ? <CheckCircle2 color="#22c55e" size={20} /> : <AlertCircle color="#ef4444" size={20} />}
      <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
        <X size={16} />
      </button>
    </motion.div>
  )
}

// --- Categories Manager ---
export function CategoriesManager() {
  const [pageIndex, setPageIndex] = useState(1)
  const { data: response, isLoading } = useCategories(pageIndex, 50)
  const categories = response?.data?.data || []
  
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const [searchTerm, setSearchTerm] = useState("")
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: 'create' | 'edit', category: Category | null }>({
    isOpen: false, type: 'create', category: null
  })
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filteredCategories = categories.filter((c) => 
    c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nameAr.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.orderIndex - b.orderIndex)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type })

  const handleApiError = (error: any) => {
    const errorData = error?.data
    let msg = errorData?.title || errorData?.message || error.message || "Something went wrong"
    
    if (errorData?.errors) {
      if (Array.isArray(errorData.errors)) {
        // FluentValidation custom array
        if (errorData.errors.length > 0) {
          msg = errorData.errors[0].message || errorData.errors[0].errorMessage || msg
        }
      } else if (typeof errorData.errors === 'object') {
        // ASP.NET Core ValidationProblemDetails dictionary
        msg = Object.values(errorData.errors).flat()[0] as string || msg
      }
    }
    showToast(msg, 'error')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("imageUrl") as File
    const hasImage = file && file.size > 0

    const payload = {
      nameAr: formData.get("nameAr") as string,
      nameEn: formData.get("nameEn") as string,
      orderIndex: Number(formData.get("orderIndex") || categories.length + 1),
      ...(hasImage ? { imageUrl: file } : (modalState.type === 'edit' ? { imageUrl: modalState.category?.imageUrl } : {}))
    }

    if (modalState.type === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setModalState({ isOpen: false, type: 'create', category: null })
          showToast("Category created successfully!")
        },
        onError: handleApiError
      })
    } else {
      updateMutation.mutate({ id: modalState.category!.id, payload }, {
        onSuccess: () => {
          setModalState({ isOpen: false, type: 'create', category: null })
          showToast("Category updated successfully!")
        },
        onError: handleApiError
      })
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setConfirmDeleteId(null)
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("Category deleted successfully!")
        setDeletingId(null)
      },
      onError: (err) => {
        handleApiError(err)
        setDeletingId(null)
      }
    })
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* --- Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>Categories</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Manage portfolio categories & groupings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModalState({ isOpen: true, type: 'create', category: null })}
          style={{
            background: 'linear-gradient(135deg, #C3143D, #8f0f2c)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '10px 18px', fontSize: '0.875rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(195,20,61,0.3)'
          }}
        >
          <Plus size={16} /> New Category
        </motion.button>
      </motion.div>

      {/* --- Controls --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{
          position: 'relative', maxWidth: 360,
        }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', width: 16, height: 16 }} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '10px 16px 10px 40px', color: '#fff', fontSize: '0.875rem',
              outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(195,20,61,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
      </motion.div>

      {/* --- List --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {isLoading ? (
          <div style={{ padding: 60, display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Loader2 className="animate-spin" color="#C3143D" size={32} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Search color="rgba(255,255,255,0.2)" size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 500 }}>No categories found</h3>
            <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Try adjusting your search or add a new category.</p>
          </div>
        ) : (
          filteredCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.04)', borderRadius: 20,
                opacity: deletingId === cat.id ? 0.5 : 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                position: 'relative', overflow: 'hidden'
              }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1"
            >
              {/* Subtle Red Gradient Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 0% 50%, rgba(195,20,61,0.08) 0%, transparent 40%)' }} />

              <div className="flex items-center gap-4 relative z-10">
                <div style={{ 
                  width: 60, height: 60, borderRadius: 14, background: '#111', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                }} className="group-hover:scale-105 transition-transform duration-500">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.nameEn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon color="rgba(255,255,255,0.1)" size={24} />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{cat.nameEn}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{cat.nameAr}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 relative z-10 w-full sm:w-auto mt-4 sm:mt-0">
                {/* Badges */}
                <div className="flex gap-2 sm:gap-3 items-center">
                  <div className="flex flex-col items-center bg-white/[0.04] px-4 py-1.5 rounded-xl">
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Order</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>#{cat.orderIndex}</span>
                  </div>
                  <div className="flex flex-col items-center bg-red-500/10 px-4 py-1.5 rounded-xl">
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Items</span>
                    <span style={{ fontSize: '0.85rem', color: '#ff4d6d', fontWeight: 600 }}>{cat.portfolioItemsCount}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setModalState({ isOpen: true, type: 'edit', category: cat })}
                    style={{
                      width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    className="hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(cat.id)}
                    disabled={deletingId === cat.id}
                    style={{
                      width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)',
                      color: '#ef4444', cursor: deletingId === cat.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    className="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 hover:scale-105"
                  >
                    {deletingId === cat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDeleteId(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
                width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Trash2 color="#ef4444" size={24} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Delete Category</h2>
              <p style={{ margin: '8px 0 24px 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  style={{
                    flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                    padding: '10px', color: '#fff', fontSize: '0.875rem', cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(confirmDeleteId)}
                  style={{
                    flex: 1, background: '#ef4444', border: 'none', borderRadius: 10,
                    padding: '10px', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.3)', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Modal --- */}
      <AnimatePresence>
        {modalState.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !createMutation.isPending && !updateMutation.isPending && setModalState({ ...modalState, isOpen: false })}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
                  width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  maxHeight: '90vh', overflowY: 'auto'
                }}
              >
                <div style={{ padding: '24px 24px 0 24px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>
                    {modalState.type === 'create' ? 'Create Category' : 'Edit Category'}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    {modalState.type === 'create' ? 'Add a new category for your portfolio.' : 'Update the details of this category.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Name En & Ar - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Category Name (English)</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            name="nameEn" defaultValue={modalState.category?.nameEn} required
                            placeholder="e.g. Photography, Video Production"
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                              padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s',
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = '#C3143D'; e.currentTarget.style.background = 'rgba(195,20,61,0.05)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Category Name (Arabic)</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            name="nameAr" defaultValue={modalState.category?.nameAr} required
                            placeholder="مثال: تصوير فوتوغرافي، إنتاج فيديو"
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                              padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none',
                              textAlign: 'right', transition: 'all 0.2s', direction: 'rtl'
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = '#C3143D'; e.currentTarget.style.background = 'rgba(195,20,61,0.05)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Sort Order Index</label>
                      <input 
                        name="orderIndex" type="number" defaultValue={modalState.category?.orderIndex || categories.length + 1} required
                        placeholder="e.g. 1"
                        style={{
                          width: '100%', maxWidth: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                          padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
                        }}
                        className="md:max-w-[200px]"
                        onFocus={e => { e.currentTarget.style.borderColor = '#C3143D'; e.currentTarget.style.background = 'rgba(195,20,61,0.05)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      />
                    </div>

                    {/* Image Cover (Full Width Dropzone) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'column', gap: 4 }} className="md:flex-row md:items-end md:gap-0">
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Category Cover Image</label>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Max size 5MB • JPG, PNG, WEBP</span>
                      </div>
                      
                      <div style={{ position: 'relative', marginTop: 4 }}>
                        <input 
                          name="imageUrl" id="imageUrl" type="file" accept="image/*"
                          style={{
                            position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10, width: '100%'
                          }}
                          onChange={(e) => {
                            const label = document.getElementById('file-label-text');
                            const wrapper = document.getElementById('file-dropzone-wrapper');
                            const preview = document.getElementById('file-preview-img');
                            if (label && wrapper && e.target.files && e.target.files[0]) {
                              label.innerText = e.target.files[0].name;
                              label.style.color = '#fff';
                              wrapper.style.borderColor = '#C3143D';
                              wrapper.style.background = 'rgba(195,20,61,0.05)';
                              // Show generic preview if they upload a new file, or hide the old one.
                              if (preview) preview.style.display = 'none';
                            }
                          }}
                        />
                        <div 
                          id="file-dropzone-wrapper"
                          style={{
                            background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16,
                            padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                            transition: 'all 0.3s ease', cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden'
                          }}
                        >
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 50, zIndex: 2 }}>
                            {modalState.type === 'edit' && modalState.category?.imageUrl ? (
                              <img id="file-preview-img" src={modalState.category.imageUrl} alt="Current" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} />
                            ) : (
                              <ImageIcon size={28} color="rgba(255,255,255,0.7)" />
                            )}
                          </div>
                          <div style={{ zIndex: 2 }}>
                            <p id="file-label-text" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {modalState.type === 'edit' && modalState.category?.imageUrl ? 'Click or drag to change image' : 'Click to upload or drag and drop'}
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                              High-quality images look best on the portfolio grid.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }} className="flex-col-reverse md:flex-row md:justify-end">
                    <button 
                      type="button" 
                      onClick={() => setModalState({ ...modalState, isOpen: false })}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                        padding: '12px 28px', color: '#fff', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer',
                        transition: 'background 0.2s', width: '100%'
                      }}
                      className="md:w-auto"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      style={{
                        background: 'linear-gradient(135deg, #C3143D, #8f0f2c)', border: 'none', borderRadius: 12,
                        padding: '12px 32px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 8px 20px rgba(195,20,61,0.35)', transition: 'transform 0.2s', width: '100%'
                      }}
                      className="md:w-auto"
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
                      {modalState.type === 'create' ? 'Create Category' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Toast --- */}
      <AnimatePresence>
        {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

    </div>
  )
}
