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
  const messagesEndRef = useRef(null);

  // Keep selectedInquiryIdRef in sync with state
  useEffect(() => {
    if (selectedInquiry?._id) {
      selectedInquiryIdRef.current = selectedInquiry._id;
    }
  }, [selectedInquiry?._id]);

  // Sync body class when mobile chat is open so bottom dock doesn't obscure chat input
  useEffect(() => {
    if (showChatMobile) {
      document.body.classList.add('chat-view-active');
    } else {
      document.body.classList.remove('chat-view-active');
    }
    return () => {
      document.body.classList.remove('chat-view-active');
    };
  }, [showChatMobile]);

  // Handle desktop resize so mobile state resets cleanly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        document.body.classList.remove('chat-view-active');
      } else if (showChatMobile) {
        document.body.classList.add('chat-view-active');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showChatMobile]);

  // Auto-scroll messages feed to bottom on new message or conversation switch
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedInquiry?.messages?.length, showChatMobile]);

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
          const currentId = selectedInquiryIdRef.current || (prev?._id ? String(prev._id) : null);
          if (currentId) {
            const found = sorted.find((i) => String(i._id) === String(currentId));
            if (found) {
              return found;
            }
          }
          // Only auto-select sorted[0] on initial load if nothing is selected
          if (!selectedInquiryIdRef.current && !prev && sorted.length > 0) {
            selectedInquiryIdRef.current = String(sorted[0]._id);
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
  }, [user]);

  const handleSelectInquiry = (inq) => {
    selectedInquiryIdRef.current = String(inq._id);
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
    <div className={`inquiries-page-wrap ${showChatMobile ? 'chat-open-mobile' : ''}`}>
      <div className="content-wrapper">
        <div className={`inquiries-page-header ${showChatMobile ? 'mobile-hidden-header' : ''}`}>
          <div className="eyebrow-tag" style={{ marginBottom: '0.35rem' }}>
            CAMPUS DISPATCH
          </div>
          <h1 className="inquiries-page-title">
            Messages & Handover Offers
          </h1>
          <p className="inquiries-page-subtitle">
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
                  const isSelected = String(selectedInquiry?._id) === String(inq._id);
                  const sellerMode = isSeller(inq);
                  const lastTime = formatTimeAgo(inq.lastMessageAt || inq.createdAt);

                  return (
                    <div
                      key={inq._id}
                      onClick={() => handleSelectInquiry(inq)}
                      className={`inquiry-thread-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="inquiry-thread-layout">
                        <img
                          src={inq.book?.coverImage || '/covers/cover_placeholder.jpg'}
                          alt={inq.book?.title}
                          className="inquiry-thread-thumb"
                        />
                        <div className="inquiry-thread-content">
                          <div className="inquiry-thread-top">
                            <span className="inquiry-thread-party">
                              {sellerMode ? 'Offer from' : 'Seller'}: <strong>{otherParty?.name?.split(' ')[0]}</strong>
                            </span>
                            <div className="inquiry-thread-meta">
                              <span className="inquiry-thread-time font-mono">
                                {lastTime}
                              </span>
                              {getStatusBadge(inq.status)}
                            </div>
                          </div>

                          <div className="inquiry-thread-title">
                            {inq.book?.title}
                          </div>

                          <div className="inquiry-thread-pricing">
                            <span className="font-mono inquiry-offer-amt">
                              Offer: {formatINR(inq.offeredPrice)}
                            </span>
                            {inq.book?.price && (
                              <span className="inquiry-listed-amt">
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
                <div className="inquiries-chat-inner">
                  {/* Unified Compact Chat Header */}
                  <div className="inquiry-chat-header">
                    <div className="inquiry-header-left">
                      <button
                        type="button"
                        className="chat-back-btn"
                        onClick={() => setShowChatMobile(false)}
                        aria-label="Back to all conversations"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <img
                        src={selectedInquiry.book?.coverImage || '/covers/cover_placeholder.jpg'}
                        alt={selectedInquiry.book?.title}
                        className="chat-header-book-img"
                      />
                      <div className="chat-header-meta">
                        <div className="chat-header-book-title" title={selectedInquiry.book?.title}>
                          {selectedInquiry.book?.title}
                        </div>
                        <div className="chat-header-sub">
                          <span>Offer: <strong className="font-mono">{formatINR(selectedInquiry.offeredPrice)}</strong></span>
                          <span className="chat-header-spot">• {selectedInquiry.proposedLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="inquiry-header-right">
                      {getStatusBadge(selectedInquiry.status)}
                      {isSeller(selectedInquiry) && selectedInquiry.status === 'pending' && (
                        <div className="chat-header-seller-actions">
                          <button
                            className="btn btn-primary btn-sm chat-action-btn"
                            onClick={() => handleStatusChange('accepted')}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-secondary btn-sm chat-action-btn"
                            onClick={() => handleStatusChange('declined')}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {isSeller(selectedInquiry) && selectedInquiry.status === 'accepted' && (
                        <button
                          className="btn btn-primary btn-sm chat-action-btn"
                          onClick={() => handleStatusChange('completed')}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Location strip on small mobile */}
                  <div className="chat-location-strip-mobile">
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Meetup Quad: <strong>{selectedInquiry.proposedLocation}</strong>
                  </div>

                  {/* Messages Feed */}
                  <div className="inquiry-messages-scroll">
                    {selectedInquiry.messages?.map((msg, idx) => {
                      const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                      const isMe = senderId === user?._id;
                      const senderName = isMe ? 'You' : getOtherParty(selectedInquiry)?.name?.split(' ')[0] || 'Student';

                      return (
                        <div
                          key={idx}
                          className={`inquiry-msg-row ${isMe ? 'msg-outgoing' : 'msg-incoming'}`}
                        >
                          <div className="inquiry-msg-sender">
                            {senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className={`inquiry-msg-bubble ${isMe ? 'bubble-outgoing' : 'bubble-incoming'}`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="inquiry-input-area">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="inquiry-input-form"
                    >
                      <input
                        type="text"
                        className="form-input inquiry-input-field"
                        placeholder="Type a message (e.g. Can meet in 15 mins)..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-accent inquiry-send-btn"
                        disabled={sending || !messageText.trim()}
                        aria-label="Send message"
                      >
                        <Send size={16} /> <span className="send-text-label">Send</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="inquiries-empty-prompt">
                  <MessageSquare size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <div>Select a conversation from the left to start chatting</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
