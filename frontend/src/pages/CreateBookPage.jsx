import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR, calculateDiscount, calculateSavings } from '../utils/formatters';
import {
  BookPlus,
  Upload,
  Image as ImageIcon,
  MapPin,
  CheckCircle
} from 'lucide-react';

export const CreateBookPage = ({ setCurrentView, onSelectBook }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const presets = [
    { name: 'Quantitative Capital / Innovation (Studio Yellow Edition)', url: '/covers/cover_quantitative_capital.jpg' },
    { name: 'Algorithms & Data Structures (Studio Cobalt Blue)', url: '/covers/cover_algorithms.jpg' },
    { name: 'Machine Learning & Neural Models (Studio Emerald Green)', url: '/covers/cover_machine_learning.jpg' },
    { name: 'System Design & Distributed Systems (Studio Slate Teal)', url: '/covers/cover_system_design.jpg' },
    { name: 'Cracking the Coding Interview (Studio Royal Violet)', url: '/covers/cover_interview_prep.jpg' },
    { name: 'GATE Computer Science & IT (Studio Crimson Red)', url: '/covers/cover_competitive_exams.jpg' },
    { name: 'Operating System Concepts (Studio Terracotta Orange)', url: '/covers/cover_operating_systems.jpg' },
    { name: 'Control Systems Engineering (Studio Technical Slate)', url: '/covers/cover_control_systems_nise.jpg' },
    { name: 'Artificial Intelligence: A Modern Approach (Studio Royal Blue)', url: '/covers/cover_ai_russell_norvig.jpg' },
    { name: 'Quantum Dynamics (Studio Cyan Sapphire)', url: '/covers/cover_quantum.jpg' },
    { name: 'Deep Astrophysics (Studio Midnight Navy)', url: '/covers/cover_astrophysics.jpg' },
    { name: 'Algebraic Topology (Studio Ultramarine Blue)', url: '/covers/cover_topology.jpg' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Computer Science & AI',
    condition: 'Like New',
    price: '',
    originalPrice: '',
    isbn: '',
    edition: 'Latest Edition',
    subject: '',
    semester: 'Semester 3 & 4',
    campusLocation: user?.college ? `${user.college} Central Library` : 'Campus Central Library',
    conditionNotes: 'Clean pages, no markings, firm binding.',
    description: '',
    coverImageUrl: '/covers/cover_algorithms.jpg'
  });

  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Computer Science & AI',
    'Machine Learning & AI',
    'Software Development & Web',
    'Interview Preparation & Coding',
    'Competitive Exams',
    'Engineering & Technology',
    'Medical & Healthcare',
    'Commerce, Finance & MBA',
    'Natural Sciences & Math',
    'Law & Legal Studies',
    'Humanities & Social Sciences',
    'Literature & Fiction'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handlePresetSelect = (url) => {
    setCoverFile(null);
    setFormData((prev) => ({ ...prev, coverImageUrl: url }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setFormData((prev) => ({ ...prev, coverImageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!formData.title || !formData.author || !formData.price) {
      showToast('Please specify title, author, and price in ₹', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice || Number(formData.price) * 1.5);
      data.append('isbn', formData.isbn);
      data.append('edition', formData.edition);
      data.append('subject', formData.subject || 'General Academic');
      data.append('semester', formData.semester);
      data.append('campusLocation', formData.campusLocation);
      data.append('conditionNotes', formData.conditionNotes);
      data.append(
        'description',
        formData.description ||
        `${formData.title} in ${formData.condition} condition. Available for pickup on campus.`
      );

      if (coverFile) {
        data.append('coverImageFile', coverFile);
      } else {
        data.append('coverImageUrl', formData.coverImageUrl);
      }

      const res = await api.books.create(data);
      if (res.success) {
        showToast('Textbook listed on marketplace successfully!', 'success');
        if (onSelectBook && res.book) {
          onSelectBook(res.book);
        }
        setCurrentView('marketplace');
      }
    } catch (err) {
      showToast(err.message || 'Failed to list textbook', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const previewDiscount = calculateDiscount(formData.originalPrice, formData.price);
  const previewSavings = calculateSavings(formData.originalPrice, formData.price);

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '2rem' }}>
          <span className="eyebrow-tag" style={{ marginBottom: '0.4rem' }}>
            CAMPUS DISPATCH // LISTING STUDIO
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Sell a Book
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            List your course volumes for direct campus handover with zero platform fees
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 360px)',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="create-book-layout"
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="create-book-form"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem'
            }}
          >
            {/* Section 1: Basic Details */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Basic Details</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Algorithms"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Author(s) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cormen, Leiserson, Rivest"
                    className="form-input"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category / Subject *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Course Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. CS 201"
                    className="form-input"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="text"
                    placeholder="e.g. Semester 3 & 4"
                    className="form-input"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Book Condition & Photo */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Book Condition & Photo</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      className="quick-chip"
                      style={{
                        background: formData.condition === cond ? 'var(--text-primary)' : 'var(--bg-secondary)',
                        color: formData.condition === cond ? 'var(--bg-surface)' : 'var(--text-secondary)',
                        borderColor: formData.condition === cond ? 'var(--text-primary)' : 'var(--border-subtle)',
                        fontWeight: formData.condition === cond ? 600 : 400
                      }}
                      onClick={() => setFormData({ ...formData, condition: cond })}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes on Condition (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Clean pages, no highlighting, tight binding"
                  className="form-input"
                  value={formData.conditionNotes}
                  onChange={(e) => setFormData({ ...formData, conditionNotes: e.target.value })}
                />
              </div>

              {/* Cover Photo */}
              <div className="form-group">
                <label className="form-label">
                  Book Cover Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  Upload a photo of your actual physical textbook, or choose from our real edition study desk photographs below:
                </p>

                {/* File Upload (Optional) */}
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleFileChange}
                    style={{ padding: '0.45rem' }}
                  />
                  {coverFile && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--savings-green)', marginTop: '0.35rem', fontWeight: 600 }}>
                      ✓ Custom photo selected: {coverFile.name}
                    </div>
                  )}
                </div>

                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Or select an authentic edition photo:
                </label>
                <div className="create-preset-grid">
                  {presets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePresetSelect(preset.url)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: formData.coverImageUrl === preset.url && !coverFile ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-subtle)',
                        aspectRatio: '3 / 4',
                        background: 'var(--bg-secondary)',
                        position: 'relative'
                      }}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Price (₹) */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Price (₹)</h3>
              </div>

              <div className="form-row-dual">
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input font-mono"
                    placeholder="e.g. 450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input font-mono"
                    placeholder="e.g. 1200"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              {previewSavings > 0 && (
                <div
                  style={{
                    background: 'var(--savings-bg)',
                    border: '1px solid var(--badge-new-border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    color: 'var(--savings-green)',
                    fontWeight: 600
                  }}
                >
                  Buyers save {formatINR(previewSavings)} ({previewDiscount}% off) on this book!
                </div>
              )}
            </div>

            {/* Section 4: Meeting Spot */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                  4
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Meeting Spot</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Where to Meet on Campus</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Central Library Steps, Canteen, Main Gate"
                  value={formData.campusLocation}
                  onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Mention edition year, key course topics covered, or notes on interior condition..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg"
              disabled={submitting}
              style={{ width: '100%' }}
            >
              {submitting ? 'Posting Book...' : 'Post Book for Sale'}
            </button>
          </form>

          {/* Right Column: Live Card Preview */}
          <div className="create-preview-wrap">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Preview
            </div>

            <div
              className="book-card"
              style={{ pointerEvents: 'none' }}
            >
              <div className="book-card-image-wrap">
                <img
                  src={formData.coverImageUrl || '/covers/cover_placeholder.jpg'}
                  alt="Preview"
                  className="book-card-image"
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="badge badge-like-new">
                    {formData.condition}
                  </span>
                </div>
                {previewDiscount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      background: 'var(--savings-bg)',
                      color: 'var(--savings-green)',
                      border: '1px solid var(--badge-new-border)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.18rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {previewDiscount}% OFF
                  </div>
                )}
              </div>

              <div className="book-card-body">
                <div className="book-card-category">{formData.category}</div>
                <h3 className="book-card-title">
                  {formData.title || 'Book Title'}
                </h3>
                <p className="book-card-author">
                  by {formData.author || 'Author Name'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.75rem'
                  }}
                >
                  <MapPin size={13} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.campusLocation || 'Central Library'}
                  </span>
                </div>

                <div className="book-card-footer">
                  <div className="book-price-box">
                    <span className="book-price-current font-mono">
                      {formData.price ? formatINR(formData.price) : '₹0'}
                    </span>
                    {formData.originalPrice > formData.price && (
                      <span className="book-price-original font-mono">
                        {formatINR(formData.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="btn btn-secondary btn-sm">Inspect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
