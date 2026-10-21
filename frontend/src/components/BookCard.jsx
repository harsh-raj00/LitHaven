import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { Heart, MapPin, Sparkles, Eye, ArrowUpRight } from 'lucide-react';

export const BookCard = ({ book, onSelect, onInquire }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const isInitiallyWishlisted =
    user?.wishlist?.some(
      (b) => (typeof b === 'string' ? b : b._id) === book._id
    ) || false;

  const [wishlisted, setWishlisted] = useState(isInitiallyWishlisted);
  const [wishlistCount, setWishlistCount] = useState(book.wishlistCount || 0);
  const [imgError, setImgError] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
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
      showToast(err.message || 'Could not update wishlist', 'error');
    }
  };

  const getConditionBadgeClass = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'new':
        return 'badge-new';
      case 'like new':
        return 'badge-like-new';
      case 'good':
        return 'badge-good';
      case 'fair':
        return 'badge-fair';
      default:
        return 'badge-poor';
    }
  };

  // Calculate discount percentage and savings
  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const savingsAmount =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(book.originalPrice - book.price)
      : null;

  return (
    <div className="book-card" onClick={() => onSelect(book)} role="button" tabIndex={0}>
      {/* Cover Image Wrapper with 3D Spine Lighting */}
      <div className="book-card-image-wrap">
        {/* Physical Hardcover Spine Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '18px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 30%, transparent 100%)',
            borderRight: '1px solid rgba(0, 0, 0, 0.25)',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        />

        <img
          src={
            imgError || !book.coverImage
              ? '/covers/cover_placeholder.jpg'
              : book.coverImage
          }
          alt={book.title}
          className="book-card-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Condition Badge Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '16px', zIndex: 4 }}>
          <span className={`badge ${getConditionBadgeClass(book.condition)}`}>
            {book.condition}
          </span>
        </div>

        {/* Course Code Tag if present */}
        {book.courseCode && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '48px',
              zIndex: 4,
              background: 'rgba(10, 14, 24, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--accent-amber)',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {book.courseCode}
          </div>
        )}

        {/* Discount Tag */}
        {discountPercent && discountPercent > 0 && (
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
              padding: '0.24rem 0.65rem',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {savingsAmount ? `Save ${formatINR(savingsAmount)} (${discountPercent}%)` : `Save ${discountPercent}%`}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`book-card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body Info */}
      <div className="book-card-body">
        <div className="book-card-category" style={{ letterSpacing: '0.08em' }}>
          {book.category}
        </div>
        <h3 className="book-card-title font-serif-literary" title={book.title} style={{ fontSize: '1.18rem', lineHeight: '1.35' }}>
          {book.title}
        </h3>
        <p className="book-card-author">by {book.author}</p>

        {/* Campus & Location */}
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
          <MapPin size={13} color="var(--accent-terracotta)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {book.campusMeetingSpot || book.owner?.college || 'Campus Quad'}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="book-card-footer">
          <div className="book-price-box">
            <span className="book-price-current font-mono">{formatINR(book.price)}</span>
            {book.originalPrice > book.price && (
              <span className="book-price-original font-mono">MRP {formatINR(book.originalPrice)}</span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
          >
            Inspect <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
