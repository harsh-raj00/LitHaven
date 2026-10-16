import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
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
  Share2
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
        text: `Check out "${book.title}" on LitHaven campus book exchange!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const isOwner = user?._id && (book.owner?._id || book.owner) === user._id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Left Column: Image & Quick Stats */}
          <div>
            <div
              style={{
                width: '100%',
                height: '380px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#111522',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <img
                src={book.coverImage || '/covers/cover_placeholder.jpg'}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                <span className="badge badge-like-new">{book.condition}</span>
              </div>

              {discountPercent && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px'
                  }}
                >
                  SAVE {discountPercent}%
                </div>
              )}
            </div>

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <button
                className={`btn btn-secondary ${wishlisted ? 'btn-primary' : ''}`}
                style={{ flex: 1 }}
                onClick={handleWishlistToggle}
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Saved' : 'Save Book'}
              </button>

              <button className="btn btn-secondary" onClick={handleShare} title="Share Link">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Book Details & Seller Card */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem'
              }}
            >
              {book.category}
            </span>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{book.title}</h2>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              by <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
            </div>

            {/* Price Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.8rem',
                padding: '0.8rem 1.2rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.4rem'
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${book.price}
              </div>
              {book.originalPrice > book.price && (
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  Original MRP: ${book.originalPrice}
                </div>
              )}
              <span className="badge badge-good" style={{ marginLeft: 'auto', textTransform: 'none' }}>
                Status: {book.status}
              </span>
            </div>

            {/* Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.85rem',
                marginBottom: '1.4rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Edition: </span>
                <strong>{book.edition || 'Standard'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>ISBN: </span>
                <strong>{book.isbn || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Subject: </span>
                <strong>{book.subject || 'General'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Semester: </span>
                <strong>{book.semester || 'All'}</strong>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.4rem' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '0.4rem' }}>Description & Condition</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{book.description}</p>
              {book.conditionNotes && (
                <div
                  style={{
                    marginTop: '0.6rem',
                    fontSize: '0.82rem',
                    color: 'var(--accent-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CheckCircle size={14} /> Notes: {book.conditionNotes}
                </div>
              )}
            </div>

            {/* Seller Info Card */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.07)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                marginTop: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <img
                  src={
                    book.owner?.avatar ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(book.owner?.name || 'Seller')}`
                  }
                  alt={book.owner?.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {book.owner?.name || 'Campus Student'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {book.owner?.college || 'University Campus'} • {book.owner?.year}
                  </div>
                </div>

                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.9rem'
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
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem'
                }}
              >
                <MapPin size={14} color="var(--primary-light)" />
                Pickup spot: {book.campusLocation || 'Campus Central Library'}
              </div>

              {/* Action */}
              {!isOwner ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={() => {
                    onClose();
                    onMakeOffer(book);
                  }}
                >
                  <MessageSquare size={16} /> Make Offer / Message Seller
                </button>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--primary-light)',
                    fontWeight: 600,
                    padding: '0.5rem'
                  }}
                >
                  This is your own listing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
