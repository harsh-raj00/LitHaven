import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookPlus,
  Sparkles,
  Upload,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  CheckCircle,
  Eye,
  ArrowRight
} from 'lucide-react';

export const CreateBookPage = ({ setCurrentView, onSelectBook }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const presets = [
    { name: 'Quantum Dynamics', url: '/covers/cover_quantum.jpg' },
    { name: 'Neural Architectures', url: '/covers/cover_neural.jpg' },
    { name: 'Genomic Medicine', url: '/covers/cover_genomic.jpg' },
    { name: 'Deep Astrophysics', url: '/covers/cover_astrophysics.jpg' },
    { name: 'Quantitative Capital', url: '/covers/cover_finance.jpg' },
    { name: 'Cybernetic Systems', url: '/covers/cover_cybernetics.jpg' },
    { name: 'Ethical Jurisprudence', url: '/covers/cover_jurisprudence.jpg' },
    { name: 'Algebraic Topology', url: '/covers/cover_topology.jpg' }
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
    conditionNotes: 'Clean crisp pages, zero highlighting.',
    description: '',
    coverImageUrl: '/covers/cover_quantum.jpg'
  });

  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Computer Science & AI',
    'Medical & Healthcare',
    'Engineering & Technology',
    'Commerce, Finance & MBA',
    'Natural Sciences & Math',
    'Competitive Exams',
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
      showToast('Please fill in title, author, and price', 'error');
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
          `${formData.title} in ${formData.condition} condition. Available for quick campus handover.`
      );

      if (coverFile) {
        data.append('coverImageFile', coverFile);
      } else {
        data.append('coverImageUrl', formData.coverImageUrl);
      }

      const res = await api.books.create(data);
      if (res.success) {
        showToast('Book listing published successfully to LitHaven!', 'success');
        if (onSelectBook) {
          onSelectBook(res.book);
        }
        setCurrentView('marketplace');
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Preview computations
  const previewDiscount =
    formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) /
            Number(formData.originalPrice)) *
            100
        )
      : null;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-badge-tag" style={{ marginBottom: '0.4rem' }}>
            <Sparkles size={14} /> Sell or Donate Textbooks
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>List a Book on LitHaven</h1>
          <p>
            Help a junior save money and recoup your textbook costs. 100% peer-to-peer with zero
            middleman fees.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 0.9fr)',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="create-book-layout"
        >
          {/* Left: Form */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.4rem' }}>Book Details</h3>

            {/* Title & Author */}
            <div className="form-group">
              <label className="form-label">Textbook Title *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Introduction to Algorithms (CLRS)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Author(s) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Cormen, Leiserson, Rivest"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Edition</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4th Edition Hardcover"
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Academic Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select
                  className="form-select"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  {conditions.map((cond, i) => (
                    <option key={i} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Original Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Your Selling Price ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  className="form-input"
                  placeholder="e.g. 35"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Retail MRP ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-input"
                  placeholder="e.g. 95 (for discount calculation)"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Subject & Semester */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Course / Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relevant Semester</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Semester 3 & 4"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                />
              </div>
            </div>

            {/* Campus Meetup Spot */}
            <div className="form-group">
              <label className="form-label">Campus Handover Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Central Library Front Steps or CS Block Canteen"
                value={formData.campusLocation}
                onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
              />
            </div>

            {/* Cover Image Selector */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label className="form-label">Book Cover Image</label>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Pick from instant standard academic covers or upload your photo:
              </div>

              {/* Preset cover pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  padding: '4px'
                }}
              >
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.6rem',
                      background:
                        formData.coverImageUrl === preset.url
                          ? 'var(--primary)'
                          : 'rgba(255, 255, 255, 0.05)',
                      color: formData.coverImageUrl === preset.url ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onClick={() => handlePresetSelect(preset.url)}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      style={{ width: '20px', height: '24px', borderRadius: '3px', objectFit: 'cover' }}
                    />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* File upload or custom URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Upload Photo:
                  </label>
                  <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Or Image URL:
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.coverImageUrl}
                    onChange={(e) => {
                      setCoverFile(null);
                      setFormData({ ...formData, coverImageUrl: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Description & Condition Notes */}
            <div className="form-group">
              <label className="form-label">Condition Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Very clean pages, no highlighting, includes solution appendix"
                value={formData.conditionNotes}
                onChange={(e) => setFormData({ ...formData, conditionNotes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Share helpful context for prospective buyers (e.g. why you liked the book, which professor recommended it)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {submitting ? 'Publishing Listing...' : <><BookPlus size={18} /> Publish Listing</>}
            </button>
          </form>

          {/* Right: Live Real-Time Interactive Preview */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.8rem'
              }}
            >
              <Eye size={16} /> Live Codex Card Preview
            </div>

            <div className="book-card" style={{ maxWidth: '340px', margin: '0 auto' }}>
              <div className="book-card-image-wrap">
                <img
                  src={formData.coverImageUrl || '/covers/cover_placeholder.jpg'}
                  alt="Preview Cover"
                  className="book-card-image"
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                  <span className="badge badge-like-new">{formData.condition}</span>
                </div>
                {previewDiscount && previewDiscount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      zIndex: 2,
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px'
                    }}
                  >
                    {previewDiscount}% OFF
                  </div>
                )}
              </div>

              <div className="book-card-body">
                <div className="book-card-category">{formData.category}</div>
                <h3 className="book-card-title">
                  {formData.title || 'Introduction to Algorithms (CLRS)'}
                </h3>
                <p className="book-card-author">
                  by {formData.author || 'Author Name'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.8rem'
                  }}
                >
                  <MapPin size={13} color="var(--primary-light)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.campusLocation || 'Campus Central Library'}
                  </span>
                </div>

                <div className="book-card-footer">
                  <div className="book-price-box">
                    <span className="book-price-current">${formData.price || '0'}</span>
                    {formData.originalPrice > formData.price && (
                      <span className="book-price-original">${formData.originalPrice}</span>
                    )}
                  </div>
                  <span className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.7rem' }}>
                    Details
                  </span>
                </div>
              </div>
            </div>

            <div
              className="glass-panel"
              style={{
                marginTop: '1.4rem',
                padding: '1rem',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: 'var(--text-secondary)'
              }}
            >
              💡 <strong>Pro-Tip for Fast Sales:</strong> Books listed with clear condition notes and
              meetup locations near the university library or student dining hall receive 3x more
              inquiries!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
