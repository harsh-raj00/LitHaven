import React, { useState } from 'react';
import { BookOpen, ArrowUp, X, ShieldCheck, FileText } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const handleNav = (view) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="footer site-footer">
        <div className="site-footer-top-rule" />

        <div className="content-wrapper">
          <div className="simple-footer-inner">
            {/* Brand & Mission Statement */}
            <div className="simple-footer-brand">
              <button
                type="button"
                className="footer-brand-lockup"
                onClick={() => handleNav('home')}
                aria-label="LitHaven Home"
              >
                <div className="footer-brand-icon">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="footer-brand-name">LitHaven</span>
                  <span className="footer-brand-tag">Campus Academic Exchange</span>
                </div>
              </button>
              <p className="simple-footer-tagline">
                LitHaven is built to support your academic journey. We’re building a space where students can connect, share knowledge, and grow together. By fostering collaboration and curiosity, we aim to make learning more engaging and impactful.
              </p>
            </div>

            {/* Simple Navigation Links */}
            <nav className="simple-footer-nav" aria-label="Footer Navigation">
              <button type="button" onClick={() => handleNav('home')}>
                Home
              </button>
              <button type="button" onClick={() => handleNav('marketplace')}>
                Find Books
              </button>
              <button type="button" onClick={() => handleNav('vault')}>
                Study Vault
              </button>
              <button type="button" onClick={() => handleNav('sell')}>
                Sell a Book
              </button>
              <button type="button" onClick={() => handleNav('dashboard')}>
                Dashboard
              </button>
            </nav>
          </div>

          {/* Bottom Bar: Copyright, Privacy, Terms, Back to Top */}
          <div className="simple-footer-bottom">
            <div className="simple-footer-bottom-left">
              <span>© {new Date().getFullYear()} LitHaven. All rights reserved.</span>
              <span className="footer-dot-sep">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveModal('privacy')}
              >
                Privacy Policy
              </button>
              <span className="footer-dot-sep">•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveModal('terms')}
              >
                Terms & Conditions
              </button>
            </div>

            {/* <button
              type="button"
              className="footer-back-to-top"
              onClick={scrollToTop}
              title="Return to top of page"
            >
              Back to Top <ArrowUp size={13} />
            </button> */}
          </div>
        </div>
      </footer>

      {/* Privacy & Terms Modals */}
      {activeModal && (
        <div
          className="modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '560px',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--accent-terracotta-bg)',
                    border: '1px solid var(--accent-terracotta-border)',
                    color: 'var(--accent-terracotta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {activeModal === 'privacy' ? <ShieldCheck size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0
                    }}
                  >
                    {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Last updated: {new Date().getFullYear()} • LitHaven Campus Exchange
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)'
              }}
            >
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    At LitHaven, we respect your privacy and are committed to safeguarding student data across all collegiate exchanges.
                  </p>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      1. Information We Collect
                    </strong>
                    We collect basic account credentials (name, student email, university) and textbook listing details to connect peers on campus.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      2. Zero Third-Party Advertising
                    </strong>
                    We never sell student personal information, reading history, or messaging logs to advertisers or third-party commercial brokers.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      3. Data Protection
                    </strong>
                    All passwords are salted and hashed with bcrypt. Student communication regarding book inquiries remains private between peers.
                  </div>
                </>
              ) : (
                <>
                  <p>
                    By using LitHaven, you agree to these peer-to-peer exchange terms designed to foster safe and fair campus transactions.
                  </p>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      1. Peer-to-Peer Transactions
                    </strong>
                    LitHaven facilitates direct connections between students. Buyers and sellers agree to meet in safe public campus areas (libraries, unions) during daylight.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      2. Accurate Condition Reporting
                    </strong>
                    Sellers must accurately describe book edition, highlighting, and binding condition. Buyers should inspect materials physically before paying.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      3. Zero Platform Fee
                    </strong>
                    LitHaven does not charge listing or transaction commissions. 100% of the agreed amount stays directly between students.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      4. Academic Integrity
                    </strong>
                    Materials uploaded to the Study Vault must consist of original lecture summaries and student notes; unauthorized distribution of copyrighted test keys is prohibited.
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                textAlign: 'right'
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveModal(null)}
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.84rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
