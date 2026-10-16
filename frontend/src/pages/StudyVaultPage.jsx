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
  Tag
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
      console.error('Failed to load study vault:', err);
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
        showToast('Study resource added to the Vault!', 'success');
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
      showToast(err.message || 'Failed to upload study resource', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="content-wrapper">
        {/* Header Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div className="hero-badge-tag" style={{ marginBottom: '0.6rem' }}>
              <FileText size={14} /> Open Scholarly Compendium & Archives
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>The Scriptorium</h1>
            <p style={{ maxWidth: '600px' }}>
              Curated academic manuscripts, high-yield syllabi, research syntheses, and peer exam
              digests freely preserved for the academic community.
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
          >
            <Upload size={18} /> Deposit Manuscript
          </button>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.2rem',
            marginBottom: '2rem'
          }}
        >
          {/* FileType Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {fileTypes.map((type, i) => (
              <button
                key={i}
                type="button"
                style={{
                  background:
                    fileTypeFilter === type ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: fileTypeFilter === type ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onClick={() => setFileTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by topic, course, or tag..."
              className="form-input"
              style={{ borderRadius: '999px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p>Loading study vault documents...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No study materials found</h3>
            <p style={{ margin: '0.5rem auto 1.2rem', maxWidth: '400px' }}>
              Be the first student to upload notes for this subject and earn community karma!
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (!isAuthenticated) openAuthModal('login');
                else setUploadModalOpen(true);
              }}
            >
              Upload Material
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.6rem'
            }}
          >
            {resources.map((res) => (
              <ResourceCard key={res._id} resource={res} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '580px', padding: '2.2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setUploadModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '1.4rem' }}>
              <div className="badge badge-like-new" style={{ marginBottom: '0.4rem' }}>
                SCRIPTORIUM CONTRIBUTOR
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>Deposit Scholarly Material</h2>
              <p style={{ fontSize: '0.88rem' }}>
                Preserve and share high-yield lecture digests, formula compendiums, and solved examinations.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. CS204: Algorithms Dynamic Programming Master Sheet"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject / Course</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Operating Systems"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">File Type</label>
                  <select
                    className="form-select"
                    value={uploadForm.fileType}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                  >
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Notes">Lecture Notes</option>
                    <option value="Question Paper">Solved Question Paper</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Solution">Exam Solution</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Academic Category</label>
                  <select
                    className="form-select"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Medical & Healthcare">Medical & Healthcare</option>
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Commerce, Finance & MBA">Commerce, Finance & MBA</option>
                    <option value="Natural Sciences & Math">Natural Sciences & Math</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Semester</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Semester 3 or Final Year"
                    value={uploadForm.semester}
                    onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DSA, DP, Graphs, Solved, MidSem"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">File Document or Shared Link</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="file"
                    className="form-input"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Or paste public Google Drive / Notion / PDF link"
                    value={uploadForm.fileUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="Summarize key topics covered..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: '100%', marginTop: '0.6rem', padding: '0.8rem' }}
              >
                {submitting ? 'Publishing to Vault...' : <><Upload size={16} /> Publish Resource</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
