import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { X, Send, MapPin, MessageSquare, Sparkles } from 'lucide-react';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.6rem' }}>
          <img
            src={book.coverImage || '/covers/cover_placeholder.jpg'}
            alt={book.title}
            style={{ width: '60px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-terracotta)', fontWeight: 800, letterSpacing: '0.06em' }}>
              PROPOSE HANDOVER OFFER
            </div>
            <h3 className="font-serif-literary" style={{ fontSize: '1.3rem', lineHeight: 1.25 }}>{book.title}</h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Listed at: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatINR(book.price)}</strong> by{' '}
              {book.owner?.name}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Offer Price */}
          <div className="form-group">
            <label className="form-label">Your Proposed Offering Price (₹)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                step="1"
                required
                className="form-input font-mono"
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Proposed Meetup Location */}
          <div className="form-group">
            <label className="form-label">Proposed Campus Meetup Quad</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                value={proposedLocation}
                onChange={(e) => setProposedLocation(e.target.value)}
                placeholder="e.g. Central Library Front Steps or Quad Canteen"
              />
            </div>
          </div>

          {/* Quick Message Chips */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                marginBottom: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={12} color="var(--accent-gold)" /> QUICK HANDOVER PHRASES:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  className="quick-chip"
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
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: '1rem', borderRadius: 'var(--radius-full)', padding: '0.85rem' }}
          >
            {submitting ? 'Transmitting Proposal...' : <><Send size={16} /> Transmit Offer & Open Channel</>}
          </button>
        </form>
      </div>
    </div>
  );
};
