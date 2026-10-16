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
  RotateCcw,
  BookOpen,
  Tag,
  Check
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
      console.error('Failed to load marketplace books:', err);
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
        {/* Marketplace Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>The Codex Exchange</h1>
          <p>
            Explore verified academic monographs, standard treatises, and course texts from fellow
            scholars. Filter by academic discipline, edition, condition, and price.
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
                style={{ paddingLeft: '2.5rem', borderRadius: '999px' }}
                placeholder="Search by title, author, course code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          {/* Sort & View toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular & Viewed</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: '8px'
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: viewMode === 'list' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Books Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="marketplace-layout"
        >
          {/* Left Filter Sidebar */}
          <aside className="glass-panel" style={{ padding: '1.4rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <Filter size={16} color="var(--primary-light)" /> Filters
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
                    gap: '0.2rem'
                  }}
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1.6rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.6rem',
                  color: 'var(--text-primary)'
                }}
              >
                Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      background: category === cat ? 'var(--primary)' : 'transparent',
                      color: category === cat ? '#ffffff' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '0.84rem',
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
            <div style={{ marginBottom: '1.6rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.6rem',
                  color: 'var(--text-primary)'
                }}
              >
                Book Condition
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {conditions.map((cond, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{
                      background: condition === cond ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      color: condition === cond ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
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
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.6rem',
                  color: 'var(--text-primary)'
                }}
              >
                Price Range ($)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.6rem' }}
                onClick={() => {
                  setCurrentPage(1);
                  fetchBooks();
                }}
              >
                Apply Range
              </button>
            </div>
          </aside>

          {/* Right Listings Column */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                Showing <strong>{books.length}</strong> of <strong>{total}</strong> verified
                textbooks
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(99, 102, 241, 0.2)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                <p style={{ marginTop: '1rem' }}>Loading campus listings...</p>
              </div>
            ) : books.length === 0 ? (
              <div
                className="glass-panel"
                style={{ textAlign: 'center', padding: '4rem 2rem' }}
              >
                <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>No books match your current criteria</h3>
                <p style={{ maxWidth: '420px', margin: '0.6rem auto 1.4rem' }}>
                  Try broadening your search keywords or resetting category and price filters.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
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
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Page {currentPage} of {totalPages}
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
