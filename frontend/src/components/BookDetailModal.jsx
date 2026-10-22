import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import {
  X,
  Heart,
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Book,
  Tag,
  CheckCircle,
  Share2,
  Award,
  Sparkles,
  BookMarked
} from 'lucide-react';

export const BookDetailModal = ({ book, onClose, onMakeOffer }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const isInitiallyWishlisted =
    user?.wishlist?.some(
      (b) => (typeof b === 'string' ? b : b._id) === book._id
    ) || false;

  const [wishlisted, setWishlisted] = useState(isInitiallyWishlisted);
  const [wishlistCount, setWishlistCount] = useState(book.wishlistCount || 0);

  if (!book) return null;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    try {
      const data = await api.books.toggleWishlist(book._id);
      if (data.success) {
        setWishlisted(data.isWishlisted);
        setWishlistCount(data.wishlistCount);
        showToast(data.message, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Wishlist update failed', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Inspect "${book.title}" on LitHaven Codex Exchange!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Monograph link copied to clipboard!', 'info');
    }
  };

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const savingsAmount =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(book.originalPrice - book.price)
      : null;

  const isOwner = user?._id && (book.owner?._id || book.owner) === user._id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content book-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 340px) 1fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="book-detail-layout"
        >
          {/* Left Column: 3D Hardcover Cover & Provenance Stamp */}
          <div>
            <div className="book-detail-cover-box">
              {/* 3D Spine gleam */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '22px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 35%, transparent 100%)',
                  zIndex: 3,
                  pointerEvents: 'none'
                }}
              />

              <img
                src={book.coverImage || '/covers/cover_placeholder.jpg'}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '16px', left: '20px', zIndex: 4 }}>
                <span className="badge badge-like-new">{book.condition}</span>
              </div>

              {discountPercent && (
                <div
                  className="font-mono"
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    padding: '0.28rem 0.8rem',
                    borderRadius: '999px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    zIndex: 4
                  }}
                >
                  Save {formatINR(savingsAmount)} ({discountPercent}%)
                </div>
              )}
            </div>

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
              <button
                className={`btn btn-secondary ${wishlisted ? 'btn-primary' : ''}`}
                style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
                onClick={handleWishlistToggle}
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleShare}
                title="Share Monograph"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 0.95rem' }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Monograph Details & Seller Quad */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--accent-terracotta)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {book.category} {book.courseCode && `• ${book.courseCode}`}
            </span>

            <h2 className="font-serif-literary" style={{ fontSize: '1.9rem', marginBottom: '0.4rem', lineHeight: 1.25, color: 'var(--text-primary)' }}>
              {book.title}
            </h2>
            <div style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: '1.4rem' }}>
              Authored by <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
            </div>

            {/* Price Box with Savings Engine */}
            <div
              className="book-detail-price-box"
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1.25rem',
                padding: '1.1rem 1.4rem',
                background: 'var(--bg-secondary)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.6rem',
                flexWrap: 'wrap'
              }}
            >
              <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatINR(book.price)}
              </div>
              {book.originalPrice > book.price && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div className="font-mono" style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    MRP: {formatINR(book.originalPrice)}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--savings-green)' }}>
                    Save {formatINR(savingsAmount)} ({discountPercent}%)
                  </div>
                </div>
              )}
              <span className="badge badge-good" style={{ marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Status: {book.status}
              </span>
            </div>

            {/* Provenance Checklist */}
            <div style={{ marginBottom: '1.6rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Physical Provenance & Notation Rubric
              </h4>
              <div className="book-detail-provenance-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="var(--savings-green)" /> Spine Binding: Firm & Intact
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="var(--savings-green)" /> Edition: {book.edition || 'Standard'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="var(--savings-green)" /> ISBN: {book.isbn || 'Archival Registered'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="var(--savings-green)" /> Term: {book.semester || 'All Semesters'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.6rem' }}>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {book.description}
              </p>
              {book.conditionNotes && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.86rem',
                    color: 'var(--badge-good-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--badge-good-bg)',
                    border: '1px solid var(--badge-good-border)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px'
                  }}
                >
                  <Sparkles size={14} /> Curator Note: {book.conditionNotes}
                </div>
              )}
            </div>

            {/* Seller Quad Card */}
            <div
              style={{
                padding: '1.2rem',
                borderRadius: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' }}>
                <img
                  src={
                    book.owner?.avatar ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(book.owner?.name || 'Seller')}`
                  }
                  alt={book.owner?.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                    {book.owner?.name || 'Verified Scholar'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {book.owner?.college || 'University Campus'} • {book.owner?.department || 'Department'}
                  </div>
                </div>

                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.92rem'
                  }}
                >
                  <Star size={15} fill="currentColor" /> {book.owner?.rating || '5.0'}
                </div>
              </div>

              {/* Handover location */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.1rem'
                }}
              >
                <MapPin size={15} color="var(--accent-terracotta)" />
                Quad Meetup: <strong style={{ color: 'var(--text-primary)' }}>{book.campusMeetingSpot || book.campusLocation || 'Campus Central Library Quad'}</strong>
              </div>

              {/* Action */}
              {!isOwner ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-full)' }}
                  onClick={() => {
                    onClose();
                    onMakeOffer(book);
                  }}
                >
                  <MessageSquare size={16} /> Propose Handover / Make Offer
                </button>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    padding: '0.5rem'
                  }}
                >
                  This is your own inscribed monograph
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
