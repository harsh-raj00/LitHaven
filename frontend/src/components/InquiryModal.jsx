import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { X, Send, MapPin, DollarSign, MessageSquare, Sparkles } from 'lucide-react';

export const InquiryModal = ({ book, onClose, onSuccess }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [offeredPrice, setOfferedPrice] = useState(book?.price || 0);
  const [proposedLocation, setProposedLocation] = useState(
    book?.campusLocation || 'Campus Central Library or Student Center'
  );
  const [message, setMessage] = useState(
    `Hi! I would like to purchase "${book?.title}". When and where can we meet for the handover?`
  );
  const [submitting, setSubmitting] = useState(false);

  if (!book) return null;

  const quickMessages = [
    'Is this still available for meetup today?',
    'Can we meet at the campus library around 3 PM?',
    'I can pick this up immediately!',
    'Are you willing to negotiate on the price?'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.inquiries.create({
        bookId: book._id,
        offeredPrice: Number(offeredPrice),
        proposedLocation,
        message
      });

      if (data.success) {
        showToast('Your offer & message were sent to the seller!', 'success');
        onSuccess(data.inquiry);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to send inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.4rem' }}>
          <img
            src={book.coverImage || '/covers/cover_placeholder.jpg'}
            alt={book.title}
            style={{ width: '56px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 700 }}>
              MAKE AN OFFER TO SELLER
            </div>
            <h3 style={{ fontSize: '1.15rem', lineHeight: 1.3 }}>{book.title}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Listed at: <strong style={{ color: 'var(--text-primary)' }}>${book.price}</strong> by{' '}
              {book.owner?.name}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Offer Price */}
          <div className="form-group">
            <label className="form-label">Your Offer Price ($)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                step="1"
                required
                className="form-input"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Proposed Meetup Location */}
          <div className="form-group">
            <label className="form-label">Proposed Campus Meetup Spot</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                value={proposedLocation}
                onChange={(e) => setProposedLocation(e.target.value)}
                placeholder="e.g. Central Library Front Steps or Cafeteria"
              />
            </div>
          </div>

          {/* Quick Message Chips */}
          <div style={{ marginBottom: '0.8rem' }}>
            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={12} /> Suggested message starters:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMessage(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="form-group">
            <label className="form-label">Message to Seller</label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: '0.8rem' }}
          >
            {submitting ? 'Sending Offer...' : <><Send size={16} /> Send Offer & Start Chat</>}
          </button>
        </form>
      </div>
    </div>
  );
};
