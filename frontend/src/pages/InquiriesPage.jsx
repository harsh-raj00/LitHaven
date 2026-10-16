import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  User,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export const InquiriesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchInquiries = async () => {
    try {
      const data = await api.inquiries.getMyInquiries();
      if (data.success) {
        setInquiries(data.inquiries);
        if (data.inquiries.length > 0 && !selectedInquiry) {
          setSelectedInquiry(data.inquiries[0]);
        } else if (selectedInquiry) {
          const updated = data.inquiries.find((i) => i._id === selectedInquiry._id);
          if (updated) setSelectedInquiry(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // Poll every 8 seconds for new messages in active thread
    const interval = setInterval(fetchInquiries, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || messageText.trim();
    if (!text || !selectedInquiry) return;

    setSending(true);
    try {
      const data = await api.inquiries.sendMessage(selectedInquiry._id, text);
      if (data.success) {
        setMessageText('');
        setSelectedInquiry(data.inquiry);
        // update inquiry in master list
        setInquiries((prev) =>
          prev.map((i) => (i._id === data.inquiry._id ? data.inquiry : i))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedInquiry) return;
    try {
      const data = await api.inquiries.updateStatus(selectedInquiry._id, newStatus);
      if (data.success) {
        showToast(`Offer marked as ${newStatus}`, 'success');
        fetchInquiries();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge badge-new"><CheckCircle size={12} /> Accepted</span>;
      case 'declined':
        return <span className="badge badge-poor"><XCircle size={12} /> Declined</span>;
      case 'completed':
        return <span className="badge badge-like-new"><CheckCircle size={12} /> Handover Done</span>;
      default:
        return <span className="badge badge-fair"><Clock size={12} /> Pending Offer</span>;
    }
  };

  const quickPresets = [
    'Can we meet at the Library Quad Atrium at 3:00 PM?',
    'I have cash ready. Can we finalize today?',
    'Are the page annotations minimal as described?',
    'I accept your proposed handover window!'
  ];

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '2.2rem' }}>
          <div className="hero-badge-tag" style={{ marginBottom: '0.6rem' }}>
            <MessageSquare size={14} color="var(--accent-gold)" /> PEER NEGOTIATION & QUAD HANDOVER
          </div>
          <h1 className="font-display" style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
            Campus Offers & Handover Salon
          </h1>
          <p className="font-serif-literary" style={{ fontSize: '1.25rem', maxWidth: '720px' }}>
            Coordinate verified university quad handovers, negotiate fair student pricing, and finalize
            exchanges safely without third-party platform markups.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid rgba(124, 58, 237, 0.2)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Retrieving active negotiations...
            </p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
            <MessageSquare size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
            <h3 className="font-display">No Active Negotiations Recorded</h3>
            <p style={{ maxWidth: '440px', margin: '0.6rem auto 1.5rem', color: 'var(--text-secondary)' }}>
              When you propose an offer on a volume in The Codex Exchange or a fellow scholar inquires about
              your monograph, your active thread will materialize here.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)',
              gap: '1.8rem',
              minHeight: '640px'
            }}
            className="inquiries-layout"
          >
            {/* Left: Inquiries List */}
            <div
              className="glass-panel"
              style={{ padding: '1.2rem', overflowY: 'auto', maxHeight: '740px', borderRadius: 'var(--radius-lg)' }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  padding: '0.4rem 0.6rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Active Channels ({inquiries.length})</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span> Live Synchronized
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?._id === inq._id;
                  const otherParty =
                    inq.buyer?._id === user?._id ? inq.seller : inq.buyer;
                  const isUserSeller = inq.seller?._id === user?._id;

                  return (
                    <div
                      key={inq._id}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.16) 0%, rgba(212, 175, 55, 0.08) 100%)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected
                          ? '1px solid var(--border-gold)'
                          : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            color: isUserSeller ? 'var(--accent-gold)' : 'var(--primary-light)'
                          }}
                        >
                          {isUserSeller ? 'INCOMING OFFER' : 'OUTGOING PROPOSAL'}
                        </span>
                        {getStatusBadge(inq.status)}
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <img
                          src={inq.book?.coverImage || '/covers/cover_placeholder.jpg'}
                          alt={inq.book?.title}
                          style={{
                            width: '42px',
                            height: '56px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            className="font-serif-literary"
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {inq.book?.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            with {otherParty?.name} • <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>${inq.offeredPrice}</strong>
                          </div>
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '0.2rem'
                            }}
                          >
                            {inq.messages?.[inq.messages.length - 1]?.text || 'Negotiation opened'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Handover Negotiation Channel */}
            {selectedInquiry ? (
              <div
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  height: '740px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-gold)'
                }}
              >
                {/* Handover Agreement Card Header */}
                <div
                  style={{
                    padding: '1.2rem 1.6rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 14, 24, 0.85) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={selectedInquiry.book?.coverImage || '/covers/cover_placeholder.jpg'}
                      alt={selectedInquiry.book?.title}
                      style={{ width: '48px', height: '64px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-gold)' }}
                    />
                    <div>
                      <h3 className="font-serif-literary" style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>
                        {selectedInquiry.book?.title}
                      </h3>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span>
                          Proposed Price:{' '}
                          <strong className="font-mono" style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>
                            ${selectedInquiry.offeredPrice}
                          </strong>
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} color="var(--accent-gold)" />
                          {selectedInquiry.proposedLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Status Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {selectedInquiry.seller?._id === user?._id &&
                      selectedInquiry.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusChange('accepted')}
                            style={{ padding: '0.45rem 0.95rem', borderRadius: '8px' }}
                          >
                            <CheckCircle size={14} /> Accept Offer
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleStatusChange('declined')}
                            style={{ padding: '0.45rem 0.95rem', borderRadius: '8px' }}
                          >
                            <XCircle size={14} /> Decline
                          </button>
                        </>
                      )}

                    {selectedInquiry.status === 'accepted' && (
                      <button
                        type="button"
                        className="btn btn-accent btn-sm"
                        onClick={() => handleStatusChange('completed')}
                        style={{ padding: '0.45rem 0.95rem', borderRadius: '8px' }}
                      >
                        <CheckCircle size={14} /> Mark Handover Completed
                      </button>
                    )}

                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                </div>

                {/* Messages Box */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.6rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {selectedInquiry.messages?.map((msg, i) => {
                    const isMe = (msg.sender?._id || msg.sender) === user?._id;
                    const senderObj =
                      isMe ? user : selectedInquiry.buyer?._id === user?._id ? selectedInquiry.seller : selectedInquiry.buyer;

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          flexDirection: isMe ? 'row-reverse' : 'row'
                        }}
                      >
                        <img
                          src={
                            senderObj?.avatar ||
                            `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(senderObj?.name || 'Student')}`
                          }
                          alt="avatar"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginTop: '4px',
                            border: '1px solid var(--border-gold)'
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginBottom: '0.25rem',
                              textAlign: isMe ? 'right' : 'left'
                            }}
                          >
                            {isMe ? 'You (Verified)' : senderObj?.name}
                          </div>
                          <div
                            style={{
                              background: isMe ? 'linear-gradient(135deg, var(--primary) 0%, #5b21b6 100%)' : 'rgba(255, 255, 255, 0.06)',
                              color: '#ffffff',
                              padding: '0.8rem 1.1rem',
                              borderRadius: isMe
                                ? '16px 16px 4px 16px'
                                : '16px 16px 16px 4px',
                              fontSize: '0.92rem',
                              lineHeight: 1.5,
                              boxShadow: 'var(--shadow-sm)',
                              border: isMe ? 'none' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Negotiation Preset Chips */}
                <div style={{ padding: '0.6rem 1.4rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                    QUICK HANDOVER PHRASES:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {quickPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="quick-chip"
                        onClick={() => handleSendMessage(preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Message Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={{
                    padding: '1rem 1.4rem',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <input
                    type="text"
                    required
                    placeholder="Type message to agree on campus quad meetup time or price..."
                    className="form-input"
                    style={{ borderRadius: '999px', fontSize: '0.9rem' }}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending}
                    style={{ borderRadius: '999px', padding: '0.75rem 1.3rem' }}
                  >
                    {sending ? 'Sending...' : <Send size={16} />}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
