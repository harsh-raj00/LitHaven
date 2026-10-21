import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookCard } from '../components/BookCard';
import { ResourceCard } from '../components/ResourceCard';
import { formatINR } from '../utils/formatters';
import {
  User,
  BookOpen,
  Heart,
  FileText,
  Star,
  Settings,
  Trash2,
  Edit3,
  PlusCircle,
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
    if (!window.confirm('Are you sure you want to remove this textbook listing?')) return;
    try {
      const res = await api.books.delete(bookId);
      if (res.success) {
        showToast('Textbook removed from marketplace', 'success');
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
        showToast(`Textbook marked as ${nextStatus}`, 'success');
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
      const data = await updateProfile(profileForm);
      if (data.success) {
        setEditModalOpen(false);
        showToast('Profile updated successfully', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Profile Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                }
                alt={user?.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    {user?.name}
                  </h1>
                  <span className="badge badge-new" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                    {user?.year}
                  </span>
                  <span className="eyebrow-tag">
                    VERIFIED CAMPUS MEMBER
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {user?.department} • <strong>{user?.college}</strong>
                </div>
                {user?.bio && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.4rem', maxWidth: '520px' }}>
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Star size={16} fill="currentColor" /> {user?.rating || '5.0'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user?.reviewCount || 0} reviews
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditModalOpen(true)}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            gap: '0.5rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            style={{
              padding: '0.65rem 1.1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'listings' ? '2px solid var(--accent-terracotta)' : '2px solid transparent',
              color: activeTab === 'listings' ? 'var(--accent-terracotta)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
            onClick={() => setActiveTab('listings')}
          >
            <BookOpen size={15} /> My Books ({myListings.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.65rem 1.1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'wishlist' ? '2px solid var(--accent-terracotta)' : '2px solid transparent',
              color: activeTab === 'wishlist' ? 'var(--accent-terracotta)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={15} /> Saved Books ({wishlistBooks.length})
          </button>

          <button
            type="button"
            style={{
              padding: '0.65rem 1.1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'resources' ? '2px solid var(--accent-terracotta)' : '2px solid transparent',
              color: activeTab === 'resources' ? 'var(--accent-terracotta)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
            onClick={() => setActiveTab('resources')}
          >
            <FileText size={15} /> My Shared Notes ({myResources.length})
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <BookOpen size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  You haven't listed any books yet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Have old books you don't need? Sell them to students on campus.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('sell')}>
                  <PlusCircle size={15} /> Sell a Book
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                  gap: '1.5rem'
                }}
              >
                {myListings.map((book) => (
                  <div key={book._id} className="book-card">
                    <div className="book-card-image-wrap">
                      <img
                        src={book.coverImage || '/covers/cover_placeholder.jpg'}
                        alt={book.title}
                        className="book-card-image"
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <span className={`badge ${book.status === 'available' ? 'badge-new' : 'badge-poor'}`}>
                          {book.status}
                        </span>
                      </div>
                    </div>

                    <div className="book-card-body">
                      <div className="book-card-category">{book.category}</div>
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">by {book.author}</p>
                      <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                        {formatINR(book.price)}
                      </div>

                      {/* Management Actions */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: 'auto',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '0.75rem'
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.8rem' }}
                          onClick={() => handleToggleStatus(book)}
                        >
                          {book.status === 'available' ? 'Mark as Sold' : 'Mark Available'}
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)', padding: '0.4rem' }}
                          onClick={() => handleDeleteListing(book._id)}
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
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
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Heart size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  No saved books yet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Tap the heart on any book to save it here for later.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => setCurrentView('marketplace')}>
                  Find Books
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                  gap: '1.5rem'
                }}
              >
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

        {/* Tab 3: My Uploaded Resources */}
        {activeTab === 'resources' && (
          <div>
            {myResources.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <FileText size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  You haven't uploaded any notes yet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Share study notes or solved papers to help other students.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('vault')}>
                  Go to Study Notes
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                  gap: '1.5rem'
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

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Edit Student Profile
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Keep your collegiate details accurate so buyers can identify you during campus meetups.
            </p>

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

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department / Major</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year</option>
                    <option>Postgrad</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Academic Interests</label>
                <textarea
                  rows={3}
                  placeholder="Share a short bio with campus buyers..."
                  className="form-input"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
