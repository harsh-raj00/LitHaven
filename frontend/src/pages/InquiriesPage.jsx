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
  Sparkles
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedInquiry) return;

    setSending(true);
    try {
      const data = await api.inquiries.sendMessage(selectedInquiry._id, messageText.trim());
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

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            Book Handover Offers & Chats
          </h1>
          <p>Coordinate peer-to-peer campus meetups and negotiate purchase offers directly.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p>Loading your conversations...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No Active Offers or Conversations Yet</h3>
            <p style={{ maxWidth: '440px', margin: '0.6rem auto 1.4rem' }}>
              When you make an offer on a book in the Codex Exchange or a fellow scholar makes an offer
              on your listing, your chat threads will appear here!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 2fr)',
              gap: '1.5rem',
              minHeight: '620px'
            }}
            className="inquiries-layout"
          >
            {/* Left: Inquiries List */}
            <div
              className="glass-panel"
              style={{ padding: '1rem', overflowY: 'auto', maxHeight: '720px' }}
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
                <span>Active Threads ({inquiries.length})</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>Live Sync</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?._id === inq._id;
                  const otherParty =
                    inq.buyer?._id === user?._id ? inq.seller : inq.buyer;
                  const isUserSeller = inq.seller?._id === user?._id;

                  return (
                    <div
                      key={inq._id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'rgba(99, 102, 241, 0.16)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected
                          ? '1px solid var(--primary)'
                          : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.4rem'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                          {isUserSeller ? 'INCOMING OFFER' : 'OUTGOING OFFER'}
                        </span>
                        {getStatusBadge(inq.status)}
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img
                          src={inq.book?.coverImage || '/covers/cover_placeholder.jpg'}
                          alt={inq.book?.title}
                          style={{
                            width: '42px',
                            height: '52px',
                            borderRadius: '6px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {inq.book?.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            with {otherParty?.name} • ${inq.offeredPrice}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '0.2rem'
                            }}
                          >
                            {inq.messages?.[inq.messages.length - 1]?.text || 'No messages yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Conversation Thread */}
            {selectedInquiry ? (
              <div
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  height: '720px'
                }}
              >
                {/* Thread Header */}
                <div
                  style={{
                    padding: '1.2rem 1.6rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <img
                      src={selectedInquiry.book?.coverImage || '/covers/cover_placeholder.jpg'}
                      alt={selectedInquiry.book?.title}
                      style={{ width: '48px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>
                        {selectedInquiry.book?.title}
                      </h3>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem'
                        }}
                      >
                        <span>
                          Offer Price:{' '}
                          <strong style={{ color: 'var(--text-primary)' }}>
                            ${selectedInquiry.offeredPrice}
                          </strong>
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} color="var(--primary-light)" />
                          {selectedInquiry.proposedLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Status Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selectedInquiry.seller?._id === user?._id &&
                      selectedInquiry.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusChange('accepted')}
                          >
                            <CheckCircle size={14} /> Accept Offer
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleStatusChange('declined')}
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
                    padding: '1.5rem',
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
                          gap: '0.65rem',
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
                            marginTop: '4px'
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '0.74rem',
                              color: 'var(--text-muted)',
                              marginBottom: '0.2rem',
                              textAlign: isMe ? 'right' : 'left'
                            }}
                          >
                            {isMe ? 'You' : senderObj?.name}
                          </div>
                          <div
                            style={{
                              background: isMe ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                              color: '#ffffff',
                              padding: '0.75rem 1rem',
                              borderRadius: isMe
                                ? '16px 16px 4px 16px'
                                : '16px 16px 16px 4px',
                              fontSize: '0.9rem',
                              lineHeight: 1.45,
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send Message Form */}
                <form
                  onSubmit={handleSendMessage}
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
                    placeholder="Type message to agree on campus meetup time or price..."
                    className="form-input"
                    style={{ borderRadius: '999px' }}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending}
                    style={{ borderRadius: '999px', padding: '0.75rem 1.2rem' }}
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
