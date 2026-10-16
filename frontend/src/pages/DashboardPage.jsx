import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookCard } from '../components/BookCard';
import { ResourceCard } from '../components/ResourceCard';
import {
  User,
  BookOpen,
  Heart,
  FileText,
  Star,
  Settings,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  PlusCircle,
  MapPin,
  Calendar,
  X,
  Award,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const DashboardPage = ({ setCurrentView, onSelectBook, onInquireBook }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'wishlist', 'resources'
  const [myListings, setMyListings] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '2nd Year',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, meRes, resourcesRes] = await Promise.all([
        api.books.getMyListings(),
        api.auth.getMe(),
        api.resources.getMyResources()
      ]);

      if (listingsRes.success) setMyListings(listingsRes.books);
      if (meRes.success && meRes.user.wishlist) setWishlistBooks(meRes.user.wishlist);
      if (resourcesRes.success) setMyResources(resourcesRes.resources);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteListing = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this monograph listing?')) return;
    try {
      const res = await api.books.delete(bookId);
      if (res.success) {
        showToast('Monograph removed from Codex Exchange', 'success');
        setMyListings((prev) => prev.filter((b) => b._id !== bookId));
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove listing', 'error');
    }
  };

  const handleToggleStatus = async (book) => {
    const nextStatus = book.status === 'available' ? 'sold' : 'available';
    try {
      const res = await api.books.update(book._id, { status: nextStatus });
      if (res.success) {
        showToast(`Volume marked as ${nextStatus}`, 'success');
        setMyListings((prev) =>
          prev.map((b) => (b._id === book._id ? { ...b, status: nextStatus } : b))
        );
      }
    } catch (err) {
      showToast(err.message || 'Could not update status', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setEditModalOpen(false);
    } catch {
      // toast in context
    }
  };

  // Calculate personal savings impact
  const totalSavingsGenerated = myListings.reduce((acc, book) => {
    if (book.originalPrice && book.originalPrice > book.price) {
      return acc + (book.originalPrice - book.price);
    }
    return acc;
  }, 0);

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Scholar's Study Academic Passport Header */}
        <div
          className="glass-panel"
          style={{
            padding: '2.4rem',
            marginBottom: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.8rem',
            background: 'radial-gradient(ellipse at 10% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 60%), var(--bg-glass-heavy)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'Student')}`
                }
                alt={user?.name}
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-gold)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: 'var(--primary)',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '2px solid var(--bg-secondary)'
                }}
                title="Verified Scholar"
              >
                <Award size={14} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <h1 className="font-display" style={{ fontSize: '2rem' }}>{user?.name}</h1>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    background: 'rgba(251, 191, 36, 0.12)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}
                >
                  <Star size={14} fill="currentColor" /> {user?.rating || '5.0'} / 5.0
                </span>
                <span className="badge badge-like-new">SENIOR SCHOLAR</span>
              </div>

              <div style={{ fontSize: '0.92rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {user?.college || 'University Campus'} • {user?.department || 'Academic Department'} ({user?.year || 'Fellow'})
              </div>

              <p style={{ fontSize: '0.88rem', marginTop: '0.5rem', maxWidth: '580px', color: 'var(--text-secondary)' }}>
                {user?.bio || 'Collegiate scholar actively circulating authoritative research and academic textbooks on LitHaven.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Edit Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <div className="glass-panel" style={{ padding: '0.6rem 1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  ${totalSavingsGenerated}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Peer Savings</div>
              </div>
              <div className="glass-panel" style={{ padding: '0.6rem 1rem', textAlign: 'center', borderRadius: '10px' }}>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {myListings.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Volumes</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setProfileForm({
                    name: user?.name || '',
                    college: user?.college || '',
                    department: user?.department || '',
                    year: user?.year || '2nd Year',
                    phone: user?.phone || '',
                    bio: user?.bio || ''
                  });
                  setEditModalOpen(true);
                }}
              >
                <Settings size={15} /> Edit Scholar Profile
              </button>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => setCurrentView('sell')}
              >
                <PlusCircle size={15} /> Scribe Studio
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2.2rem',
            gap: '1rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            style={{
              padding: '0.85rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'listings' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'listings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setActiveTab('listings')}
          >
            <BookOpen size={16} /> My Codex Volumes ({myListings.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.85rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'wishlist' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'wishlist' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={16} /> Saved Wishlist ({wishlistBooks.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.85rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'resources' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'resources' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setActiveTab('resources')}
          >
            <FileText size={16} /> Scriptorium Manuscripts ({myResources.length})
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
                <BookOpen size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
                <h3 className="font-display">No Monograms Inscribed Yet</h3>
                <p style={{ margin: '0.6rem auto 1.5rem', maxWidth: '440px', color: 'var(--text-secondary)' }}>
                  Got foundational textbooks from past terms? Pass them forward to university peers.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('sell')}>
                  Inscribe Your First Monograph
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.8rem'
                }}
              >
                {myListings.map((book) => (
                  <div key={book._id} className="book-card" style={{ overflow: 'hidden' }}>
                    <div className="book-card-image-wrap">
                      <img
                        src={book.coverImage || '/covers/cover_placeholder.jpg'}
                        alt={book.title}
                        className="book-card-image"
                      />
                      <div style={{ position: 'absolute', top: '12px', left: '16px', zIndex: 2 }}>
                        <span
                          className={`badge ${book.status === 'available' ? 'badge-new' : 'badge-poor'}`}
                        >
                          {book.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="book-card-body">
                      <div className="book-card-category">{book.category}</div>
                      <h3 className="book-card-title font-serif-literary" style={{ fontSize: '1.15rem' }}>
                        {book.title}
                      </h3>
                      <p className="book-card-author">by {book.author}</p>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          marginBottom: '0.8rem'
                        }}
                      >
                        ${book.price}
                      </div>

                      {/* Management Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          marginTop: 'auto',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '0.9rem'
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.8rem', borderRadius: '8px' }}
                          onClick={() => handleToggleStatus(book)}
                        >
                          {book.status === 'available' ? 'Mark as Sold' : 'Mark Available'}
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--accent-rose)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                          onClick={() => handleDeleteListing(book._id)}
                          title="Delete Listing"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistBooks.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
                <Heart size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
                <h3 className="font-display">Your Archival Wishlist is Empty</h3>
                <p style={{ margin: '0.6rem auto 1.5rem', maxWidth: '440px', color: 'var(--text-secondary)' }}>
                  Bookmark rare monographs or course texts across The Codex Exchange to track prices and
                  availability.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setCurrentView('marketplace')}
                >
                  Explore The Codex Exchange
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {wishlistBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onSelect={onSelectBook}
                    onInquire={onInquireBook}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Scriptorium Manuscripts */}
        {activeTab === 'resources' && (
          <div>
            {myResources.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
                <FileText size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
                <h3 className="font-display">No Scholarly Manuscripts Deposited Yet</h3>
                <p style={{ margin: '0.6rem auto 1.5rem', maxWidth: '440px', color: 'var(--text-secondary)' }}>
                  Share your high-yield exam summaries, syllabi digests, or solved problem compendiums
                  with fellow scholars in The Scriptorium.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('vault')}>
                  Deposit to Scriptorium
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.8rem'
                }}
              >
                {myResources.map((res) => (
                  <ResourceCard key={res._id} resource={res} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Modal */}
        {editModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 7, 12, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '540px',
                padding: '2.4rem',
                position: 'relative',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', top: '16px', right: '16px', padding: '0.4rem' }}
                onClick={() => setEditModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: '1.6rem' }}>
                <div className="badge badge-like-new" style={{ marginBottom: '0.4rem' }}>
                  SCHOLAR PASSPORT
                </div>
                <h2 className="font-display" style={{ fontSize: '1.8rem' }}>Update Academic Identity</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Manage your collegiate affiliation, degree department, and campus bio.
                </p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">University / Institution</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={profileForm.college}
                      onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Academic Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Faculty / Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Department of Physics & Astronomy"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Collegiate Bio & Interests</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Briefly state your research or study focus..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '2rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Scholar Passport
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
