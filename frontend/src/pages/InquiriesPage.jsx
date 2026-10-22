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
  Check,
  ArrowLeft,
  ChevronDown,
  Plus,
  BookOpen
} from 'lucide-react';

const QUICK_REPLIES = [
  'On my way! 🚶',
  'Can we meet in 15 mins?',
  'Running a few minutes late, sorry!',
  'Is the book still available?'
];

const getSenderId = (msg) => (typeof msg?.sender === 'string' ? msg.sender : msg?.sender?._id);

const formatDayLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const InquiriesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Ref to track the user's active selected conversation across intervals and async fetches
  const selectedInquiryIdRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const lastScrolledThreadRef = useRef(null);

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

  const scrollToBottom = (behavior = 'auto') => {
    const el = messagesScrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  };

  const handleMessagesScroll = () => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    isNearBottomRef.current = nearBottom;
    setShowScrollDown(!nearBottom);
  };

  // Jump to latest on conversation switch; follow new messages only if the user is already near the bottom
  useEffect(() => {
    const threadId = selectedInquiry?._id;
    if (!threadId) return;
    if (lastScrolledThreadRef.current !== threadId) {
      lastScrolledThreadRef.current = threadId;
      isNearBottomRef.current = true;
      setShowScrollDown(false);
      setShowAttachMenu(false);
      requestAnimationFrame(() => scrollToBottom('auto'));
    } else if (isNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom('smooth'));
    }
  }, [selectedInquiry?._id, selectedInquiry?.messages?.length, showChatMobile]);

  // Size the fullscreen mobile chat to the visual viewport so the on-screen keyboard never covers the composer
  useEffect(() => {
    const vv = window.visualViewport;
    if (!showChatMobile || !vv) return;
    const root = document.documentElement;
    const update = () => {
      root.style.setProperty('--chat-vv-height', `${vv.height}px`);
      root.style.setProperty('--chat-vv-top', `${vv.offsetTop}px`);
      if (isNearBottomRef.current) scrollToBottom('auto');
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      root.style.removeProperty('--chat-vv-height');
      root.style.removeProperty('--chat-vv-top');
    };
  }, [showChatMobile]);

  // Auto-grow the composer textarea up to its CSS max-height
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [messageText]);

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
        if (!textToSend) setMessageText('');
        isNearBottomRef.current = true;
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

  const handleQuickSend = (text) => {
    setShowAttachMenu(false);
    handleSendMessage(text);
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

  const otherParty = getOtherParty(selectedInquiry);
  const sellerMode = isSeller(selectedInquiry);
  const messages = selectedInquiry?.messages || [];
  // No server-side read tracking yet: an outgoing message counts as seen once the other party replies after it
  const lastIncomingIdx = messages.reduce(
    (last, msg, idx) => (getSenderId(msg) !== user?._id ? idx : last),
    -1
  );

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
                  {/* Compact Chat Header */}
                  <div className="inquiry-chat-header">
                    <div className="chat-header-row">
                      <button
                        type="button"
                        className="chat-back-btn"
                        onClick={() => setShowChatMobile(false)}
                        aria-label="Back to all conversations"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="chat-header-avatar">
                        <img
                          src={selectedInquiry.book?.coverImage || '/covers/cover_placeholder.jpg'}
                          alt={selectedInquiry.book?.title}
                          className="chat-header-book-img"
                        />
                        <span className="chat-header-party-initial">
                          {(otherParty?.name || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="chat-header-meta">
                        <div className="chat-header-name">{otherParty?.name || 'Student'}</div>
                        <div className="chat-header-book-title" title={selectedInquiry.book?.title}>
                          {selectedInquiry.book?.title}
                        </div>
                      </div>

                      <div className="inquiry-header-right">
                        {sellerMode && selectedInquiry.status === 'pending' && (
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
                        {sellerMode && selectedInquiry.status === 'accepted' && (
                          <button
                            className="btn btn-primary btn-sm chat-action-btn"
                            onClick={() => handleStatusChange('completed')}
                          >
                            <CheckCheck size={14} />
                            <span>Mark <span className="chat-action-label-long">Completed</span><span className="chat-action-label-short">Done</span></span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="chat-info-strip">
                      {getStatusBadge(selectedInquiry.status)}
                      <span className="chat-info-chip">
                        Offer <strong className="font-mono">{formatINR(selectedInquiry.offeredPrice)}</strong>
                      </span>
                      <span className="chat-info-chip chip-location" title={selectedInquiry.proposedLocation}>
                        <MapPin size={12} />
                        <span>{selectedInquiry.proposedLocation}</span>
                      </span>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div
                    className="inquiry-messages-scroll"
                    ref={messagesScrollRef}
                    onScroll={handleMessagesScroll}
                  >
                    {messages.map((msg, idx) => {
                      const senderId = getSenderId(msg);
                      const isMe = senderId === user?._id;
                      const prev = messages[idx - 1];
                      const msgDate = new Date(msg.createdAt);
                      const newDay = !prev || new Date(prev.createdAt).toDateString() !== msgDate.toDateString();
                      const groupStart =
                        newDay ||
                        getSenderId(prev) !== senderId ||
                        msgDate - new Date(prev.createdAt) > 5 * 60 * 1000;
                      const seen = isMe && idx < lastIncomingIdx;

                      return (
                        <React.Fragment key={msg._id || idx}>
                          {newDay && <div className="chat-day-divider">{formatDayLabel(msgDate)}</div>}
                          <div
                            className={`inquiry-msg-row ${isMe ? 'msg-outgoing' : 'msg-incoming'} ${groupStart ? 'group-start' : ''}`}
                          >
                            <div className={`inquiry-msg-bubble ${isMe ? 'bubble-outgoing' : 'bubble-incoming'}`}>
                              {msg.text}
                              <span className="inquiry-msg-meta">
                                {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {isMe && (
                                  <span
                                    className={`msg-receipt ${seen ? 'seen' : ''}`}
                                    aria-label={seen ? 'Seen' : 'Sent'}
                                  >
                                    {seen ? <CheckCheck size={14} /> : <Check size={14} />}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {showScrollDown && (
                    <button
                      type="button"
                      className="chat-scroll-bottom-btn"
                      onClick={() => scrollToBottom('smooth')}
                      aria-label="Scroll to latest message"
                    >
                      <ChevronDown size={20} />
                    </button>
                  )}

                  {/* Composer */}
                  <div className="inquiry-input-area">
                    {showAttachMenu && (
                      <div className="chat-attach-menu" role="menu">
                        <div className="chat-attach-menu-label">Share</div>
                        <button
                          type="button"
                          className="chat-attach-option"
                          onClick={() => handleQuickSend(`📍 Meetup spot: ${selectedInquiry.proposedLocation}`)}
                        >
                          <span className="chat-attach-icon icon-terracotta"><MapPin size={15} /></span>
                          Meetup location
                        </button>
                        <button
                          type="button"
                          className="chat-attach-option"
                          onClick={() => handleQuickSend(`📚 ${selectedInquiry.book?.title} — offer ${formatINR(selectedInquiry.offeredPrice)}`)}
                        >
                          <span className="chat-attach-icon"><BookOpen size={15} /></span>
                          Book & offer details
                        </button>
                        <div className="chat-attach-menu-label">Quick replies</div>
                        {QUICK_REPLIES.map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            className="chat-attach-option"
                            onClick={() => handleQuickSend(reply)}
                          >
                            <span className="chat-attach-icon"><MessageSquare size={15} /></span>
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="inquiry-input-form"
                    >
                      <div className="chat-composer-pill">
                        <button
                          type="button"
                          className={`chat-attach-btn ${showAttachMenu ? 'open' : ''}`}
                          onClick={() => setShowAttachMenu((v) => !v)}
                          aria-label="Attach"
                          aria-expanded={showAttachMenu}
                        >
                          <Plus size={20} />
                        </button>
                        <textarea
                          ref={inputRef}
                          rows={1}
                          className="inquiry-input-field"
                          placeholder="Message"
                          value={messageText}
                          maxLength={1000}
                          onChange={(e) => setMessageText(e.target.value)}
                          onFocus={() => setShowAttachMenu(false)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="inquiry-send-btn"
                        disabled={sending || !messageText.trim()}
                        aria-label="Send message"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Send size={18} />
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
