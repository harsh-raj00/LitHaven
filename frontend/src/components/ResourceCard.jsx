import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Download,
  Check,
  Heart,
  Eye,
  X,
  GraduationCap,
  Sparkles,
  Share2,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const ResourceCard = ({ resource }) => {
  const [downloadCount, setDownloadCount] = useState(resource.downloadCount || 0);

  const getInitialLiked = () => {
    try {
      const raw = localStorage.getItem('lithaven_liked_resources');
      const likedList = raw ? JSON.parse(raw) : [];
      return likedList.includes(resource._id);
    } catch (e) {
      return false;
    }
  };

  const [isLiked, setIsLiked] = useState(getInitialLiked);
  const [upvotes, setUpvotes] = useState(resource.upvotes || 0);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { showToast } = useToast();

  const categoryColor = 'var(--accent-terracotta)';

  const getResourcePdfUrl = () => {
    if (resource.fileUrl) return resource.fileUrl;
    const t = (resource.title || '').toLowerCase();
    if (t.includes('dsa') || t.includes('leetcode')) return '/notes/dsa_leetcode_150_cheatsheet.pdf';
    if (t.includes('gate')) return '/notes/gate_cs_solved_question_bank.pdf';
    if (t.includes('aptitude') || t.includes('quantitative')) return '/notes/quantitative_aptitude_speed_math.pdf';
    if (t.includes('operating') || t.includes('dbms')) return '/notes/operating_systems_dbms_capsule.pdf';
    if (t.includes('machine learning') || t.includes('ml')) return '/notes/machine_learning_math_formulas.pdf';
    if (t.includes('system design')) return '/notes/system_design_hld_handbook.pdf';
    if (t.includes('full-stack') || t.includes('web')) return '/notes/fullstack_react19_architecture.pdf';
    if (t.includes('transformer')) return '/notes/machine_learning_math_formulas.pdf';
    return '/notes/dsa_leetcode_150_cheatsheet.pdf';
  };

  const handleLikeToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextLiked = !isLiked;
    const nextUpvotes = Math.max(0, upvotes + (nextLiked ? 1 : -1));

    // Optimistic UI updates
    setIsLiked(nextLiked);
    setUpvotes(nextUpvotes);

    // Persist in localStorage
    try {
      const raw = localStorage.getItem('lithaven_liked_resources');
      const likedList = raw ? JSON.parse(raw) : [];
      let updatedList;
      if (nextLiked) {
        updatedList = Array.from(new Set([...likedList, resource._id]));
      } else {
        updatedList = likedList.filter((id) => id !== resource._id);
      }
      localStorage.setItem('lithaven_liked_resources', JSON.stringify(updatedList));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    showToast(nextLiked ? `Added to liked resources` : `Removed like`, 'info');

    // Sync with backend API
    try {
      const res = await api.resources.toggleLike(resource._id, isLiked, upvotes);
      if (res && typeof res.upvotes === 'number') {
        setUpvotes(res.upvotes);
      }
    } catch (err) {
      console.warn('Like sync error:', err);
    }
  };

  const handleDownload = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDownloading(true);
    const pdfUrl = getResourcePdfUrl();
    const downloadName = resource.fileName || `${(resource.title || 'study_notes').toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;

    try {
      const data = await api.resources.download(resource._id);
      if (data && data.success) {
        setDownloadCount(data.downloadCount || (downloadCount + 1));
      } else {
        setDownloadCount((prev) => prev + 1);
      }
      showToast(`Downloading "${getDisplayTitle()}"...`, 'success');

      // Trigger browser download
      const link = document.createElement('a');
      link.href = data?.downloadUrl || pdfUrl;
      link.download = downloadName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setDownloadCount((prev) => prev + 1);
      showToast(`Downloading "${getDisplayTitle()}"...`, 'success');
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = downloadName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const getCategoryLabel = () => {
    const t = resource.title || '';
    const cat = resource.category || '';
    if (t.includes('GATE CS & IT')) return 'COMPETITIVE EXAMS • PDF';
    if (t.includes('Quantitative Aptitude')) return 'COMPETITIVE EXAMS • PDF';
    if (t.includes('DSA & LeetCode') || t.includes('DSA Revision')) return 'CS & ALGORITHMS • NOTES';
    if (t.includes('Operating Systems & DBMS')) return 'INTERVIEW PREP • NOTES';
    if (t.includes('Machine Learning & Deep Learning Mathematics') || t.includes('ML Mathematics')) return 'MACHINE LEARNING • NOTES';
    if (t.includes('System Design')) return 'INTERVIEW PREP • HANDBOOK';
    if (t.includes('Full-Stack Web')) return 'WEB DEV • REFERENCE';
    if (t.includes('Transformer Attention')) return 'MACHINE LEARNING • NOTES';

    const fileType = resource.fileType?.toUpperCase() || 'NOTES';
    if (cat.includes('Competitive')) return `COMPETITIVE EXAMS • ${fileType === 'QUESTION PAPER' ? 'PDF' : fileType}`;
    if (cat.includes('Machine Learning')) return `MACHINE LEARNING • ${fileType}`;
    if (cat.includes('Interview')) return `INTERVIEW PREP • ${fileType}`;
    if (cat.includes('Software Development')) return `INTERVIEW PREP • HANDBOOK`;
    if (cat.includes('Computer Science')) return `CS & ALGORITHMS • ${fileType}`;
    return `${cat.toUpperCase()} • ${fileType}`;
  };

  const getDisplayTitle = () => {
    const t = resource.title || '';
    if (t.includes('GATE CS & IT')) return 'GATE CS & IT Question Bank';
    if (t.includes('Quantitative Aptitude')) return 'Quantitative Aptitude Formula Sheet';
    if (t.includes('DSA & LeetCode')) return 'DSA Revision Guide';
    if (t.includes('Operating Systems & DBMS')) return 'Operating Systems & DBMS';
    if (t.includes('Machine Learning & Deep Learning Mathematics')) return 'ML Mathematics Revision';
    if (t.includes('System Design & High-Level Architecture')) return 'System Design Fundamentals';
    if (t.includes('Full-Stack Web Development')) return 'Full-Stack Web Engineering';
    if (t.includes('Transformer Attention Mechanisms')) return 'Transformer Attention Mechanisms';
    return t;
  };

  const getDisplaySubject = () => {
    const t = resource.title || '';
    if (t.includes('GATE CS & IT')) return 'Computer Science • Exam Preparation';
    if (t.includes('Quantitative Aptitude')) return 'Aptitude • Placements & CAT';
    if (t.includes('DSA & LeetCode')) return 'Algorithms • Coding Practice';
    if (t.includes('Operating Systems & DBMS')) return 'Technical Interviews';
    if (t.includes('Machine Learning & Deep Learning Mathematics')) return 'Machine Learning • Deep Learning';
    if (t.includes('System Design & High-Level Architecture')) return 'Software Engineering • Placements';
    if (t.includes('Full-Stack Web Development')) return 'Software Engineering • Web Dev';
    if (t.includes('Transformer Attention Mechanisms')) return 'Deep Learning • Attention Models';
    return `${resource.subject || 'Academic'} • ${resource.semester || 'Notes'}`;
  };

  const getDisplayDesc = () => {
    const t = resource.title || '';
    if (t.includes('GATE CS & IT')) {
      return 'Practice previous-year questions covering algorithms, operating systems, databases, and networks.';
    }
    if (t.includes('Quantitative Aptitude')) {
      return 'Revise percentages, profit and loss, time and work, and essential mental math shortcuts.';
    }
    if (t.includes('DSA & LeetCode')) {
      return 'Understand arrays, trees, graphs, sliding windows, recursion, and dynamic programming.';
    }
    return resource.description;
  };

  return (
    <>
      <div
        className="resource-card"
        onClick={() => setDetailsOpen(true)}
      >
        <div className="resource-card-body-wrap">
          {/* Header row: Category Label + Like Button */}
          <div className="resource-card-header">
            <span className="resource-card-category">
              {getCategoryLabel()}
            </span>

            {/* Like Button (Heart Icon + Counter) */}
            <button
              type="button"
              className={`resource-like-btn ${isLiked ? 'is-liked' : ''}`}
              onClick={handleLikeToggle}
              title={isLiked ? 'Unlike resource' : 'Like resource'}
              aria-label={isLiked ? `Unlike ${getDisplayTitle()}` : `Like ${getDisplayTitle()}`}
            >
              <Heart
                size={14}
                className="resource-heart-icon"
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span className="resource-like-count">{upvotes}</span>
            </button>
          </div>

          {/* Large bold dark serif title */}
          <h3 className="resource-card-title">
            {getDisplayTitle()}
          </h3>

          {/* Course / Subject Subtitle */}
          <div className="resource-card-course">
            {getDisplaySubject()}
          </div>

          {/* Concise Description */}
          <p className="resource-card-desc">
            {getDisplayDesc()}
          </p>
        </div>

        {/* Two Clear Actions: Preview & Download */}
        <div className="resource-card-actions-row">
          <button
            type="button"
            className="resource-btn-preview"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            title="Preview resource before downloading"
            aria-label={`Preview ${getDisplayTitle()}`}
          >
            <Eye size={15} className="resource-action-icon" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            className={`resource-btn-download ${downloading ? 'is-downloading' : ''}`}
            onClick={handleDownload}
            disabled={downloading}
            title="Download PDF resource"
            aria-label={`Download ${getDisplayTitle()}`}
          >
            <Download size={15} className="resource-action-icon" />
            <span>{downloading ? 'Saving...' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* Note Details Modal */}
      {detailsOpen && (
        <div className="modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div
            className="modal-content"
            style={{
              maxWidth: '720px',
              width: '94vw',
              padding: '2.25rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close Note Details"
            >
              <X size={18} />
            </button>

            {/* Header: Badges Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--accent-terracotta)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.22rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em'
                }}
              >
                {getCategoryLabel()}
              </span>

              <span className="badge badge-like-new" style={{ fontSize: '0.74rem' }}>
                <FileText size={12} /> {resource.fileType || 'PDF Document'}
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.74rem',
                  color: 'var(--savings-green)',
                  fontWeight: 600,
                  marginLeft: 'auto'
                }}
              >
                <ShieldCheck size={14} /> Peer Verified Study Guide
              </span>
            </div>

            {/* Note Title */}
            <h2
              className="font-serif-literary"
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--text-primary)',
                marginBottom: '0.45rem'
              }}
            >
              {resource.title}
            </h2>

            {/* Course & Semester info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <GraduationCap size={15} color="var(--accent-terracotta)" />
                <strong>{resource.subject || 'Academic Syllabus'}</strong>
              </span>
              <span>•</span>
              <span>{resource.semester || 'All Semesters'}</span>
              <span>•</span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {resource.fileSize || '3.5 MB'}
              </span>
            </div>

            {/* Note Description / Syllabus Overview */}
            <div
              style={{
                padding: '1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem'
              }}
            >
              <h4
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.55rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Monograph Overview & Syllabus Coverage
              </h4>
              <p style={{ fontSize: '0.94rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                {resource.description}
              </p>
            </div>

            {/* Academic Tags & Topics */}
            {resource.tags && resource.tags.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: '0.6rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Key Concepts & Exam Modules
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {resource.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.25rem 0.65rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contributor Persona & Specifications Grid */}
            <div
              className="resource-contributor-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem'
              }}
            >
              {/* Contributor Info */}
              <div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: '0.65rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Contributor Persona
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={
                      resource.uploader?.avatar ||
                      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resource.uploader?.name || 'Student')}`
                    }
                    alt={resource.uploader?.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {resource.uploader?.name || 'Campus Scholar'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {resource.uploader?.college || 'University Campus'} • {resource.uploader?.department || 'Department'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Metadata Stats */}
              <div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: '0.65rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Archival Telemetry
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>DOWNLOADS</span>
                    <strong className="font-mono" style={{ color: 'var(--savings-green)' }}>{downloadCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>UPVOTES</span>
                    <strong className="font-mono" style={{ color: 'var(--accent-terracotta)' }}>{upvotes}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Preview Content & Download PDF */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDetailsOpen(false);
                  setPreviewOpen(true);
                }}
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <Eye size={16} /> Open Content Preview
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
                disabled={downloading}
                style={{ padding: '0.75rem 1.35rem' }}
              >
                <Download size={16} /> {downloading ? 'Downloading...' : 'Download PDF Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quick Preview Modal with Live PDF Embed */}
      {previewOpen && (
        <div className="modal-overlay" onClick={() => setPreviewOpen(false)}>
          <div
            className="modal-content"
            style={{
              maxWidth: '820px',
              width: '94vw',
              padding: '1.75rem',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'var(--bg-secondary)',
                  color: categoryColor,
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {resource.category}
              </span>
              <span className="badge" style={{ fontSize: '0.74rem' }}>
                <FileText size={12} /> {resource.fileType || 'PDF'}
              </span>
              <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {resource.fileSize || '3.5 MB'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--text-primary)',
                marginBottom: '0.25rem'
              }}
            >
              {resource.title}
            </h2>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Course: <strong style={{ color: 'var(--text-primary)' }}>{resource.subject}</strong> • {resource.semester}
            </div>

            {/* Real PDF Embed Viewer */}
            <div
              className="pdf-preview-embed-wrap"
              style={{
                width: '100%',
                height: '420px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-secondary)',
                marginBottom: '0.85rem',
                position: 'relative'
              }}
            >
              <iframe
                src={`${getResourcePdfUrl()}#toolbar=0&navpanes=0`}
                title={`Preview of ${resource.title}`}
                width="100%"
                height="100%"
                style={{ border: 'none', display: 'block' }}
              />
            </div>

            {/* Document Details & Uploader Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src={
                    resource.uploader?.avatar ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resource.uploader?.name || 'Student')}`
                  }
                  alt={resource.uploader?.name}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {resource.uploader?.name || 'Campus Scholar'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {resource.uploader?.college || 'University Scholar'} • Verified Student
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--savings-green)' }}>
                    {downloadCount}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                    downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <a
                href={getResourcePdfUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <ArrowUpRight size={15} /> Open in New Tab
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + getResourcePdfUrl());
                  showToast('Direct PDF link copied to clipboard!', 'success');
                }}
              >
                <Share2 size={15} /> Share Link
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download size={16} /> {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
