import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ResourceCard } from '../components/ResourceCard';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  X,
  CheckCircle,
  FileUp,
  Tag,
  Shield,
  Award,
  Scroll,
  Layers
} from 'lucide-react';

export const StudyVaultPage = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Computer Science & AI',
    fileType: 'Cheat Sheet',
    subject: '',
    semester: 'Semester 4',
    tags: '',
    fileUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fileTypes = [
    'All',
    'Cheat Sheet',
    'Notes',
    'Question Paper',
    'Presentation',
    'Assignment',
    'Solution'
  ];

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        fileType: fileTypeFilter !== 'All' ? fileTypeFilter : '',
        search
      };
      const data = await api.resources.getAll(params);
      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error('Failed to load scriptorium manuscripts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [fileTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('fileType', uploadForm.fileType);
      formData.append('subject', uploadForm.subject);
      formData.append('semester', uploadForm.semester);
      formData.append('tags', uploadForm.tags);

      if (selectedFile) {
        formData.append('resourceFile', selectedFile);
      } else if (uploadForm.fileUrl) {
        formData.append('fileUrl', uploadForm.fileUrl);
      }

      const res = await api.resources.create(formData);
      if (res.success) {
        showToast('Manuscript preserved in The Scriptorium!', 'success');
        setUploadModalOpen(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'Computer Science & AI',
          fileType: 'Cheat Sheet',
          subject: '',
          semester: 'Semester 4',
          tags: '',
          fileUrl: ''
        });
        setSelectedFile(null);
        fetchResources();
      }
    } catch (err) {
      showToast(err.message || 'Failed to deposit manuscript', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Header Archival Chamber Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2.8rem',
            marginBottom: '2.5rem',
            background: 'radial-gradient(circle at 10% 10%, rgba(212, 175, 55, 0.12) 0%, transparent 60%), radial-gradient(circle at 90% 90%, rgba(124, 58, 237, 0.12) 0%, transparent 60%), var(--bg-glass-heavy)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.8rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div>
            <div className="hero-badge-tag" style={{ marginBottom: '0.8rem' }}>
              <Scroll size={14} color="var(--accent-gold)" /> OPEN ACADEMIC COMPENDIUM & PRESERVATION CHAMBER
            </div>
            <h1 className="font-display" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
              The Scriptorium
            </h1>
            <p className="font-serif-literary" style={{ fontSize: '1.25rem', maxWidth: '640px', color: 'var(--text-secondary)' }}>
              A sanctuary of peer-verified lecture compendiums, high-yield examination solutions, and
              syllabi syntheses freely accessible to every university scholar.
            </p>
          </div>

          <button
            className="btn btn-accent btn-lg"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                setUploadModalOpen(true);
              }
            }}
            style={{ padding: '0.85rem 1.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <Upload size={18} /> Deposit Manuscript
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.2rem',
            marginBottom: '2.2rem'
          }}
        >
          {/* File Types Segmented Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {fileTypes.map((type, idx) => (
              <button
                key={idx}
                type="button"
                style={{
                  background: fileTypeFilter === type ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: fileTypeFilter === type ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${fileTypeFilter === type ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setFileTypeFilter(type)}
              >
                {type === 'All' ? 'All Manuscripts' : type}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', minWidth: '300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem', borderRadius: '999px', fontSize: '0.88rem' }}
                placeholder="Filter by subject or exam title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={15}
                color="var(--accent-gold)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 1rem', borderRadius: '999px' }}>
              Filter
            </button>
          </form>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid rgba(124, 58, 237, 0.2)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Unrolling scriptorium scrolls...
            </p>
          </div>
        ) : resources.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
            <Scroll size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.2rem' }} />
            <h3 className="font-display">No manuscripts recorded for this filter</h3>
            <p style={{ maxWidth: '420px', margin: '0.6rem auto 1.5rem', color: 'var(--text-secondary)' }}>
              Be the first scholar to deposit study notes, formula cheat sheets, or past question papers
              for this discipline.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setFileTypeFilter('All');
                setSearch('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.8rem'
            }}
          >
            {resources.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        )}

        {/* Deposit Manuscript Modal */}
        {uploadModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 7, 12, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setUploadModalOpen(false)}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.4rem',
                position: 'relative',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', top: '16px', right: '16px', padding: '0.4rem' }}
                onClick={() => setUploadModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: '1.6rem' }}>
                <div className="badge badge-like-new" style={{ marginBottom: '0.4rem' }}>
                  SCRIPTORIUM CONTRIBUTOR
                </div>
                <h2 className="font-display" style={{ fontSize: '1.8rem' }}>Deposit Scholarly Material</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Help peers master complex disciplines with high-yield manuscripts and solved examinations.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit}>
                <div className="form-group">
                  <label className="form-label">Manuscript Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. CS204: Algorithms Dynamic Programming Master Compendium"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Discipline / Faculty</label>
                    <select
                      className="form-input"
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    >
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="Medical & Healthcare">Medical & Healthcare</option>
                      <option value="Engineering & Technology">Engineering & Technology</option>
                      <option value="Commerce, Finance & MBA">Commerce, Finance & MBA</option>
                      <option value="Natural Sciences & Math">Natural Sciences & Math</option>
                      <option value="Competitive Exams">Competitive Exams</option>
                      <option value="Law & Legal Studies">Law & Legal Studies</option>
                      <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Document Classification</label>
                    <select
                      className="form-input"
                      value={uploadForm.fileType}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                    >
                      <option value="Cheat Sheet">Cheat Sheet / Summary</option>
                      <option value="Notes">Lecture Notes</option>
                      <option value="Question Paper">Past Solved Exam Paper</option>
                      <option value="Solution">Lab Manual & Solutions</option>
                      <option value="Presentation">Slide Deck Summary</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Course Subject</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Distributed Consensus"
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Semester / Level</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Semester 5 or Graduate"
                      value={uploadForm.semester}
                      onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Curatorial Summary & Insights</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Highlight key theorems, exam weightage, or topics covered..."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Search Tags (Comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. algorithms, dynamic programming, leetcode, midterms"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  />
                </div>

                {/* File Attachment or URL */}
                <div className="form-group">
                  <label className="form-label">Upload PDF Document or Provide Cloud Link</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>— OR —</div>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="Paste Google Drive / OneDrive public document link"
                      value={uploadForm.fileUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '2rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setUploadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Preserving in Archives...' : 'Confirm Deposit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
