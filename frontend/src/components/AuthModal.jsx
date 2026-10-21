import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Sparkles,
  LogIn,
  UserPlus,
  GraduationCap,
  Mail,
  Lock,
  User,
  Building,
  BookOpen,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

export const AuthModal = ({ setCurrentView }) => {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, demoLogin } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2nd Year');

  // Synchronize tab when opened via openAuthModal('register' | 'login')
  useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
    }
  }, [authModalTab]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

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
      closeAuthModal();
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
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="modal-content auth-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Close Authentication Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-icon-badge">
            <BookOpen size={24} color="var(--accent-terracotta)" />
          </div>
          <span className="auth-form-eyebrow">ACADEMIC CONSORTIUM PORTAL</span>
          <h2 id="auth-modal-title" className="font-serif-literary auth-modal-title">
            {tab === 'login' ? 'Scholar Authentication' : 'Establish Academic Identity'}
          </h2>
          <p className="auth-modal-desc">
            {tab === 'login'
              ? 'Access your collegiate registry, active covenants, and reserved folios.'
              : 'Join a cross-university guild of verified scholars exchanging knowledge.'}
          </p>
        </div>

        {/* Immediate Fellowship Pass Demo Personas (Commented out per request)
        <div className="auth-demo-box">
          <div className="auth-demo-header">
            <span className="auth-demo-tag">
              <Sparkles size={13} color="var(--accent-terracotta)" />
              <span>Immediate Fellowship Pass</span>
            </span>
            <span className="auth-demo-hint">1-Click Fast Access</span>
          </div>

          <div className="auth-demo-grid">
            <button
              type="button"
              className="auth-demo-btn"
              disabled={loading}
              onClick={() => handleDemo('engineering')}
              title="Aanya Sharma • CS & AI, DTU"
            >
              <span className="auth-demo-emoji">👩‍💻</span>
              <div className="auth-demo-meta">
                <strong>Aanya</strong>
                <span>CS & AI • DTU</span>
              </div>
            </button>

            <button
              type="button"
              className="auth-demo-btn"
              disabled={loading}
              onClick={() => handleDemo('medical')}
              title="Dr. Marcus Vance • Genomics, AIIMS"
            >
              <span className="auth-demo-emoji">🩺</span>
              <div className="auth-demo-meta">
                <strong>Dr. Marcus</strong>
                <span>Genomics • AIIMS</span>
              </div>
            </button>

            <button
              type="button"
              className="auth-demo-btn"
              disabled={loading}
              onClick={() => handleDemo('commerce')}
              title="Sophia Chen • Finance, Oxford"
            >
              <span className="auth-demo-emoji">📊</span>
              <div className="auth-demo-meta">
                <strong>Sophia</strong>
                <span>Finance • Oxford</span>
              </div>
            </button>

            <button
              type="button"
              className="auth-demo-btn"
              disabled={loading}
              onClick={() => handleDemo('hardware')}
              title="Rohan Deshmukh • Robotics, BITS"
            >
              <span className="auth-demo-emoji">⚡</span>
              <div className="auth-demo-meta">
                <strong>Rohan</strong>
                <span>Robotics • BITS</span>
              </div>
            </button>
          </div>
        </div>
        */}

        {/* High-Contrast Visible Tabs Toggle */}
        <div className="auth-tabs-toggle">
          <button
            type="button"
            className={`auth-tab-pill ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-pill ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="auth-main-form">
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="form-input-icon-wrap">
                  <User size={16} className="form-leading-icon" />
                  <input
                    type="text"
                    required
                    className="form-input form-input-with-icon"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-dual-grid">
                <div className="form-group">
                  <label className="form-label">Collegiate Institute *</label>
                  <div className="form-input-icon-wrap">
                    <Building size={16} className="form-leading-icon" />
                    <input
                      type="text"
                      required
                      className="form-input form-input-with-icon"
                      placeholder="e.g. Delhi Technological University"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year *</label>
                  <div className="form-input-icon-wrap">
                    <GraduationCap size={16} className="form-leading-icon" />
                    <select
                      className="form-select form-input-with-icon"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="Final Year">Final Year (Senior)</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Department *</label>
                <div className="form-input-icon-wrap">
                  <BookOpen size={16} className="form-leading-icon" />
                  <input
                    type="text"
                    required
                    className="form-input form-input-with-icon"
                    placeholder="e.g. Computer Science & Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="form-input-icon-wrap">
              <Mail size={16} className="form-leading-icon" />
              <input
                type="email"
                required
                className="form-input form-input-with-icon"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password with Eye Toggle */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="form-input-icon-wrap">
              <Lock size={16} className="form-leading-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="form-input form-input-with-icon"
                style={{ paddingRight: '2.5rem' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="form-trailing-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              'Verifying Credentials...'
            ) : tab === 'login' ? (
              <>
                <LogIn size={17} /> Inscribe & Enter Stacks
              </>
            ) : (
              <>
                <UserPlus size={17} /> Register Collegiate Identity
              </>
            )}
          </button>
        </form>

        {/* Modal Footer Assurance */}
        <div className="auth-footer-honor">
          <ShieldCheck size={14} color="var(--savings-green)" />
          <span>Protected under LitHaven’s Academic Honor Code & Zero-Fee Charter.</span>
        </div>
      </div>
    </div>
  );
};
