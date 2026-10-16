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
  MapPin,
  CheckCircle2,
  Award,
  BookMarked,
  Eye,
  MessageSquare
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
  const [activeTab, setActiveTab] = useState('all');
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

  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    setCurrentView('marketplace');
  };

  // Spotlit book for Curator's Editorial Feature
  const spotlightBook = featuredBooks[0] || {
    _id: 'spotlight-1',
    title: 'Principles of Neural Science (Sixth Edition)',
    author: 'Eric R. Kandel, John D. Koester, Sarah H. Mack',
    price: 48,
    originalPrice: 135,
    condition: 'Like New',
    category: 'Medical & Healthcare',
    coverImage: '/covers/cover_neural.jpg',
    description: 'The definitive monograph on cellular neurobiology, cognitive neuroscience, and neural circuitry. Pristine hardback edition with zero margin markings and pristine color plates.',
    campusMeetingSpot: 'North Campus Medical Quad (Lane Library)'
  };

  // Filter books by tab
  const displayedBooks = featuredBooks.filter((book) => {
    if (activeTab === 'stem') return ['Computer Science & AI', 'Engineering & Technology', 'Natural Sciences & Math'].includes(book.category);
    if (activeTab === 'savings') return book.originalPrice && (book.originalPrice - book.price) > 40;
    return true;
  });

  return (
    <div>
      {/* Live Campus Exchange Ticker */}
      <div className="campus-ticker-wrap">
        <div className="campus-ticker-content">
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>Cambridge Cavendish Lab:</strong> Advanced Quantum Dynamics handed over 6m ago
          </span>
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>MIT Stata Center:</strong> Neural Systems & Deep Learning reserved by Marcus
          </span>
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>Stanford Green Library:</strong> Molecular Genetics & Biology of Cell picked up ($65 saved)
          </span>
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>Berkeley Evans Hall:</strong> Algebraic Topology & Manifolds exchanged at Quad
          </span>
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>Oxford Bodleian:</strong> Jurisprudence & Philosophy of Law handed over in person
          </span>
          {/* Loop items for continuous ticker */}
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>Cambridge Cavendish Lab:</strong> Advanced Quantum Dynamics handed over 6m ago
          </span>
          <span className="ticker-item">
            <span className="pulse-dot"></span>
            <strong>MIT Stata Center:</strong> Neural Systems & Deep Learning reserved by Marcus
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '4.5rem 0 3.5rem' }}>
        <div className="content-wrapper" style={{ textAlign: 'center' }}>
          <div className="hero-badge-tag" style={{ marginBottom: '1.2rem' }}>
            <Sparkles size={14} color="var(--accent-gold)" /> The Collegiate Literary Sanctuary & Peer Exchange
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              marginBottom: '1.4rem',
              maxWidth: '980px',
              margin: '0 auto 1.4rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.18
            }}
          >
            Where Academic Monograms & Treatises Pass From{' '}
            <span className="hero-title-highlight" style={{ fontStyle: 'italic' }}>
              Scholar to Scholar
            </span>
          </h1>

          <p
            className="font-serif-literary"
            style={{
              fontSize: '1.35rem',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)'
            }}
          >
            A curated peer sanctuary for verified textbooks, foundational research monographs, and
            open-access manuscripts across premier university faculties. Zero commercial markups.
          </p>

          {/* Search Box */}
          <form onSubmit={handleHeroSearch} className="hero-search-box" style={{ margin: '0 auto', maxWidth: '780px' }}>
            <Search size={22} color="var(--accent-gold)" />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search treatises by discipline, author, or title (e.g. Quantum Dynamics, Eleanor Vance, CS 204)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              Search Codex
            </button>
          </form>

          {/* Curated Curricula Filter Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginTop: '1.6rem'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              POPULAR FACULTIES:
            </span>
            {['Quantum Dynamics', 'Neural Systems', 'Genomic Medicine', 'Quantitative Capital', 'Cybernetics', 'Algebraic Topology'].map(
              (term, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.85rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
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
          <div className="stats-banner" style={{ marginTop: '3.5rem' }}>
            <div className="stat-item">
              <span className="stat-num font-mono">{stats.activeListings}+</span>
              <span className="stat-label">Verified Codex Volumes</span>
            </div>
            <div className="stat-item">
              <span className="stat-num font-mono">{stats.studyVaultResources || stats.scriptoriumResources || 6}+</span>
              <span className="stat-label">Scriptorium Manuscripts</span>
            </div>
            <div className="stat-item">
              <span className="stat-num font-mono">${stats.totalStudentSavings}+</span>
              <span className="stat-label">Student Capital Preserved</span>
            </div>
            <div className="stat-item">
              <span className="stat-num font-mono">{stats.activeCampuses}</span>
              <span className="stat-label">Collegiate Exchange Quads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Spotlight: Curator's Featured Volume */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="content-wrapper">
          <div style={{ marginBottom: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-like-new" style={{ marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                <Award size={13} /> CURATOR'S MONOGRAPH SELECTION
              </span>
              <h2 className="font-display" style={{ fontSize: '1.8rem' }}>Exemplary Collegiate Acquisition</h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Physical Provenance</span>
          </div>

          <div className="curator-spotlight">
            <div className="book-ribbon" title="Curator's Choice"></div>

            {/* Left: 3D Hardcover Mockup */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '230px',
                  borderRadius: '6px 12px 12px 6px',
                  boxShadow: 'var(--shadow-book)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: 'perspective(900px) rotateY(-8deg)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(900px) rotateY(0deg) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(900px) rotateY(-8deg)';
                }}
                onClick={() => onSelectBook(spotlightBook)}
              >
                {/* 3D Spine simulated lighting */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '24px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                />
                <img
                  src={spotlightBook.coverImage || '/covers/cover_neural.jpg'}
                  alt={spotlightBook.title}
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Right: Curatorial Backstory & Action */}
            <div>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge badge-like-new">{spotlightBook.condition}</span>
                <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)' }}>
                  ORIGINAL HARDCOVER
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="var(--accent-gold)" /> {spotlightBook.campusMeetingSpot}
                </span>
              </div>

              <h3 className="font-serif-literary" style={{ fontSize: '1.9rem', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                {spotlightBook.title}
              </h3>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginBottom: '1.1rem', fontWeight: 600 }}>
                by {spotlightBook.author}
              </p>

              <p style={{ fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.6rem', maxWidth: '640px' }}>
                {spotlightBook.description}
              </p>

              {/* Price & Action row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                  <span className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ${spotlightBook.price}
                  </span>
                  {spotlightBook.originalPrice && (
                    <span className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${spotlightBook.originalPrice}
                    </span>
                  )}
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--accent-emerald)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    SAVE ${(spotlightBook.originalPrice || 135) - spotlightBook.price} (64%)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectBook(spotlightBook)}
                    style={{ padding: '0.65rem 1.4rem' }}
                  >
                    <Eye size={16} /> Inspect Volume
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={() => onInquireBook(spotlightBook)}
                    style={{ padding: '0.65rem 1.4rem' }}
                  >
                    <MessageSquare size={16} /> Propose Handover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Disciplines Bento Grid */}
      <section style={{ padding: '3rem 0 4rem' }}>
        <div className="content-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-like-new" style={{ marginBottom: '0.4rem' }}>
                FACULTIES OF LEARNING
              </span>
              <h2 className="font-display" style={{ fontSize: '2rem' }}>Curated Scholarly Disciplines</h2>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setCurrentView('marketplace')}
              style={{ color: 'var(--accent-gold)' }}
            >
              All Disciplines <ArrowRight size={16} />
            </button>
          </div>

          <div className="bento-grid">
            <div
              className="bento-card bento-col-4"
              onClick={() => handleCategoryClick('Computer Science & AI')}
              style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, var(--bg-card) 100%)' }}
            >
              <div>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.8rem' }}>🧠</span>
                <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  Theoretical Computer Science & AI
                </h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Neural networks, distributed architectures, automata theory, and quantum algorithms.
                </p>
              </div>
              <div style={{ marginTop: '1.4rem', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                45+ Curated Volumes →
              </div>
            </div>

            <div
              className="bento-card bento-col-4"
              onClick={() => handleCategoryClick('Natural Sciences & Math')}
              style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, var(--bg-card) 100%)' }}
            >
              <div>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.8rem' }}>🔬</span>
                <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  Quantum Mechanics & Physics
                </h3>
                <p style={{ fontSize: '0.88rem' }}>
                  General relativity, quantum electrodynamics, condensed matter, and astrophysics.
                </p>
              </div>
              <div style={{ marginTop: '1.4rem', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                38+ Curated Volumes →
              </div>
            </div>

            <div
              className="bento-card bento-col-4"
              onClick={() => handleCategoryClick('Medical & Healthcare')}
              style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, var(--bg-card) 100%)' }}
            >
              <div>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.8rem' }}>🧬</span>
                <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  Genomic Medicine & Neurobiology
                </h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Cellular pathology, neuroanatomy, pharmacology, and clinical diagnostic atlases.
                </p>
              </div>
              <div style={{ marginTop: '1.4rem', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                34+ Curated Volumes →
              </div>
            </div>

            <div
              className="bento-card bento-col-6"
              onClick={() => handleCategoryClick('Commerce, Finance & MBA')}
              style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--bg-card) 100%)' }}
            >
              <div>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.8rem' }}>⚖️</span>
                <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  Quantitative Capital & Political Economy
                </h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Asset pricing models, macroeconomic equilibrium, and algorithmic trade mechanics.
                </p>
              </div>
              <div style={{ marginTop: '1.4rem', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                29+ Curated Volumes →
              </div>
            </div>

            <div
              className="bento-card bento-col-6"
              onClick={() => handleCategoryClick('Engineering & Technology')}
              style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, var(--bg-card) 100%)' }}
            >
              <div>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.8rem' }}>📐</span>
                <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  Pure Mathematics & Algebraic Topology
                </h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Differential geometry, Galois theory, complex analysis, and topological manifolds.
                </p>
              </div>
              <div style={{ marginTop: '1.4rem', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                41+ Curated Volumes →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Codex Exchange Showcase */}
      <section style={{ padding: '3rem 0 4rem' }}>
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
              <span className="badge badge-like-new" style={{ marginBottom: '0.4rem' }}>
                THE CODEX EXCHANGE
              </span>
              <h2 className="font-display" style={{ fontSize: '2rem' }}>Featured Academic Acquisitions</h2>
              <p>Physical monographs ready for campus handover today</p>
            </div>

            {/* Filter Tabs */}
            <div className="view-switcher">
              <button
                className={`view-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Volumes
              </button>
              <button
                className={`view-btn ${activeTab === 'stem' ? 'active' : ''}`}
                onClick={() => setActiveTab('stem')}
              >
                STEM Foundational
              </button>
              <button
                className={`view-btn ${activeTab === 'savings' ? 'active' : ''}`}
                onClick={() => setActiveTab('savings')}
              >
                High-Yield Savings
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.8rem'
            }}
          >
            {displayedBooks.slice(0, 8).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onSelect={onSelectBook}
                onInquire={onInquireBook}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setCurrentView('marketplace')}
              style={{ padding: '0.85rem 2.2rem' }}
            >
              Explore Full Codex Exchange ({stats.activeListings} Volumes) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* The Scriptorium Highlight Chamber */}
      <section
        style={{
          padding: '4.5rem 0',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="content-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1.2rem'
            }}
          >
            <div>
              <span className="badge badge-like-new" style={{ marginBottom: '0.5rem' }}>
                <FileText size={13} /> THE SCRIPTORIUM ARCHIVES
              </span>
              <h2 className="font-display" style={{ fontSize: '2rem' }}>
                Open-Access Manuscripts & Solved Syllabi
              </h2>
              <p>Peer-reviewed lecture syntheses, formula cheat sheets, and solved examinations</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentView('vault')}>
              Enter Scriptorium <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.8rem'
            }}
          >
            {topResources.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        </div>
      </section>

      {/* Collegiate Covenant & Trust */}
      <section style={{ padding: '5rem 0' }}>
        <div className="content-wrapper">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-like-new" style={{ marginBottom: '0.5rem' }}>
              COLLEGIATE PRINCIPLES
            </span>
            <h2 className="font-display" style={{ fontSize: '2.2rem' }}>The Scholar's Covenant</h2>
            <p>Architected for physical safety, zero middlemen markups, and academic solidarity</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.8rem'
            }}
          >
            <div className="glass-panel" style={{ padding: '2.2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '1.4rem'
                }}
              >
                <DollarSign size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Zero Platform Cut
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Unlike commercial bookstore buybacks that pay pennies and resell at 400% markup, LitHaven
                takes zero fees on student peer transfers.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(124, 58, 237, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                  marginBottom: '1.4rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Verified Quad Handovers
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Meet safely at designated university landmarks (Library Atriums, Student Quads, Dept Lounges).
                Inspect physical page integrity before exchanging funds.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                  marginBottom: '1.4rem'
                }}
              >
                <Zap size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Direct Peer Negotiations
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Propose flexible counter-offers, agree on convenient meetup windows, and coordinate smoothly
                without exchanging personal phone numbers.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#06b6d4',
                  marginBottom: '1.4rem'
                }}
              >
                <GraduationCap size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Circular Academic Heritage
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Keep authoritative knowledge circulating through incoming scholar cohorts. Eliminate paper
                waste and reduce student textbook debt permanently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
