import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, LogIn, UserPlus, GraduationCap, Mail, Lock, User, Building, BookOpen } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, demoLogin } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('Delhi Technological University');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('2nd Year');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, college, department, year });
      }
    } catch {
      // error handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (persona) => {
    setLoading(true);
    try {
      await demoLogin(persona);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px', padding: '2.2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(245, 158, 11, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '0.8rem'
            }}
          >
            <BookOpen size={28} color="#818cf8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>
            {tab === 'login' ? 'Welcome Back to LitHaven' : 'Join the Campus Network'}
          </h2>
          <p style={{ fontSize: '0.88rem' }}>
            {tab === 'login'
              ? 'Access your listings, saved books, and exchange offers'
              : 'Buy, sell, and exchange books with peers across top universities'}
          </p>
        </div>

        {/* Demo 1-Click Persona Bar */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1.4rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--primary-light)',
              marginBottom: '0.6rem'
            }}
          >
            <Sparkles size={14} /> Instant 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading}
              onClick={() => handleDemo('engineering')}
              style={{ fontSize: '0.78rem', padding: '0.45rem' }}
            >
              👩‍💻 Aanya (CS/Eng)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading}
              onClick={() => handleDemo('medical')}
              style={{ fontSize: '0.78rem', padding: '0.45rem' }}
            >
              🩺 Dr. Marcus (Med)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading}
              onClick={() => handleDemo('commerce')}
              style={{ fontSize: '0.78rem', padding: '0.45rem' }}
            >
              📊 Sophia (Finance)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading}
              onClick={() => handleDemo('hardware')}
              style={{ fontSize: '0.78rem', padding: '0.45rem' }}
            >
              ⚡ Rohan (BITS/Math)
            </button>
          </div>
        </div>

        {/* Tabs toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '999px',
            marginBottom: '1.4rem'
          }}
        >
          <button
            type="button"
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: tab === 'login' ? 'var(--primary)' : 'transparent',
              color: tab === 'login' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: tab === 'register' ? 'var(--primary)' : 'transparent',
              color: tab === 'register' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Maya Iyer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    className="form-input"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.6rem', padding: '0.85rem' }}
          >
            {loading ? (
              'Processing...'
            ) : tab === 'login' ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Join LitHaven
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
