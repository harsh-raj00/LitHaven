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
  ArrowRight,
  Shield,
  Award,
  Layers,
  BookMarked
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
    campusLocation: user?.college ? `${user.college} Central Library Quad` : 'Campus Central Library Quad',
    conditionNotes: 'Pristine pages, zero highlighting, firm spine binding.',
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
      showToast('Please specify title, author, and price', 'error');
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
          `${formData.title} in ${formData.condition} condition. Available for direct campus peer handover.`
      );

      if (coverFile) {
        data.append('coverImageFile', coverFile);
      } else {
        data.append('coverImageUrl', formData.coverImageUrl);
      }

      const res = await api.books.create(data);
      if (res.success) {
        showToast('Monograph inscribed and listed in The Codex Exchange!', 'success');
        setCurrentView('marketplace');
      }
    } catch (err) {
      showToast(err.message || 'Failed to list monograph', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const previewDiscount =
    formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100
        )
      : null;

  const previewSavings =
    formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(Number(formData.originalPrice) - Number(formData.price))
      : null;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Header Atelier Banner */}
        <div style={{ marginBottom: '2.2rem' }}>
          <div className="hero-badge-tag" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={14} color="var(--accent-gold)" /> THE SCRIBE STUDIO • LIST MONOGRAPH
          </div>
          <h1 className="font-display" style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
            Inscribe a Monograph for Exchange
          </h1>
          <p className="font-serif-literary" style={{ fontSize: '1.25rem', maxWidth: '720px' }}>
            Pass your authoritative textbooks forward to incoming university scholars. Set fair student
            pricing and designate a safe campus handover quad.
          </p>
        </div>

        {/* Split Studio: Left Form & Right Realtime 3D Card Preview */}
        <div className="scribe-studio-grid">
          {/* Left: Progressive Form Sections */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.4rem', borderRadius: 'var(--radius-xl)' }}>
            {/* Section 1: Monograph Identity */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.8rem', marginBottom: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  1
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem' }}>Monograph Identity</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Title of Work *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Introduction to Algorithms (CLRS Fourth Edition)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Authors / Editors *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Cormen, Leiserson, Rivest, Stein"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Code (Optional)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="e.g. CS 204 or PHYS 301"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Academic Faculty / Discipline</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Edition & Year</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 4th Global Edition (2022)"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Condition & Provenance */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.8rem', marginBottom: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  2
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem' }}>Condition Appraisal</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Preservation Grade</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {conditions.map((cond, i) => (
                    <button
                      key={i}
                      type="button"
                      style={{
                        background: formData.condition === cond ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: formData.condition === cond ? '#ffffff' : 'var(--text-secondary)',
                        border: `1px solid ${formData.condition === cond ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                        padding: '0.45rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => setFormData({ ...formData, condition: cond })}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Provenance & Notation Checklist</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Crisp pages, minimal pencil underlines in Ch. 3, firm spine."
                  value={formData.conditionNotes}
                  onChange={(e) => setFormData({ ...formData, conditionNotes: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Pricing & Value */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.8rem', marginBottom: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  3
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem' }}>Student Exchange Value</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Offering Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input font-mono"
                    placeholder="e.g. 38"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Retail MRP ($)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input font-mono"
                    placeholder="e.g. 110"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              {previewSavings && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    color: 'var(--accent-emerald)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={16} /> Fellow scholars save ${previewSavings} ({previewDiscount}% off retail) on this listing!
                </div>
              )}
            </div>

            {/* Section 4: Handover Quad */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.8rem', marginBottom: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  4
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem' }}>Campus Handover Quad</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Designated Meetup Landmark</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Central Library Atrium, Science Quad Canteen, or Engineering Hall"
                  value={formData.campusLocation}
                  onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Curator's Notes & Advice</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Why this volume was invaluable for coursework, exams, or research..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Section 5: Cover Artwork Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  5
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem' }}>Monograph Bindings & Artwork</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Curated Hardcover Artwork Presets</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  {presets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePresetSelect(preset.url)}
                      style={{
                        border: formData.coverImageUrl === preset.url ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        padding: '4px',
                        background: 'rgba(255,255,255,0.03)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.2rem' }}>
                <label className="form-label">Or Upload Custom Cover Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ width: '100%', padding: '0.9rem 1.8rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
            >
              {submitting ? 'Inscribing Monograph...' : <><BookPlus size={18} /> Inscribe Monograph to Exchange</>}
            </button>
          </form>

          {/* Right: Sticky Live 3D Card Preview */}
          <div className="sticky-preview-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem'
              }}
            >
              <Eye size={16} /> Live Codex Card Preview
            </div>

            <div className="book-card" style={{ maxWidth: '340px', margin: '0 auto', boxShadow: 'var(--shadow-book)' }}>
              {/* Cover Image Wrapper with Spine */}
              <div className="book-card-image-wrap">
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '18px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 30%, transparent 100%)',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
                <img
                  src={formData.coverImageUrl || '/covers/cover_placeholder.jpg'}
                  alt="Preview Cover"
                  className="book-card-image"
                />
                <div style={{ position: 'absolute', top: '12px', left: '16px', zIndex: 4 }}>
                  <span className="badge badge-like-new">{formData.condition}</span>
                </div>
                {previewDiscount && previewDiscount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '16px',
                      zIndex: 4,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.22rem 0.6rem',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    SAVE {previewDiscount}%
                  </div>
                )}
              </div>

              <div className="book-card-body">
                <div className="book-card-category" style={{ letterSpacing: '0.08em' }}>
                  {formData.category}
                </div>
                <h3 className="book-card-title font-serif-literary" style={{ fontSize: '1.18rem', lineHeight: '1.35' }}>
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
                  <MapPin size={13} color="var(--accent-gold)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.campusLocation || 'Campus Central Library Quad'}
                  </span>
                </div>

                <div className="book-card-footer">
                  <div className="book-price-box">
                    <span className="book-price-current font-mono">${formData.price || '0'}</span>
                    {formData.originalPrice > formData.price && (
                      <span className="book-price-original font-mono">${formData.originalPrice}</span>
                    )}
                  </div>
                  <span className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                    Inspect
                  </span>
                </div>
              </div>
            </div>

            <div
              className="glass-panel"
              style={{
                marginTop: '1.6rem',
                padding: '1.2rem',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-gold)'
              }}
            >
              🏛️ <strong>Collegiate Handover Advice:</strong> Monograms designated with specific campus
              meeting spots near central library atriums receive 3x more buyer inquiries and finalize
              within 48 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
