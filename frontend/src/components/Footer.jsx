import React from 'react';
import { BookOpen, Heart, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '5rem',
        padding: '4rem 0 2.5rem'
      }}
    >
      <div className="content-wrapper">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div
                className="nav-brand-logo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d97706, #92400e)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={20} color="#fff" />
              </div>
              <div>
                <span className="font-serif-literary" style={{ fontSize: '1.55rem', fontWeight: 700, letterSpacing: '0.02em', color: '#fff', display: 'block', lineHeight: 1.1 }}>
                  LitHaven
                </span>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Archival Academic Exchange
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.3rem', color: 'var(--text-secondary)' }}>
              The verified collegiate peer-to-peer exchange and academic compendium sanctuary. Eliminating textbook inflation while anchoring sustainable circular scholarship across university communities.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-good" style={{ textTransform: 'none', background: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent-gold)', borderColor: 'rgba(217, 119, 6, 0.25)' }}>
                <ShieldCheck size={13} /> 100% Peer Verified
              </span>
              <span className="badge badge-like-new" style={{ textTransform: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                <Zap size={13} /> Zero Commission
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
              Explore LitHaven
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li>
                <a
                  href="#marketplace"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('marketplace');
                  }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  Codex Exchange
                </a>
              </li>
              <li>
                <a
                  href="#vault"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('vault');
                  }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  The Scriptorium & Compendiums
                </a>
              </li>
              <li>
                <a
                  href="#sell"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('sell');
                  }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  List a Book for Sale
                </a>
              </li>
              <li>
                <a
                  href="#dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('dashboard');
                  }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  Student Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
              Top Disciplines
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Computer Science & AI
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Medical & Clinical Sciences
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Core Engineering (Mech, ECE, Civil)
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Commerce, Finance & MBA
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Competitive Exams (CAT, GATE, GRE)
              </li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
              MERN Stack Architecture
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.9rem' }}>
              Engineered with MongoDB database indexing, Express.js REST API with JWT security, React with dynamic state management, and Node.js asynchronous runtime.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="badge badge-category">MongoDB 8.x</span>
              <span className="badge badge-category">Express.js</span>
              <span className="badge badge-category">React 19</span>
              <span className="badge badge-category">Node.js 24</span>
              <span className="badge badge-category">JWT Auth</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} LitHaven. Built with academic excellence for college campuses worldwide.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Empowering students to share knowledge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
