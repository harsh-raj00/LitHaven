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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div className="nav-brand-logo" style={{ width: '34px', height: '34px' }}>
                <BookOpen size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
                LitHaven
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              The verified peer-to-peer campus book exchange and academic study sanctuary. Saving students thousands on textbooks while creating sustainable, circular campus economies.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-good" style={{ textTransform: 'none' }}>
                <ShieldCheck size={13} /> 100% Peer Verified
              </span>
              <span className="badge badge-like-new" style={{ textTransform: 'none' }}>
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
