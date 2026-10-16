import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Grid,
  List,
  Library,
  RotateCcw,
  BookOpen,
  MapPin,
  Tag,
  Check,
  ArrowUpRight,
  Eye,
  MessageSquare
} from 'lucide-react';

export const MarketplacePage = ({
  onSelectBook,
  onInquireBook,
  searchQuery,
  setSearchQuery
}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(searchQuery || '');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'shelf'

  const categories = [
    'All',
    'Computer Science & AI',
    'Medical & Healthcare',
    'Engineering & Technology',
    'Commerce, Finance & MBA',
    'Natural Sciences & Math',
    'Competitive Exams',
    'Law & Legal Studies',
    'Humanities & Social Sciences'
  ];

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Sync external search query if provided from homepage
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category: category !== 'All' ? category : '',
        condition: condition !== 'All' ? condition : '',
        minPrice,
        maxPrice,
        sort,
        page: currentPage,
        limit: 12
      };

      const res = await api.books.getAll(params);
      if (res.success) {
        setBooks(res.books);
        setTotal(res.total);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load codex exchange books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category, condition, sort, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleResetFilters = () => {
    setSearch('');
    if (setSearchQuery) setSearchQuery('');
    setCategory('All');
    setCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search || category !== 'All' || condition !== 'All' || minPrice || maxPrice;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Codex Exchange Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-badge-tag" style={{ marginBottom: '0.6rem' }}>
            <Library size={14} color="var(--accent-gold)" /> CURATED COLLEGIATE VOLUMES
          </div>
          <h1 className="font-display" style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
            The Codex Exchange
          </h1>
          <p className="font-serif-literary" style={{ fontSize: '1.2rem', maxWidth: '780px' }}>
            Authoritative university monographs, standard treatises, and course texts circulating
            freely among verified campus scholars.
          </p>
        </div>

        {/* Top Control Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.4rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Search form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              flex: '1 1 320px',
              maxWidth: '520px'
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '999px', fontSize: '0.9rem' }}
                placeholder="Search by monograph, author, ISBN, or course code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={16}
                color="var(--accent-gold)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 1.2rem' }}>
              Search
            </button>
          </form>

          {/* Right controls: View Switcher & Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* View Switcher: Grid, List, Shelf */}
            <div className="view-switcher">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Showcase Grid View"
              >
                <Grid size={15} /> Grid
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Archival Ledger View"
              >
                <List size={15} /> Ledger
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'shelf' ? 'active' : ''}`}
                onClick={() => setViewMode('shelf')}
                title="Bookshelf Spine View"
              >
                <Library size={15} /> Shelf
              </button>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={15} color="var(--text-muted)" />
              <select
                className="form-input"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', borderRadius: '999px', cursor: 'pointer' }}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Newest Acquisitions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Coveted (Views)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Listings */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '270px 1fr',
            gap: '2.2rem',
            alignItems: 'start'
          }}
          className="marketplace-layout"
        >
          {/* Left Filter Sidebar */}
          <aside className="glass-panel" style={{ padding: '1.6rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <Filter size={16} color="var(--accent-gold)" /> Scholarly Filters
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontWeight: 600
                  }}
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1.8rem' }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.6rem',
                  color: 'var(--text-muted)'
                }}
              >
                Disciplines
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      background: category === cat ? 'linear-gradient(135deg, var(--primary) 0%, #5b21b6 100%)' : 'transparent',
                      color: category === cat ? '#ffffff' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: category === cat ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onClick={() => {
                      setCategory(cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div style={{ marginBottom: '1.8rem' }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.6rem',
                  color: 'var(--text-muted)'
                }}
              >
                Volume Condition
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {conditions.map((cond, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      background: condition === cond ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: condition === cond ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setCondition(cond);
                      setCurrentPage(1);
                    }}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.6rem',
                  color: 'var(--text-muted)'
                }}
              >
                Student Budget ($)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min $"
                  className="form-input"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max $"
                  className="form-input"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.75rem', borderRadius: '8px' }}
                onClick={() => {
                  setCurrentPage(1);
                  fetchBooks();
                }}
              >
                Apply Range
              </button>
            </div>
          </aside>

          {/* Right Column: Dynamic View Modes */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.2rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                Displaying <strong>{books.length}</strong> of <strong>{total}</strong> verified
                scholarly volumes
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '42px',
                    height: '42px',
                    border: '3px solid rgba(124, 58, 237, 0.2)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  Retrieving volumes from campus quads...
                </p>
              </div>
            ) : books.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
                <BookOpen size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
                <h3 className="font-display">No treatises match your search criteria</h3>
                <p style={{ maxWidth: '440px', margin: '0.6rem auto 1.5rem', color: 'var(--text-secondary)' }}>
                  Try broadening your search keywords or resetting discipline and budget filters.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* 1. Grid View */}
                {viewMode === 'grid' && (
                  <div className="books-grid">
                    {books.map((book) => (
                      <BookCard
                        key={book._id}
                        book={book}
                        onSelect={onSelectBook}
                        onInquire={onInquireBook}
                      />
                    ))}
                  </div>
                )}

                {/* 2. Archival Ledger (List View) */}
                {viewMode === 'list' && (
                  <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
                    <table className="catalog-table">
                      <thead>
                        <tr>
                          <th>Volume & Discipline</th>
                          <th>Author</th>
                          <th>Condition</th>
                          <th>Handover Spot</th>
                          <th>Price / MRP</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book) => (
                          <tr
                            key={book._id}
                            className="catalog-row"
                            onClick={() => onSelectBook(book)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <img
                                  src={book.coverImage || '/covers/cover_placeholder.jpg'}
                                  alt={book.title}
                                  style={{ width: '38px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div>
                                  <div className="font-serif-literary" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                    {book.title}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)' }}>
                                    {book.category} {book.courseCode && `• ${book.courseCode}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                              {book.author}
                            </td>
                            <td>
                              <span className="badge badge-like-new" style={{ fontSize: '0.72rem' }}>
                                {book.condition}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} color="var(--accent-gold)" />
                              {book.campusMeetingSpot || book.owner?.college || 'Campus Quad'}
                            </td>
                            <td>
                              <span className="font-mono" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                                ${book.price}
                              </span>
                              {book.originalPrice > book.price && (
                                <span
                                  className="font-mono"
                                  style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through',
                                    marginLeft: '6px'
                                  }}
                                >
                                  ${book.originalPrice}
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectBook(book);
                                }}
                              >
                                Inspect <ArrowUpRight size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. Bookshelf Spine View */}
                {viewMode === 'shelf' && (
                  <div className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ marginBottom: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      Hover over any monograph spine to extract it from the library shelf:
                    </div>
                    <div className="shelf-container">
                      {books.map((book, idx) => {
                        const hues = ['#4338ca', '#7e22ce', '#047857', '#b45309', '#be123c', '#1d4ed8'];
                        const bgHue = hues[idx % hues.length];
                        return (
                          <div
                            key={book._id}
                            className="shelf-book"
                            onClick={() => onSelectBook(book)}
                            title={`${book.title} by ${book.author} — $${book.price}`}
                          >
                            <div
                              className="shelf-spine"
                              style={{
                                background: `linear-gradient(180deg, ${bgHue} 0%, #0d111a 100%)`,
                                border: '1px solid rgba(255,255,255,0.15)'
                              }}
                            >
                              <span className="font-serif-literary" style={{ fontSize: '0.85rem' }}>
                                {book.title.length > 28 ? book.title.substring(0, 28) + '...' : book.title}
                              </span>
                              <span className="font-mono" style={{ color: 'var(--accent-gold)', fontSize: '0.78rem' }}>
                                ${book.price}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.8rem',
                      marginTop: '3rem'
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      Folio {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
