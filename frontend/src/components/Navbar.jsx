import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  PlusCircle,
  MessageSquare,
  FileText,
  User,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('lithaven_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) { }
    return 'light';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('lithaven_theme', theme);
    } catch (e) { }
  }, [theme]);

  // Close mobile drawer on desktop resize & handle Escape
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNav = (view) => {
    setCurrentView(view);
    window.location.hash = view;
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Brand */}
          <div
            className="nav-brand"
            onClick={() => handleNav('home')}
          >
            <div className="nav-brand-logo">
              <BookOpen size={18} />
            </div>
            <span className="nav-brand-title">LitHaven</span>
          </div>

          {/* Desktop Links (Pill Dock) */}
          <ul className="nav-links">
            <li>
              <button
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'marketplace' ? 'active' : ''}`}
                onClick={() => handleNav('marketplace')}
              >
                <Search size={14} /> Find Books
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'vault' ? 'active' : ''}`}
                onClick={() => handleNav('vault')}
              >
                <FileText size={14} /> Study Vault
              </button>
            </li>
            {isAuthenticated && (
              <li>
                <button
                  className={`nav-link ${currentView === 'inquiries' ? 'active' : ''}`}
                  onClick={() => handleNav('inquiries')}
                >
                  <MessageSquare size={14} /> Messages
                </button>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Quick Search Shortcut (Desktop) */}
            <button
              type="button"
              onClick={() => handleNav('marketplace')}
              className="navbar-search-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              title="Search Books (⌘K)"
            >
              <Search size={13} />
              <span style={{ fontSize: '0.78rem' }}>Search</span>
              <kbd
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '3px',
                  padding: '0.08rem 0.35rem',
                  color: 'var(--text-secondary)'
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Theme switch button */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: 'var(--radius-sm)' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Desktop "Sell a Book" CTA (hidden on mobile, provided by mobile dock & drawer) */}
            <button
              className="btn btn-accent btn-sm nav-cta-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                } else {
                  handleNav('sell');
                }
              }}
            >
              <PlusCircle size={15} /> Sell a Book
            </button>

            {/* User state */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <div
                  className="user-nav-pill"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  title={user?.name}
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                    }
                    alt={user?.name}
                    className="user-avatar-small"
                  />
                  <span className="user-nav-name" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>

                {/* Desktop User Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      zIndex: 200,
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        marginBottom: '0.35rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {user?.college}
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => handleNav('dashboard')}
                    >
                      <LayoutDashboard size={15} /> My Profile
                    </button>

                    <button
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => handleNav('inquiries')}
                    >
                      <MessageSquare size={15} /> Messages
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.35rem 0' }} />

                    <button
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.85rem',
                        color: 'var(--danger)'
                      }}
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        handleNav('home');
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-secondary btn-sm nav-signin-btn"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer Panel */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-panel">
            {/* User Quick Info or Guest Banner */}
            {isAuthenticated ? (
              <div className="mobile-user-card" onClick={() => handleNav('dashboard')}>
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                  }
                  alt={user?.name}
                  className="mobile-user-avatar"
                />
                <div className="mobile-user-meta">
                  <div className="mobile-user-name">{user?.name}</div>
                  <div className="mobile-user-college">{user?.college || 'Verified Campus Scholar'}</div>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-banner">
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Welcome to LitHaven
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Peer-to-peer textbook marketplace  .
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                >
                  Sign In or Register
                </button>
              </div>
            )}

            {/* Mobile Search Quick Trigger */}
            <div
              className="mobile-search-trigger"
              onClick={() => handleNav('marketplace')}
            >
              <Search size={16} />
              <span>Search 1,200+ textbooks & notes...</span>
            </div>

            {/* Navigation Links */}
            <div className="mobile-drawer-nav">
              <button
                className={`mobile-drawer-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                <BookOpen size={18} />
                <span>Home</span>
              </button>

              <button
                className={`mobile-drawer-link ${currentView === 'marketplace' ? 'active' : ''}`}
                onClick={() => handleNav('marketplace')}
              >
                <Search size={18} />
                <span>Find Books & Textbooks</span>
              </button>

              <button
                className={`mobile-drawer-link ${currentView === 'vault' ? 'active' : ''}`}
                onClick={() => handleNav('vault')}
              >
                <FileText size={18} />
                <span>Study Vault & PDFs</span>
              </button>

              <button
                className={`mobile-drawer-link mobile-sell-link ${currentView === 'sell' ? 'active' : ''}`}
                onClick={() => {
                  if (!isAuthenticated) openAuthModal('login');
                  else handleNav('sell');
                }}
              >
                <PlusCircle size={18} />
                <span>List a Book for Sale</span>
                <span className="badge badge-accent" style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                  Zero Fee
                </span>
              </button>

              {isAuthenticated && (
                <>
                  <button
                    className={`mobile-drawer-link ${currentView === 'inquiries' ? 'active' : ''}`}
                    onClick={() => handleNav('inquiries')}
                  >
                    <MessageSquare size={18} />
                    <span>Messages & Chats</span>
                  </button>

                  <button
                    className={`mobile-drawer-link ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleNav('dashboard')}
                  >
                    <LayoutDashboard size={18} />
                    <span>My Profile & Wishlist</span>
                  </button>
                </>
              )}
            </div>

            {/* Theme Toggle & Status Footer in Drawer */}
            <div className="mobile-drawer-footer">
              <button
                className="mobile-theme-row"
                onClick={toggleTheme}
                type="button"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {isAuthenticated && (
                <button
                  className="mobile-signout-btn"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('home');
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}

      </nav>

      {/* Mobile Floating Bottom Dock */}
      <div className="mobile-bottom-dock">
        <button
          className={`mobile-dock-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => handleNav('home')}
          aria-label="Home"
        >
          <BookOpen size={19} />
          <span>Home</span>
        </button>

        <button
          className={`mobile-dock-btn ${currentView === 'marketplace' ? 'active' : ''}`}
          onClick={() => handleNav('marketplace')}
          aria-label="Books"
        >
          <Search size={19} />
          <span>Books</span>
        </button>

        <button
          className={`mobile-dock-btn mobile-dock-sell-btn ${currentView === 'sell' ? 'active' : ''}`}
          onClick={() => {
            if (!isAuthenticated) openAuthModal('login');
            else handleNav('sell');
          }}
          title="Sell a Book"
          aria-label="Sell a Book"
        >
          <PlusCircle size={22} />
        </button>

        <button
          className={`mobile-dock-btn ${currentView === 'vault' ? 'active' : ''}`}
          onClick={() => handleNav('vault')}
          aria-label="Study Vault"
        >
          <FileText size={19} />
          <span>Vault</span>
        </button>

        <button
          className={`mobile-dock-btn ${currentView === 'dashboard' || currentView === 'inquiries' ? 'active' : ''}`}
          onClick={() => {
            if (!isAuthenticated) openAuthModal('login');
            else handleNav('dashboard');
          }}
          aria-label={isAuthenticated ? 'Profile' : 'Sign In'}
        >
          <User size={19} />
          <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </>
  );
};
