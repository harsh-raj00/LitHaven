import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { ResourceCard } from '../components/ResourceCard';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap,
  Users,
  DollarSign,
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const HomePage = ({ setCurrentView, onSelectBook, onInquireBook, setSearchQuery }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [stats, setStats] = useState({
    activeListings: 12,
    studyVaultResources: 6,
    registeredStudents: 4,
    totalStudentSavings: 1420,
    activeCampuses: 48
  });
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, resRes, statsRes] = await Promise.all([
          api.books.getFeatured(),
          api.resources.getAll({ limit: 3, sort: 'popular' }),
          api.stats.get()
        ]);

        if (booksRes.success) setFeaturedBooks(booksRes.books);
        if (resRes.success) setTopResources(resRes.resources);
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.warn('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setCurrentView('marketplace');
    }
  };

  const categories = [
    { name: 'Computer Science & AI', icon: '💻', count: '45+ books' },
    { name: 'Medical & Healthcare', icon: '🩺', count: '38+ books' },
    { name: 'Engineering & Technology', icon: '⚙️', count: '52+ books' },
    { name: 'Commerce, Finance & MBA', icon: '📊', count: '29+ books' },
    { name: 'Competitive Exams', icon: '🎯', count: '41+ books' },
    { name: 'Natural Sciences & Math', icon: '🔬', count: '34+ books' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="content-wrapper" style={{ textAlign: 'center' }}>
          <div className="hero-badge-tag">
            <Sparkles size={14} /> The Next-Generation Campus Knowledge Ecosystem
          </div>

          <h1 style={{ marginBottom: '1.2rem', maxWidth: '960px', margin: '0 auto 1.2rem' }}>
            Where University Students Buy, Sell & Share{' '}
            <span className="hero-title-highlight">Academic Wisdom</span>
          </h1>

          <p
            style={{
              fontSize: '1.18rem',
              maxWidth: '680px',
              margin: '0 auto 2.2rem',
              lineHeight: 1.6
            }}
          >
            Exchange verified course textbooks, access high-yield exam cheat sheets, and save up to
            70% with peer handovers across top universities.
          </p>

          {/* Search Box */}
          <form onSubmit={handleHeroSearch} className="hero-search-box" style={{ margin: '0 auto' }}>
            <Search size={20} color="var(--primary-light)" />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search by research monograph, author, discipline (e.g. Quantum Dynamics, Neural Architectures, Eleanor Vance)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Find Volumes
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginTop: '1.4rem'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Curated Curricula:</span>
            {['Quantum Dynamics', 'Neural Systems', 'Genomic Medicine', 'Deep Astrophysics', 'Quantitative Capital', 'Cybernetics', 'Algebraic Topology'].map(
              (term, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.2rem 0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSearchQuery(term);
                    setCurrentView('marketplace');
                  }}
                >
                  {term}
                </button>
              )
            )}
          </div>

          {/* Community Stats Banner */}
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-num">{stats.activeListings}+</span>
              <span className="stat-label">Active Academic Textbooks</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.studyVaultResources}+</span>
              <span className="stat-label">Scriptorium Compendiums & Notes</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">${stats.totalStudentSavings}+</span>
              <span className="stat-label">Total Student Money Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{stats.activeCampuses}</span>
              <span className="stat-label">Partner University Campuses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Categories Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="content-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.8rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2>Explore by Academic Discipline</h2>
              <p>Find textbooks prescribed by top university professors</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('marketplace')}
            >
              View All Categories <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.2rem'
            }}
          >
            {categories.map((cat, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '1.4rem 1.2rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => {
                  setSearchQuery(cat.name);
                  setCurrentView('marketplace');
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="content-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.8rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.3rem'
                }}
              >
                CURATED CAMPUS LISTINGS
              </div>
              <h2>High-Demand Textbooks</h2>
              <p>Verified copies currently available for direct campus handover</p>
            </div>

            <button className="btn btn-primary" onClick={() => setCurrentView('marketplace')}>
              Browse All Books <ArrowRight size={16} />
            </button>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onSelect={onSelectBook}
                onInquire={onInquireBook}
              />
            ))}
          </div>
        </div>
      </section>

      {/* StudyVault Highlight Section */}
      <section
        style={{
          padding: '4rem 0',
          background: 'linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)'
        }}
      >
        <div className="content-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span className="badge badge-like-new" style={{ marginBottom: '0.5rem' }}>
                <FileText size={13} /> THE SCRIPTORIUM
              </span>
              <h2>Free Notes, Cheat Sheets & Solved Papers</h2>
              <p>Download university notes curated and verified by senior scholars</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentView('vault')}>
              Explore Scriptorium <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {topResources.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        </div>
      </section>

      {/* Why LitHaven Features Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="content-wrapper">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2>Why Students Love LitHaven</h2>
            <p>Built specifically around the university academic lifecycle and student budgets</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.6rem'
            }}
          >
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '1.2rem'
                }}
              >
                <DollarSign size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>0% Platform Fees</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Keep 100% of what you earn. Unlike commercial bookstores and online resellers, LitHaven
                takes zero cut on student transactions.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                  marginBottom: '1.2rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Safe Campus Meetups</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Hand over books directly at your campus library, student union, or department quad.
                Inspect the book before exchanging!
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#06b6d4',
                  marginBottom: '1.2rem'
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Live Negotiation Chat</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Make instant counter-offers, agree on pickup spots, and message sellers in real-time
                with in-app conversation threads.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  marginBottom: '1.2rem'
                }}
              >
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Eco-Friendly & Circular</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Prevent hundreds of thousands of books from ending up in landfills. Reuse textbooks
                across consecutive academic batches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
