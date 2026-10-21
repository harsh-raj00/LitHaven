import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { formatINR } from '../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Library,
  ArrowUpRight,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const MarketplacePage = ({
  onSelectBook,
  onInquireBook,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter
}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState(searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'shelf'
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchBooks = async (overrides = {}) => {
    setLoading(true);
    try {
      const activeSearch = overrides.search !== undefined ? overrides.search : search;
      const activeCategory = overrides.category !== undefined ? overrides.category : selectedCategory;
      const activeCondition = overrides.condition !== undefined ? overrides.condition : selectedCondition;
      const activeMin = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
      const activeMax = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
      const activeSort = overrides.sort !== undefined ? overrides.sort : sortBy;
      const activePage = overrides.page !== undefined ? overrides.page : currentPage;
      const activeLimit = overrides.limit !== undefined ? overrides.limit : (viewMode === 'shelf' ? 24 : 12);

      const params = {
        page: activePage,
        limit: activeLimit,
        search: activeSearch,
        category: activeCategory,
        condition: activeCondition,
        minPrice: activeMin,
        maxPrice: activeMax,
        sort: activeSort
      };

      const data = await api.books.getAll(params);
      if (data.success) {
        setBooks(data.books);
        setTotal(data.total);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error('Failed to fetch marketplace books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync external search query and category filter
  useEffect(() => {
    let nextCategory = selectedCategory;
    let nextSearch = search;
    let shouldFetch = false;

    if (categoryFilter !== undefined && categoryFilter !== selectedCategory) {
      nextCategory = categoryFilter;
      setSelectedCategory(categoryFilter);
      shouldFetch = true;
    }

    if (searchQuery !== undefined && searchQuery !== search) {
      // Check if searchQuery is actually one of the popular subject filters
      const popularSubjMap = {
        'Engineering & Tech': 'Engineering & Technology',
        'Quantitative Finance': 'Commerce, Finance & MBA',
        'Computer Science': 'Computer Science & AI',
        'Machine Learning': 'Machine Learning & AI',
        'Competitive Exams': 'Competitive Exams'
      };

      if (popularSubjMap[searchQuery]) {
        const mappedCat = popularSubjMap[searchQuery];
        nextCategory = mappedCat;
        nextSearch = '';
        setSelectedCategory(mappedCat);
        setSearch('');
        if (setCategoryFilter) setCategoryFilter(mappedCat);
        if (setSearchQuery) setSearchQuery('');
      } else {
        nextSearch = searchQuery;
        setSearch(searchQuery);
      }
      shouldFetch = true;
    }

    if (shouldFetch) {
      setCurrentPage(1);
      fetchBooks({ search: nextSearch, category: nextCategory, page: 1 });
    }
  }, [searchQuery, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const data = await api.books.getCategories();
      if (data.success) {
        setCategoriesList(data.categories.map((c) => c.name || c._id));
      }
    } catch {
      setCategoriesList([
        'Computer Science & AI',
        'Machine Learning & AI',
        'Software Development & Web',
        'Interview Preparation & Coding',
        'Competitive Exams',
        'Engineering & Technology',
        'Medical & Healthcare',
        'Commerce, Finance & MBA',
        'Natural Sciences & Math',
        'Law & Legal Studies'
      ]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, selectedCategory, selectedCondition, sortBy, viewMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks({ search, page: 1 });
  };

  const handleClearFilters = () => {
    setSearch('');
    if (setSearchQuery) setSearchQuery('');
    if (setCategoryFilter) setCategoryFilter('');
    setSelectedCategory('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    fetchBooks({
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1
    });
  };

  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Page Title & Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="eyebrow-tag" style={{ marginBottom: '0.45rem' }}>
                CAMPUS ARCHIVE • {total} VOLUMES AVAILABLE
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Find Campus Books
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Browse verified textbooks available for in-person campus handover
              </p>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                aria-label="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Ledger Table View"
                aria-label="List View"
              >
                <List size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'shelf' ? 'active' : ''}`}
                onClick={() => setViewMode('shelf')}
                title="3D Bookshelf View"
                aria-label="Shelf View"
              >
                <Library size={16} />
              </button>
            </div>
          </div>

          {/* Search bar row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 320px', display: 'flex', gap: '0.5rem' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.75rem 0.45rem 1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  id="marketplace-search-input"
                  type="text"
                  placeholder="Search by title, author, or subject (press / to focus)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit'
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  /
                </span>
                {search && (
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    onClick={() => {
                      setSearch('');
                      if (setSearchQuery) setSearchQuery('');
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="form-select font-mono"
                style={{ width: 'auto', minWidth: '190px', fontSize: '0.84rem' }}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Quick Subject Filter Chips Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
              paddingBottom: '0.4rem',
              scrollbarWidth: 'none'
            }}
          >
            <button
              type="button"
              className={`quick-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('');
                if (setCategoryFilter) setCategoryFilter('');
                setCurrentPage(1);
                fetchBooks({ category: '', page: 1 });
              }}
            >
              All Subjects
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`quick-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (setCategoryFilter) setCategoryFilter(cat);
                  setCurrentPage(1);
                  fetchBooks({ category: cat, page: 1 });
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Results */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="marketplace-layout"
        >
          {/* Left Sidebar Filters */}
          <aside
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
                <SlidersHorizontal size={15} /> Filters
              </div>
              {(selectedCategory || selectedCondition || minPrice || maxPrice || search) && (
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={handleClearFilters}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Subject Filter */}
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Subject
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  type="button"
                  style={{
                    textAlign: 'left',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedCategory === '' ? 'var(--bg-secondary)' : 'transparent',
                    color: selectedCategory === '' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedCategory === '' ? 600 : 400,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedCategory('');
                    if (setCategoryFilter) setCategoryFilter('');
                    setCurrentPage(1);
                    fetchBooks({ category: '', page: 1 });
                  }}
                >
                  All Subjects
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    style={{
                      textAlign: 'left',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: selectedCategory === cat ? 'var(--bg-secondary)' : 'transparent',
                      color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: selectedCategory === cat ? 600 : 400,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (setCategoryFilter) setCategoryFilter(cat);
                      setCurrentPage(1);
                      fetchBooks({ category: cat, page: 1 });
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Condition
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="quick-chip"
                  style={{
                    background: selectedCondition === '' ? 'var(--text-primary)' : 'var(--bg-secondary)',
                    color: selectedCondition === '' ? 'var(--bg-surface)' : 'var(--text-secondary)',
                    borderColor: selectedCondition === '' ? 'var(--text-primary)' : 'var(--border-subtle)'
                  }}
                  onClick={() => {
                    setSelectedCondition('');
                    setCurrentPage(1);
                    fetchBooks({ condition: '', page: 1 });
                  }}
                >
                  All
                </button>
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    className="quick-chip"
                    style={{
                      background: selectedCondition === cond ? 'var(--text-primary)' : 'var(--bg-secondary)',
                      color: selectedCondition === cond ? 'var(--bg-surface)' : 'var(--text-secondary)',
                      borderColor: selectedCondition === cond ? 'var(--text-primary)' : 'var(--border-subtle)'
                    }}
                    onClick={() => {
                      const nextCond = selectedCondition === cond ? '' : cond;
                      setSelectedCondition(nextCond);
                      setCurrentPage(1);
                      fetchBooks({ condition: nextCond, page: 1 });
                    }}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter in INR */}
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Price Range (₹)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.65rem' }}>
                {[
                  { label: '< ₹300', max: '300' },
                  { label: '< ₹600', max: '600' },
                  { label: '< ₹1,000', max: '1000' }
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="quick-chip font-mono"
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.2rem 0.5rem',
                      background: maxPrice === p.max && !minPrice ? 'var(--btn-primary-bg)' : 'var(--bg-secondary)',
                      color: maxPrice === p.max && !minPrice ? 'var(--btn-primary-text)' : 'var(--text-secondary)'
                    }}
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice(p.max);
                      setCurrentPage(1);
                      fetchBooks({ minPrice: '', maxPrice: p.max, page: 1 });
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="form-input font-mono"
                  style={{ padding: '0.4rem 0.55rem', fontSize: '0.84rem' }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="form-input font-mono"
                  style={{ padding: '0.4rem 0.55rem', fontSize: '0.84rem' }}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.65rem' }}
                onClick={() => {
                  setCurrentPage(1);
                  fetchBooks({ minPrice, maxPrice, page: 1 });
                }}
              >
                Apply Price
              </button>
            </div>
          </aside>

          {/* Right Column: Dynamic Results */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                fontSize: '0.84rem',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                Showing <strong>{books.length}</strong> of <strong>{total}</strong> books
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                Loading books...
              </div>
            ) : books.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  No books found
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Try changing your search, price, or subject filter.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* 1. Grid View */}
                {viewMode === 'grid' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                      gap: '1.5rem'
                    }}
                  >
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

                {/* 2. Table / List View */}
                {viewMode === 'list' && (
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      overflowX: 'auto'
                    }}
                  >
                    <table className="marketplace-table">
                      <thead>
                        <tr>
                          <th>Book</th>
                          <th>Author</th>
                          <th>Condition</th>
                          <th>Meeting Spot</th>
                          <th>Price</th>
                          <th style={{ textAlign: 'right' }}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book) => (
                          <tr
                            key={book._id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelectBook(book)}
                          >
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={book.coverImage || '/covers/cover_placeholder.jpg'}
                                  alt={book.title}
                                  style={{
                                    width: '38px',
                                    height: '52px',
                                    borderRadius: 'var(--radius-sm)',
                                    objectFit: 'cover'
                                  }}
                                />
                                <div>
                                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {book.title}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                    {book.category} {book.courseCode && `• ${book.courseCode}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-secondary)' }}>
                              {book.author}
                            </td>
                            <td>
                              <span className="badge badge-like-new" style={{ fontSize: '0.74rem' }}>
                                {book.condition}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                              {book.campusMeetingSpot || book.owner?.college || 'Campus'}
                            </td>
                            <td>
                              <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                {formatINR(book.price)}
                              </div>
                              {book.originalPrice > book.price && (
                                <div
                                  className="font-mono"
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through'
                                  }}
                                >
                                  {formatINR(book.originalPrice)}
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectBook(book);
                                }}
                              >
                                View <ArrowUpRight size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. Shelf View */}
                {viewMode === 'shelf' && (
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem'
                    }}
                  >
                    <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                      Click any book on the shelf to view details:
                    </div>
                    <div className="shelf-container">
                      {books.map((book, idx) => {
                        const colors = ['#27272a', '#3f3f46', '#52525b', '#18181b', '#334155', '#475569'];
                        const spineBg = colors[idx % colors.length];
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
                            onClick={() => onSelectBook(book)}
                            title={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
                          >
                            <div
                              className="shelf-spine"
                              style={{
                                background: spineBg,
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <span style={{ fontSize: '0.8rem' }}>
                                {book.title.length > 28 ? book.title.substring(0, 28) + '...' : book.title}
                              </span>
                              <span className="shelf-spine-author">
                                {displayAuthor}
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
                      gap: '0.5rem',
                      marginTop: '2.5rem'
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={15} /> Prev
                    </button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next <ChevronRight size={15} />
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
