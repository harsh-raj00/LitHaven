import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
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

  // Calculate discount percentage
  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      {/* Cover Image Wrapper */}
      <div className="book-card-image-wrap">
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
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span className={`badge ${getConditionBadgeClass(book.condition)}`}>
            {book.condition}
          </span>
        </div>

        {/* Discount Tag */}
        {discountPercent && discountPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              zIndex: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`book-card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body Info */}
      <div className="book-card-body">
        <div className="book-card-category">{book.category}</div>
        <h3 className="book-card-title" title={book.title}>
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
          <MapPin size={13} color="var(--primary-light)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {book.owner?.college || 'University Campus'}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="book-card-footer">
          <div className="book-price-box">
            <span className="book-price-current">${book.price}</span>
            {book.originalPrice > book.price && (
              <span className="book-price-original">${book.originalPrice}</span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
          >
            Details <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
