import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Building,
  GraduationCap,
  Sparkles,
  LogIn,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export const AuthPage = ({ initialTab = 'login', setCurrentView }) => {
  const { login, register, demoLogin, isAuthenticated } = useAuth();
  const [tab, setTab] = useState(initialTab === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2nd Year');

  // If already authenticated, redirect to dashboard or marketplace
  useEffect(() => {
    if (isAuthenticated && setCurrentView) {
      setCurrentView('dashboard');
      window.location.hash = 'dashboard';
    }
  }, [isAuthenticated, setCurrentView]);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab === 'register' ? 'register' : 'login');
    }
  }, [initialTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, college, department, year });
      }
      if (setCurrentView) {
        setCurrentView('dashboard');
        window.location.hash = 'dashboard';
      }
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (persona) => {
    setLoading(true);
    try {
      await demoLogin(persona);
      if (setCurrentView) {
        setCurrentView('dashboard');
        window.location.hash = 'dashboard';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="content-wrapper">
        <div className="auth-split-grid">
          {/* Left Column: Academic Atelier Showcase */}
          <div className="auth-showcase-card">
            <div className="auth-showcase-badge">
              <Sparkles size={14} color="var(--accent-terracotta)" />
              <span>COLLEGIATE SCHOLARS CONSORTIUM</span>
            </div>

            <h1 className="font-serif-literary auth-showcase-title">
              Where Campus Knowledge Finds Its Next Inscription.
            </h1>

            <p className="auth-showcase-subtitle">
              LitHaven connects university scholars to buy, sell, and share essential textbooks and study notes .
            </p>

            {/* Value Pillars */}
            <div className="auth-pillars-list">
              <div className="auth-pillar-item">
                <div className="auth-pillar-icon">
                  <ShieldCheck size={18} color="var(--savings-green)" />
                </div>
                <div>
                  <h4 className="auth-pillar-heading">Direct Quad Handover</h4>
                  <p className="auth-pillar-text">
                    Zero transit wait times. Inspect physical binding and notes in person at your campus central quad or library.
                  </p>
                </div>
              </div>

              <div className="auth-pillar-item">
                <div className="auth-pillar-icon">
                  <Award size={18} color="var(--accent-terracotta)" />
                </div>
                <div>
                  <h4 className="auth-pillar-heading">Zero Middleman Commissions</h4>
                  <p className="auth-pillar-text">
                    Keep 100% of your book value. Peer pricing saves undergraduates up to 70% off retail textbook list prices.
                  </p>
                </div>
              </div>

              <div className="auth-pillar-item">
                <div className="auth-pillar-icon">
                  <CheckCircle size={18} color="var(--savings-green)" />
                </div>
                <div>
                  <h4 className="auth-pillar-heading">Peer-Verified Study Guides</h4>
                  <p className="auth-pillar-text">
                    Access topper handwritten lecture capsules, formula sheets, and solved question banks in the Study Vault.
                  </p>
                </div>
              </div>
            </div>

            {/* Campus Metrics Strip */}
            <div className="auth-stats-strip">
              <div className="auth-stat-col">
                <span className="font-mono auth-stat-val">₹4.8L+</span>
                <span className="auth-stat-lbl">Student Savings</span>
              </div>
              <div className="auth-stat-sep" />
              <div className="auth-stat-col">
                <span className="font-mono auth-stat-val">1,200+</span>
                <span className="auth-stat-lbl">Active Folios</span>
              </div>
              <div className="auth-stat-sep" />
              <div className="auth-stat-col">
                <span className="font-mono auth-stat-val">48+</span>
                <span className="auth-stat-lbl">Collegiate Hubs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="auth-form-card">
            {/* Brand Header */}
            <div className="auth-form-header">
              <div className="auth-brand-logo">
                <BookOpen size={24} color="var(--accent-terracotta)" />
              </div>
              <span className="auth-form-eyebrow">LITHAVEN CAMPUS REGISTRY</span>
              <h2 className="font-serif-literary auth-form-title">
                {tab === 'login' ? 'Scholar Authentication' : 'Establish Academic Identity'}
              </h2>
              <p className="auth-form-desc">
                {tab === 'login'
                  ? 'Sign in to access your registered textbooks, active handovers, and study vault.'
                  : 'Join fellow scholars across Indian and global collegiate networks.'}
              </p>
            </div>

            {/* Quick 1-Click Demo Persona Bar (Commented out per request)
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
                  title="Login as Aanya Sharma (CS & AI, DTU)"
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
                  title="Login as Dr. Marcus Vance (Genomic Medicine, AIIMS)"
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
                  title="Login as Sophia Chen (Finance, Oxford/IIM)"
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
                  title="Login as Rohan Deshmukh (Robotics, BITS Pilani)"
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

            {/* Tabs Toggle */}
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

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="auth-main-form">
              {tab === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Legal or Preferred Name *</label>
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
                          <option value="Postgraduate">Postgraduate / Scholar</option>
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
                <label className="form-label">Collegiate or Personal Email *</label>
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

              {/* Password */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Secret Passphrase *</label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => handleDemo('engineering')}
                    >
                      Use Demo Account?
                    </button>
                  )}
                </div>
                <div className="form-input-icon-wrap">
                  <Lock size={16} className="form-leading-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="form-input form-input-with-icon"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="At least 6 characters"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  'Verifying Credentials...'
                ) : tab === 'login' ? (
                  <>
                    <LogIn size={18} /> Inscribe & Enter Stacks
                  </>
                ) : (
                  <>
                    <UserPlus size={18} /> Register Collegiate Identity
                  </>
                )}
              </button>
            </form>

            {/* Honor Code footer */}
            <div className="auth-footer-honor">
              <ShieldCheck size={14} color="var(--savings-green)" />
              <span>
                Protected under LitHaven’s Academic Honor Code & Zero-Commission Charter.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
