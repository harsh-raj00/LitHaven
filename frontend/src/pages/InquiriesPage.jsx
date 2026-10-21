import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/formatters';
import {
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';

export const InquiriesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);

  // Ref to track the user's active selected conversation across intervals and async fetches
  const selectedInquiryIdRef = useRef(null);

  // Keep selectedInquiryIdRef in sync with state
  useEffect(() => {
    if (selectedInquiry?._id) {
      selectedInquiryIdRef.current = selectedInquiry._id;
    }
  }, [selectedInquiry?._id]);

  // Deterministic stable sorting by lastMessageAt descending with ID fallback
  const sortInquiries = (list) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.lastMessageAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.lastMessageAt || b.createdAt || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return String(b._id).localeCompare(String(a._id));
    });
  };

  const fetchInquiries = async () => {
    try {
      const data = await api.inquiries.getMyInquiries();
      if (data.success) {
        const sorted = sortInquiries(data.inquiries);
        setInquiries(sorted);

        // Keep existing selected inquiry updated without jumping to first item
        setSelectedInquiry((prev) => {
          const currentId = selectedInquiryIdRef.current || prev?._id;
          if (currentId) {
            const found = sorted.find((i) => i._id === currentId);
            if (found) {
              return found;
            }
          }
          // Only auto-select sorted[0] on initial load if nothing is selected
          if (!selectedInquiryIdRef.current && !prev && sorted.length > 0) {
            selectedInquiryIdRef.current = sorted[0]._id;
            return sorted[0];
          }
          return prev || (sorted[0] || null);
        });
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectInquiry = (inq) => {
    selectedInquiryIdRef.current = inq._id;
    setSelectedInquiry(inq);
    setShowChatMobile(true);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || messageText.trim();
    if (!text || !selectedInquiry) return;

    setSending(true);
    try {
      const data = await api.inquiries.sendMessage(selectedInquiry._id, text);
      if (data.success) {
        setMessageText('');
        selectedInquiryIdRef.current = data.inquiry._id;
        setSelectedInquiry(data.inquiry);

        // Legitimately moves to index 0 ONLY when a new message is posted
        setInquiries((prev) => {
          const remaining = prev.filter((i) => i._id !== data.inquiry._id);
          return [data.inquiry, ...remaining];
        });
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
        return <span className="badge badge-like-new"><CheckCheck size={12} /> Completed</span>;
      default:
        return <span className="badge badge-good"><Clock size={12} /> Pending</span>;
    }
  };

  const isSeller = (inq) => {
    if (!inq || !user) return false;
    const sellerId = typeof inq.seller === 'string' ? inq.seller : inq.seller?._id;
    return sellerId === user._id;
  };

  const getOtherParty = (inq) => {
    if (!inq || !user) return null;
    return isSeller(inq) ? inq.buyer : inq.seller;
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-terracotta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
            CAMPUS DISPATCH
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Messages & Handover Offers
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Coordinate in-person campus exchanges, confirm offer prices, and lock in meeting spots.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading messages...
          </div>
        ) : inquiries.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              No messages yet
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              When someone asks about your book or you message a seller, your chats will appear here.
            </p>
          </div>
        ) : (
          <div className="inquiries-container">
            {/* Left Column: Inquiry Threads List */}
            <div className={`inquiries-list-col ${showChatMobile ? 'mobile-hidden' : ''}`}>
              <div className="inquiries-list-header">
                <span>Conversations ({inquiries.length})</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Active offers
                </span>
              </div>

              <div className="inquiries-list-scroll">
                {inquiries.map((inq) => {
                  const otherParty = getOtherParty(inq);
                  const isSelected = selectedInquiry?._id === inq._id;
                  const sellerMode = isSeller(inq);
                  const lastTime = formatTimeAgo(inq.lastMessageAt || inq.createdAt);

                  return (
                    <div
                      key={inq._id}
                      onClick={() => handleSelectInquiry(inq)}
                      className={`inquiry-thread-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <img
                          src={inq.book?.coverImage || '/covers/cover_placeholder.jpg'}
                          alt={inq.book?.title}
                          style={{
                            width: '44px',
                            height: '58px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {sellerMode ? 'Offer from' : 'Seller'}: <strong>{otherParty?.name?.split(' ')[0]}</strong>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {lastTime}
                              </span>
                              {getStatusBadge(inq.status)}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginBottom: '0.2rem'
                            }}
                          >
                            {inq.book?.title}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', fontSize: '0.8rem' }}>
                            <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              Offer: {formatINR(inq.offeredPrice)}
                            </span>
                            {inq.book?.price && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                (Listed: {formatINR(inq.book.price)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Chat Window & Offer Controls */}
            <div className={`inquiries-chat-col ${!showChatMobile ? 'mobile-hidden' : ''}`}>
              {selectedInquiry ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Mobile Back Bar */}
                  <div className="mobile-chat-nav-bar">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowChatMobile(false)}
                      style={{ padding: '0.4rem 0.6rem', gap: '0.4rem', fontSize: '0.85rem' }}
                    >
                      <ArrowLeft size={16} /> All Conversations
                    </button>
                    {getStatusBadge(selectedInquiry.status)}
                  </div>

                  {/* Header */}
                  <div className="inquiry-chat-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      <img
                        src={selectedInquiry.book?.coverImage || '/covers/cover_placeholder.jpg'}
                        alt={selectedInquiry.book?.title}
                        style={{ width: '42px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.94rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {selectedInquiry.book?.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          Offer: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatINR(selectedInquiry.offeredPrice)}</strong>
                          <span className="hide-on-mobile"> • Meet at {selectedInquiry.proposedLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Seller Action Controls */}
                    {isSeller(selectedInquiry) && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        {selectedInquiry.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusChange('accepted')}
                            >
                              Accept Offer
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStatusChange('declined')}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {selectedInquiry.status === 'accepted' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusChange('completed')}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Location notice on mobile */}
                  <div className="show-on-mobile" style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Meeting spot: <strong style={{ color: 'var(--text-secondary)' }}>{selectedInquiry.proposedLocation}</strong>
                  </div>

                  {/* Messages Thread */}
                  <div className="inquiry-messages-scroll">
                    {selectedInquiry.messages?.map((msg, idx) => {
                      const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                      const isMe = senderId === user?._id;
                      const senderName = isMe ? 'You' : getOtherParty(selectedInquiry)?.name?.split(' ')[0] || 'Student';

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                            {senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div
                            style={{
                              maxWidth: '85%',
                              padding: '0.65rem 0.95rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.88rem',
                              lineHeight: 1.5,
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              background: isMe ? 'var(--btn-primary-bg)' : 'var(--bg-secondary)',
                              color: isMe ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                              border: isMe ? 'none' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Area */}
                  <div className="inquiry-input-area">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      style={{ display: 'flex', gap: '0.5rem' }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type a message (e.g. Can meet in 15 mins)..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        style={{ fontSize: '0.88rem' }}
                      />
                      <button
                        type="submit"
                        className="btn btn-accent"
                        disabled={sending || !messageText.trim()}
                        style={{ padding: '0.65rem 1.15rem', whiteSpace: 'nowrap' }}
                      >
                        <Send size={15} /> <span className="hide-on-mobile">Send</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '3rem', height: '100%' }}>
                  Select a message on the left to start chatting
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
