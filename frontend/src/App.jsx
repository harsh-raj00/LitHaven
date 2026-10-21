import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BookDetailModal } from './components/BookDetailModal';
import { InquiryModal } from './components/InquiryModal';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { StudyVaultPage } from './pages/StudyVaultPage';
import { CreateBookPage } from './pages/CreateBookPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { DashboardPage } from './pages/DashboardPage';

function AppContent() {
  const { openAuthModal } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'marketplace', 'vault', 'sell', 'inquiries', 'dashboard'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [inquireBook, setInquireBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Sync hash changes with currentView & open AuthModal on #login / #register
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'login' || hash === 'register') {
        openAuthModal(hash);
      } else if (['home', 'marketplace', 'vault', 'sell', 'inquiries', 'dashboard'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash === 'login' || initialHash === 'register') {
      openAuthModal(initialHash);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openAuthModal]);

  // Global Keyboard Shortcut (⌘K or Ctrl+K) to focus search/marketplace
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentView('marketplace');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenBookDetail = (book) => {
    setSelectedBook(book);
  };

  const handleStartInquiry = (book) => {
    setInquireBook(book);
  };

  const handleInquirySuccess = () => {
    setCurrentView('inquiries');
  };

  return (
    <div className="app-container">
      {/* Global Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Page Content */}
      <main className="main-content">
        {currentView === 'home' && (
          <HomePage
            setCurrentView={setCurrentView}
            onSelectBook={handleOpenBookDetail}
            onInquireBook={handleStartInquiry}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplacePage
            onSelectBook={handleOpenBookDetail}
            onInquireBook={handleStartInquiry}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}

        {currentView === 'vault' && <StudyVaultPage />}

        {currentView === 'sell' && (
          <CreateBookPage
            setCurrentView={setCurrentView}
            onSelectBook={handleOpenBookDetail}
          />
        )}

        {currentView === 'inquiries' && <InquiriesPage />}

        {currentView === 'dashboard' && (
          <DashboardPage
            setCurrentView={setCurrentView}
            onSelectBook={handleOpenBookDetail}
            onInquireBook={handleStartInquiry}
          />
        )}
      </main>

      {/* Global Modals */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onMakeOffer={(book) => {
            setSelectedBook(null);
            handleStartInquiry(book);
          }}
        />
      )}

      {inquireBook && (
        <InquiryModal
          book={inquireBook}
          onClose={() => setInquireBook(null)}
          onSuccess={handleInquirySuccess}
        />
      )}

      <AuthModal />
      <ToastContainer />

      {/* Global Footer */}
      <Footer
        setCurrentView={setCurrentView}
        setCategoryFilter={setCategoryFilter}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
