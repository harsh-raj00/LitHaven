import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Sparkles,
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
  const [theme, setTheme] = useState('dark');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNav = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div
          className="nav-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => handleNav('home')}
        >
          <div className="nav-brand-logo">
            <BookOpen size={22} />
          </div>
          <div>
            LitHaven
            <span
              style={{
                fontSize: '0.65rem',
                display: 'block',
                fontWeight: 600,
                color: 'var(--accent-gold)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '-4px'
              }}
            >
              Academic Sanctuary
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => handleNav('home')}
            >
              Discover
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'marketplace' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => handleNav('marketplace')}
            >
              <Search size={16} /> Codex Exchange
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'vault' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => handleNav('vault')}
            >
              <FileText size={16} /> The Scriptorium
            </button>
          </li>
          {isAuthenticated && (
            <li>
              <button
                className={`nav-link ${currentView === 'inquiries' ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => handleNav('inquiries')}
              >
                <MessageSquare size={16} /> Offers & Chats
              </button>
            </li>
          )}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Theme switch button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* List Book CTA */}
          <button
            className="btn btn-accent btn-sm"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                handleNav('sell');
              }
            }}
          >
            <PlusCircle size={16} /> List a Book
          </button>

          {/* User state */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <div
                className="user-nav-pill"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                  }
                  alt={user?.name}
                  className="user-avatar-small"
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '240px',
                    padding: '0.8rem',
                    borderRadius: '16px',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {user?.college}
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: '8px',
                      padding: '0.55rem 0.8rem',
                      fontSize: '0.88rem'
                    }}
                    onClick={() => handleNav('dashboard')}
                  >
                    <LayoutDashboard size={16} /> My Dashboard
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: '8px',
                      padding: '0.55rem 0.8rem',
                      fontSize: '0.88rem'
                    }}
                    onClick={() => handleNav('inquiries')}
                  >
                    <MessageSquare size={16} /> Inquiries & Offers
                  </button>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.4rem 0' }} />

                  <button
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: '8px',
                      padding: '0.55rem 0.8rem',
                      fontSize: '0.88rem',
                      color: 'var(--accent-rose)'
                    }}
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      handleNav('home');
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openAuthModal('login')}
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            className="btn btn-ghost btn-sm mobile-menu-btn"
            style={{ display: 'none', padding: '0.4rem' }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
