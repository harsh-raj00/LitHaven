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
  X
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
    if (!window.confirm('Are you sure you want to remove this book listing?')) return;
    try {
      const res = await api.books.delete(bookId);
      if (res.success) {
        showToast('Listing removed successfully', 'success');
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
        showToast(`Book marked as ${nextStatus}`, 'success');
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

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Profile Card Header */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem 2.4rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'Student')}`
              }
              alt={user?.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>{user?.name}</h1>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <Star size={16} fill="currentColor" /> {user?.rating || '5.0'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                {user?.college} • {user?.department} ({user?.year})
              </div>
              <p style={{ fontSize: '0.86rem', marginTop: '0.4rem', maxWidth: '540px' }}>
                {user?.bio || 'Campus student active on LitHaven'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
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
              <Settings size={15} /> Edit Profile
            </button>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setCurrentView('sell')}
            >
              <PlusCircle size={15} /> List New Book
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            gap: '1rem'
          }}
        >
          <button
            type="button"
            style={{
              padding: '0.8rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'listings' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'listings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setActiveTab('listings')}
          >
            <BookOpen size={16} /> My Book Listings ({myListings.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.8rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'wishlist' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'wishlist' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={16} /> Saved Wishlist ({wishlistBooks.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.8rem 1.4rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'resources' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'resources' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
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
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <BookOpen size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>You haven't listed any books yet</h3>
                <p style={{ margin: '0.6rem auto 1.4rem', maxWidth: '400px' }}>
                  Got past semester textbooks gathering dust on your shelf? Pass them forward to
                  students!
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('sell')}>
                  List Your First Book
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.6rem'
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
                      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                        <span
                          className={`badge ${book.status === 'available' ? 'badge-new' : 'badge-poor'}`}
                        >
                          {book.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="book-card-body">
                      <div className="book-card-category">{book.category}</div>
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">by {book.author}</p>
                      <div
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
                          gap: '0.5rem',
                          marginTop: 'auto',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '0.8rem'
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.78rem' }}
                          onClick={() => handleToggleStatus(book)}
                        >
                          {book.status === 'available' ? 'Mark as Sold' : 'Mark Available'}
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--accent-rose)' }}
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
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Heart size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>Your Wishlist is Empty</h3>
                <p style={{ margin: '0.6rem auto 1.4rem', maxWidth: '400px' }}>
                  Click the heart icon on any book in the marketplace to save it here for later.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setCurrentView('marketplace')}
                >
                  Explore Marketplace
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
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <FileText size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>No Scholarly Manuscripts Deposited Yet</h3>
                <p style={{ margin: '0.6rem auto 1.4rem', maxWidth: '400px' }}>
                  Share your high-yield exam summaries, syllabi digests, or solved problem compendiums
                  with fellow scholars.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('vault')}>
                  Explore The Scriptorium
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.6rem'
                }}
              >
                {myResources.map((res) => (
                  <ResourceCard key={res._id} resource={res} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '520px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setEditModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Edit Student Profile</h2>

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

              <div className="form-group">
                <label className="form-label">University / College</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Department / Major</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.department}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, department: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91..."
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.6rem', padding: '0.75rem' }}
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
