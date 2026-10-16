import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
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
  const [currentView, setCurrentView] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [inquireBook, setInquireBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplacePage
            onSelectBook={handleOpenBookDetail}
            onInquireBook={handleStartInquiry}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
      <Footer setCurrentView={setCurrentView} />
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
