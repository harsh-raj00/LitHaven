import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ResourceCard } from '../components/ResourceCard';
import {
  FileText,
  Upload,
  Search,
  X,
  FolderOpen,
  Sparkles,
  BookOpen,
  GraduationCap,
  DownloadCloud,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const INITIAL_RESOURCES = [
  {
    _id: 'vault-1',
    title: 'GATE CS & IT Previous 12-Year Chapter-wise Solved Question Bank',
    description: 'Practice previous-year questions covering algorithms, operating systems, databases, and networks.',
    category: 'Competitive Exams',
    fileType: 'Question Paper',
    subject: 'Computer Science & Engineering',
    semester: 'GATE / PSU Prep',
    fileUrl: '/notes/gate_cs_solved_papers.pdf',
    fileName: 'gate_cs_it_12yr_solved_papers.pdf',
    fileSize: '6.4 MB',
    tags: ['GATE', 'ComputerScience', 'SolvedPapers', 'Algorithms', 'DBMS'],
    downloadCount: 1820,
    upvotes: 230
  },
  {
    _id: 'vault-2',
    title: 'Quantitative Aptitude & Speed Math Formulas for Placements & CAT',
    description: 'Revise percentages, profit and loss, time and work, and essential mental math shortcuts.',
    category: 'Competitive Exams',
    fileType: 'Cheat Sheet',
    subject: 'Quantitative Aptitude & Mental Math',
    semester: 'Placement Season',
    fileUrl: '/notes/quantitative_aptitude_speed_math.pdf',
    fileName: 'quant_speed_math_shortcuts.pdf',
    fileSize: '2.9 MB',
    tags: ['Aptitude', 'CAT', 'Placements', 'Shortcuts', 'SpeedMath'],
    downloadCount: 1610,
    upvotes: 198
  },
  {
    _id: 'vault-3',
    title: 'DSA & LeetCode 150 Patterns Master Revision Sheet',
    description: 'Understand arrays, trees, graphs, sliding windows, recursion, and dynamic programming.',
    category: 'Computer Science & AI',
    fileType: 'Cheat Sheet',
    subject: 'Data Structures & Algorithms',
    semester: 'Placements & Semester 4',
    fileUrl: '/notes/dsa_leetcode_150_cheatsheet.pdf',
    fileName: 'dsa_leetcode150_patterns_master_sheet.pdf',
    fileSize: '3.8 MB',
    tags: ['DSA', 'LeetCode150', 'Algorithms', 'InterviewPrep'],
    downloadCount: 1420,
    upvotes: 185
  },
  {
    _id: 'vault-4',
    title: 'Operating Systems & DBMS Core Technical Interview Capsule',
    description: 'High-yield technical interview preparation notes. Covers thread vs process, deadlocks prevention, paging & segmentation, B-Tree vs B+ Tree indexes, ACID properties, normalization forms, and SQL transaction isolation.',
    category: 'Interview Preparation & Coding',
    fileType: 'Cheat Sheet',
    subject: 'Operating Systems & Database Systems',
    semester: 'Placements Season',
    fileUrl: '/notes/operating_systems_dbms_capsule.pdf',
    fileName: 'os_dbms_interview_capsule.pdf',
    fileSize: '3.4 MB',
    tags: ['OperatingSystems', 'DBMS', 'SQL', 'InterviewPrep', 'CoreCS'],
    downloadCount: 1340,
    upvotes: 172
  },
  {
    _id: 'vault-5',
    title: 'System Design & High-Level Architecture (HLD) Interview Handbook',
    description: 'Comprehensive blueprint covering horizontal vs vertical scaling, load balancers, caching layers (Redis), DB sharding, CAP theorem, and concrete designs for TinyURL, Rate Limiter, and Notification System.',
    category: 'Software Development & Web',
    fileType: 'Notes',
    subject: 'Distributed Systems & System Design',
    semester: 'Placements & Semester 6',
    fileUrl: '/notes/system_design_hld_handbook.pdf',
    fileName: 'system_design_hld_interview_handbook.pdf',
    fileSize: '5.6 MB',
    tags: ['SystemDesign', 'DistributedSystems', 'Microservices', 'HLD'],
    downloadCount: 1280,
    upvotes: 164
  },
  {
    _id: 'vault-6',
    title: 'Machine Learning & Deep Learning Mathematics Formula Capsule',
    description: 'Step-by-step mathematical summary of Gradient Descent variants (Adam, RMSProp), Backpropagation matrix calculus, Cross-Entropy loss, Attention mechanism derivations, and CNN kernel mechanics.',
    category: 'Machine Learning & AI',
    fileType: 'Cheat Sheet',
    subject: 'Mathematical Foundations of ML & DL',
    semester: 'Semester 5 & 6',
    fileUrl: '/notes/machine_learning_math_formulas.pdf',
    fileName: 'ml_dl_math_formula_capsule.pdf',
    fileSize: '4.2 MB',
    tags: ['MachineLearning', 'Backprop', 'LinearAlgebra', 'PyTorch'],
    downloadCount: 1150,
    upvotes: 142
  },
  {
    _id: 'vault-7',
    title: 'Full-Stack Web Development Architecture & React 19 Reference',
    description: 'Production best practices for modern web apps. Covers React Server Components, custom hooks design, Next.js / Vite pipelines, REST & GraphQL API design, JWT auth security, and state management patterns.',
    category: 'Software Development & Web',
    fileType: 'Notes',
    subject: 'Full-Stack Web Engineering',
    semester: 'Semester 4 & 5',
    fileUrl: '/notes/fullstack_react19_architecture.pdf',
    fileName: 'fullstack_react19_architecture_guide.pdf',
    fileSize: '4.7 MB',
    tags: ['React', 'NodeJS', 'FullStack', 'WebDev', 'APIDesign'],
    downloadCount: 961,
    upvotes: 118
  },
  {
    _id: 'vault-8',
    title: 'Transformer Attention Mechanisms & Vector Embeddings Deep Dive',
    description: 'Step-by-step breakdown of Multi-Head Self-Attention, FlashAttention algorithms, Rotary Position Embeddings (RoPE), and vector database similarity search with hands-on PyTorch implementations.',
    category: 'Machine Learning & AI',
    fileType: 'Notes',
    subject: 'Deep Learning & NLP',
    semester: 'Semester 5 & 6',
    fileUrl: '/notes/machine_learning_math_formulas.pdf',
    fileName: 'transformer_attention_mechanisms_guide.pdf',
    fileSize: '5.2 MB',
    tags: ['Transformers', 'PyTorch', 'Attention', 'LLMs'],
    downloadCount: 890,
    upvotes: 124
  }
];

export const StudyVaultPage = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Resources');
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

  const categories = [
    'All Resources',
    'Competitive Exams',
    'CS & Algorithms',
    'Interview Prep',
    'Machine Learning'
  ];

  const fetchResources = async () => {
    try {
      const data = await api.resources.getAll({ limit: 20 });
      if (data?.success && Array.isArray(data.resources) && data.resources.length > 0) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error('Failed to load study resources:', err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

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
      } else {
        formData.append('fileUrl', uploadForm.fileUrl || '/notes/dsa_leetcode_150_cheatsheet.pdf');
      }

      const data = await api.resources.create(formData);
      if (data.success) {
        showToast('Study guide uploaded successfully!', 'success');
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
      showToast(err.message || 'Failed to upload notes', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter resources by active category & search query
  const displayedResources = resources.filter((res) => {
    // 1. Category Filter
    if (activeCategory !== 'All Resources') {
      const cat = res.category || '';
      const title = res.title || '';
      if (activeCategory === 'Competitive Exams') {
        if (!cat.includes('Competitive') && !title.includes('GATE') && !title.includes('Quantitative')) return false;
      } else if (activeCategory === 'CS & Algorithms') {
        if (!cat.includes('Computer Science') && !title.includes('DSA') && !title.includes('Operating')) return false;
      } else if (activeCategory === 'Interview Prep') {
        if (!cat.includes('Interview') && !cat.includes('Software Development') && !title.includes('System Design') && !title.includes('Operating')) return false;
      } else if (activeCategory === 'Machine Learning') {
        if (!cat.includes('Machine Learning') && !title.includes('ML') && !title.includes('Transformer')) return false;
      }
    }

    // 2. Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = res.title?.toLowerCase().includes(q);
      const matchSubject = res.subject?.toLowerCase().includes(q);
      const matchDesc = res.description?.toLowerCase().includes(q);
      const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSubject || matchDesc || matchTags;
    }

    return true;
  });

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="content-wrapper">
        {/* Page Header (Matches Reference Screenshot 2) */}
        <div className="vault-page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="vault-eyebrow">
                CAMPUS STUDY VAULT
              </div>
              <h1 className="vault-page-title">
                Study Vault & Notes
              </h1>
              <p className="vault-page-subtitle">
                Revision notes, solved papers, and coding resources in one place.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!isAuthenticated) openAuthModal('login');
                else setUploadModalOpen(true);
              }}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                padding: '0.45rem 1rem',
                marginTop: '0.5rem'
              }}
            >
              <Upload size={14} /> Share Notes
            </button>
          </div>
        </div>

        {/* Pill-shaped Category Filters (Matches Screenshot 2) */}
        <div className="vault-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`vault-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Wide Rounded Search Bar (Matches Screenshot 2) */}
        <div className="vault-search-bar">
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            className="vault-search-input"
            placeholder="Search notes, subjects, or exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Responsive Three-Column Grid of White Resource Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.94rem' }}>Retrieving verified academic guides...</div>
          </div>
        ) : displayedResources.length === 0 ? (
          <div className="study-vault-empty-state">
            <FolderOpen size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              No study materials found
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              No resources matched your search "{search}". Try clearing your search or switching category filters.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setActiveCategory('All Resources');
                setSearch('');
              }}
            >
              Reset Filters
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

      {/* Upload Resource Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '580px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setUploadModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ fontSize: '0.72rem', color: 'var(--accent-terracotta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
              SCHOLAR CONTRIBUTION
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Share Study Notes & Formula Sheets
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Help campus peers learn. Upload high-yield cheatsheets, semester summaries, or solved question papers.
            </p>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems End-Sem Solved Papers & Process Scheduling"
                  className="form-input"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Document Type</label>
                  <select
                    className="form-select"
                    value={uploadForm.fileType}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                  >
                    <option>Cheat Sheet</option>
                    <option>Notes</option>
                    <option>Question Paper</option>
                    <option>Presentation</option>
                    <option>Assignment</option>
                    <option>Solution</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Category</label>
                  <select
                    className="form-select"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    <option>Computer Science & AI</option>
                    <option>Machine Learning & AI</option>
                    <option>Software Development & Web</option>
                    <option>Interview Preparation & Coding</option>
                    <option>Competitive Exams</option>
                    <option>Engineering & Technology</option>
                    <option>Commerce, Finance & MBA</option>
                    <option>Medical & Healthcare</option>
                    <option>Natural Sciences & Math</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject / Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 301: Distributed Systems"
                    className="form-input"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Semester / Target Year</label>
                  <input
                    type="text"
                    placeholder="e.g. Semester 5 or GATE 2026"
                    className="form-input"
                    value={uploadForm.semester}
                    onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Summary & Topics Covered</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Summarize key formulas, algorithms, or past year exam patterns included..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Deadlocks, Semaphores, TopperVerified, EndSem"
                  className="form-input"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attach PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="form-input"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ padding: '0.45rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Accepts PDF files up to 25 MB. If left empty, a verified sample PDF will be linked.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={submitting}
                >
                  {submitting ? 'Uploading...' : 'Publish to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
