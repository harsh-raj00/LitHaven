import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { ResourceCard } from '../components/ResourceCard';
import { HeroBookStack } from '../components/HeroBookStack';
import { INITIAL_RESOURCES } from './StudyVaultPage';
import {
  Search,
  ArrowRight,
  MapPin,
  Library,
  Grid,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const HomePage = ({ setCurrentView, onSelectBook, onInquireBook, setSearchQuery, categoryFilter, setCategoryFilter }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [topResources, setTopResources] = useState(INITIAL_RESOURCES);
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeNoteCategory, setActiveNoteCategory] = useState('all');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [homeViewMode, setHomeViewMode] = useState('grid'); // 'grid' or 'shelf'
  const [loading, setLoading] = useState(true);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, resRes] = await Promise.all([
          api.books.getFeatured(),
          api.resources.getAll({ limit: 8, sort: 'popular' })
        ]);

        if (booksRes.success) setFeaturedBooks(booksRes.books);
        if (resRes.success) setTopResources(resRes.resources);
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
      if (setCategoryFilter) setCategoryFilter('');
      if (setSearchQuery) setSearchQuery(searchInput.trim());
      setCurrentView('marketplace');
    }
  };

  const POPULAR_SUBJECT_MAP = {
    'Engineering & Tech': 'Engineering & Technology',
    'Quantitative Finance': 'Commerce, Finance & MBA',
    'Computer Science': 'Computer Science & AI',
    'Machine Learning': 'Machine Learning & AI',
    'Competitive Exams': 'Competitive Exams'
  };

  const handleCategoryClick = (category) => {
    const mappedCategory = POPULAR_SUBJECT_MAP[category] || category;
    if (setSearchQuery) setSearchQuery('');
    if (setCategoryFilter) setCategoryFilter(mappedCategory);
    setCurrentView('marketplace');
  };

  // Filter books by tab (Semester/Year-wise and Subject disciplines)
  const displayedBooks = featuredBooks.filter((book) => {
    if (activeTab === 'sem_1_2') {
      return /Semester\s*[12]|Year\s*1|All Semesters/i.test(book.semester || '');
    }
    if (activeTab === 'sem_3_4') {
      return /Semester\s*[34]|Year\s*2/i.test(book.semester || '');
    }
    if (activeTab === 'sem_5_6') {
      return /Semester\s*[56]|Year\s*3/i.test(book.semester || '');
    }
    if (activeTab === 'final_gate') {
      return /Final|GATE|Semester\s*[678]|Pre-Final/i.test(book.semester || '');
    }
    if (activeTab === 'engineering') {
      return ['Engineering & Technology', 'Natural Sciences & Math'].includes(book.category);
    }
    if (activeTab === 'cs_ml') {
      return ['Computer Science & AI', 'Machine Learning & AI'].includes(book.category);
    }
    if (activeTab === 'finance') {
      return ['Commerce, Finance & MBA'].includes(book.category);
    }
    if (activeTab === 'dev_interview') {
      return ['Interview Preparation & Coding', 'Software Development & Web'].includes(book.category);
    }
    if (activeTab === 'exams') {
      return ['Competitive Exams'].includes(book.category);
    }
    return true;
  });

  // Filter study notes by category & search query
  const displayedResources = topResources.filter((res) => {
    // 1. Category filter
    let matchesCategory = true;
    if (activeNoteCategory === 'cs') matchesCategory = res.category?.includes('Computer Science');
    else if (activeNoteCategory === 'ml') matchesCategory = res.category?.includes('Machine Learning');
    else if (activeNoteCategory === 'interview') matchesCategory = res.category?.includes('Interview') || res.category?.includes('Software Development');
    else if (activeNoteCategory === 'exams') matchesCategory = res.category?.includes('Competitive');

    if (!matchesCategory) return false;

    // 2. Search query filter
    if (noteSearchQuery.trim()) {
      const q = noteSearchQuery.toLowerCase();
      const matchTitle = res.title?.toLowerCase().includes(q);
      const matchSubject = res.subject?.toLowerCase().includes(q);
      const matchDesc = res.description?.toLowerCase().includes(q);
      const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
      const matchAuthor = res.uploader?.name?.toLowerCase().includes(q);
      return matchTitle || matchSubject || matchDesc || matchTags || matchAuthor;
    }

    return true;
  });


  return (
    <div>
      {/* Modern Premium Editorial Hero */}
      <section className="hero-editorial">
        <div className="content-wrapper">
          <div className="hero-editorial-layout">
            {/* Left: Editorial Hero Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="hero-eyebrow">
                <div className="tag">Your campus. Your community.</div>
              </div>

              <h1 className="hero-headline">
                Good books deserve{' '}
                <span className="hero-serif-italic">another chapter.</span>
              </h1>

              <p className="hero-subtitle">
                Buy, sell, and share textbooks with fellow students. Discover useful study notes, prepare for exams, and make learning more affordable.
              </p>

              {/* Integrated Editorial Search Station (Commented out per request)
              <form onSubmit={handleHeroSearch} className="hero-search-box" style={{ width: '100%' }}>
                <Search size={19} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search by title, author, or subject (e.g. Algorithms, Physics, Economics)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="hero-search-input"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: '0.2rem'
                    }}
                    title="Clear"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="hero-search-btn">
                  <span>Find Books</span>
                  <ArrowRight size={15} />
                </button>
              </form>
              */}

              {/* Quick Subject Chips & Learn More (Commented out per request)
              <div className="hero-quick-row">
                <span className="hero-quick-label">POPULAR:</span>
                {[
                  'Engineering & Tech',
                  'Quantitative Finance',
                  'Computer Science',
                  'Machine Learning',
                  'Competitive Exams'
                ].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    className="hero-quick-tag"
                    onClick={() => handleCategoryClick(sub)}
                  >
                    {sub}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('featured-volumes');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hero-quick-tag"
                  style={{
                    borderStyle: 'dashed',
                    color: 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  Learn More ↓
                </button>
              </div>
              */}
            </div>

            {/* Right: Interactive 3D Animated Editorial Book Stack */}
            <HeroBookStack setCurrentView={setCurrentView} />
          </div>



        </div>
      </section>

      {/* Featured Books Section with Shelf & Grid View Switcher */}
      <section id="featured-volumes" style={{ padding: '3rem 0 3.25rem' }}>
        <div className="content-wrapper">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem'
            }}
          >
            <div>
              <span className="eyebrow-tag" style={{ marginBottom: '0.45rem' }}>
                CURATED CATALOG
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.9rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)'
                }}
              >
                Featured Campus Volumes
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Authentic academic & coding volumes available for direct handover right now
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              {/* Category Filter Pills (Compact & Refined) */}
              <div
                className="catalog-tabs-container"
                style={{
                  display: 'flex',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px',
                  gap: '2px',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  maxWidth: '100%',
                  scrollbarWidth: 'none'
                }}
              >
                {[
                  { id: 'all', label: 'All Volumes' },
                  { id: 'sem_3_4', label: '2nd Year (Sem 3-4)' },
                  { id: 'sem_5_6', label: '3rd Year (Sem 5-6)' },
                  { id: 'final_gate', label: 'Final Year & GATE' },
                  { id: 'engineering', label: 'Engineering' },
                  { id: 'cs_ml', label: 'CS & AI' },
                  { id: 'dev_interview', label: 'Dev & SDE' },
                  { id: 'exams', label: 'Competitive Exams' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      border: 'none',
                      background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                      transition: 'var(--transition)',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View Switcher: Grid vs Shelf */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  className={`view-btn ${homeViewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setHomeViewMode('grid')}
                  title="Grid Cards"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`view-btn ${homeViewMode === 'shelf' ? 'active' : ''}`}
                  onClick={() => setHomeViewMode('shelf')}
                  title="Bookshelf Spine View"
                >
                  <Library size={16} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Consulting campus catalog...
            </div>
          ) : displayedBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ margin: 0, fontWeight: 500 }}>No volumes found under this category tab right now.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.85rem' }}
                onClick={() => setActiveTab('all')}
              >
                View All Featured Volumes
              </button>
            </div>
          ) : homeViewMode === 'shelf' ? (
            /* Visual 3D Bookshelf View */
            <div>
              <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Hover any book spine to pull it from the library shelf:
              </div>
              <div className="shelf-container">
                {displayedBooks.map((book, idx) => {
                  const colors = ['#8b261e', '#1c4d37', '#1f3a5f', '#4a3b32', '#6b3074', '#9e5b22', '#2d3748'];
                  const spineColor = colors[idx % colors.length];
                  const displayTitle = book.title && book.title.length > 22
                    ? book.title.substring(0, 20).trim() + '…'
                    : (book.title || 'Untitled');
                  const displayAuthor = book.author
                    ? (book.author.length > 16 ? book.author.substring(0, 14).trim() + '…' : book.author)
                    : (book.condition || '');
                  return (
                    <div
                      key={book._id}
                      className="shelf-book"
                      onClick={() => onSelectBook && onSelectBook(book)}
                      title={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
                    >
                      <div className="shelf-spine" style={{ backgroundColor: spineColor }}>
                        <span className="shelf-spine-title">
                          {displayTitle}
                        </span>
                        <span className="shelf-spine-author">
                          {displayAuthor}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="shelf-ledge"></div>
              </div>
            </div>
          ) : (
            /* Rich Editorial Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                gap: '1.75rem'
              }}
            >
              {displayedBooks.slice(0, 12).map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onSelect={onSelectBook}
                  onInquire={onInquireBook}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setCurrentView('marketplace')}
            >
              Explore All Books in Catalog <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section >


      {/* Academic Resources & Study Vault Showcase */}
      <section style={{ padding: '2.75rem 0 3rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="content-wrapper">
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem'
            }}
          >
            <div>
              <span className="eyebrow-tag" style={{ marginBottom: '0.45rem' }}>
                CAMPUS STUDY VAULT
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.9rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)'
                }}
              >
                Academic Resources
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem', maxWidth: '560px' }}>
                Free high-yield revision summaries, interview roadmaps, and solved papers shared by campus toppers.
              </p>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('vault')}
            >
              Open Full Vault <ArrowRight size={14} />
            </button>
          </div>

          {/* Interactive Search Bar & Category Filters Toolbar */}
          <div className="resource-toolbar">
            {/* Search Input */}
            <div className="resource-toolbar-search">
              <Search size={16} className="resource-toolbar-search-icon" />
              <input
                type="text"
                placeholder="Search notes, roadmaps, or subjects (e.g. DSA, Machine Learning, GATE)..."
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
              />
              {noteSearchQuery && (
                <button
                  type="button"
                  className="resource-toolbar-clear"
                  onClick={() => setNoteSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Pills & Match Count */}
            <div className="resource-toolbar-filters">
              <div className="resource-filter-pills">
                {[
                  { id: 'all', label: 'All Resources' },
                  { id: 'cs', label: 'CS & Algorithms' },
                  { id: 'ml', label: 'Machine Learning' },
                  { id: 'interview', label: 'Interview & Dev' },
                  { id: 'exams', label: 'Competitive Exams' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`resource-filter-pill ${activeNoteCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveNoteCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <span className="resource-results-count">
                {displayedResources.length} {displayedResources.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>
          </div>

          {/* Resources Grid */}
          {displayedResources.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <FileText size={30} style={{ color: 'var(--text-muted)', marginBottom: '0.65rem', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                No resources found matching your search
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '1rem', maxWidth: '400px', margin: '0 auto 1rem' }}>
                Try adjusting your search query or switching to a different category filter to find study materials.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setNoteSearchQuery('');
                  setActiveNoteCategory('all');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="study-vault-grid">
              {displayedResources.map((res) => (
                <ResourceCard key={res._id} resource={res} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process: "How Campus Exchange Works" */}
      <section
        style={{
          padding: '3rem 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="content-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <span className="eyebrow-tag" style={{ marginBottom: '0.45rem' }}>
              PEER-TO-PEER PROCESS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              How LitHaven Campus Exchange Works
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.3rem auto 0' }}>
              Direct peer-to-peer exchanges designed around authentic student life.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--accent-terracotta)',
                  letterSpacing: '0.06em',
                  marginBottom: '0.65rem'
                }}
              >
                01 / DISCOVER
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                Search Course Stacks
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Filter by semester, course code, or professor's syllabus. Sellers can list textbooks in under 90 seconds .
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--accent-terracotta)',
                  letterSpacing: '0.06em',
                  marginBottom: '0.65rem'
                }}
              >
                02 / NEGOTIATE
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                Propose Price & Chat
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Propose your custom offer price in Indian Rupees and chat directly in-app. Agree on a meeting time without exposing personal phone numbers.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--accent-terracotta)',
                  letterSpacing: '0.06em',
                  marginBottom: '0.65rem'
                }}
              >
                03 / MEET & VERIFY
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                Meet Safely on Campus
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Meet at the campus library steps, student canteen, or main foyer. Inspect book pages in person and complete payment directly via UPI or cash.
              </p>
            </div>
          </div>
        </div>
      </section >



      {/* Editorial Community Closing Banner */}
      <section style={{ padding: '1.25rem 0 3.25rem' }}>
        <div className="content-wrapper">
          <div className="editorial-cta-banner">
            <span className="eyebrow-tag" style={{ marginBottom: '0.65rem' }}>
              PASS IT FORWARD
            </span>
            <h2 className="editorial-cta-headline">
              Give your books <span className="hero-serif-italic">a second life.</span>
            </h2>
            <p className="editorial-cta-desc">
              Pass on your annotated textbooks, lecture notes, and lab manuals to juniors—earn fair money and clear your shelf for the new semester.
            </p>
            <div className="editorial-cta-actions">
              <button
                className="btn btn-accent btn-lg"
                onClick={() => setCurrentView('sell')}
                style={{ padding: '0.75rem 1.65rem', fontSize: '0.94rem' }}
              >
                Sell a Book Now
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setCurrentView('marketplace')}
                style={{ padding: '0.75rem 1.65rem', fontSize: '0.94rem' }}
              >
                Explore Catalog <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
