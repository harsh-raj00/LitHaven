import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FileText, Download, Check, GraduationCap, Tag, Sparkles } from 'lucide-react';

export const ResourceCard = ({ resource }) => {
  const [downloadCount, setDownloadCount] = useState(resource.downloadCount || 0);
  const [downloading, setDownloading] = useState(false);
  const { showToast } = useToast();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const data = await api.resources.download(resource._id);
      if (data.success) {
        setDownloadCount(data.downloadCount);
        showToast(`Downloaded "${resource.title}"`, 'success');

        // Trigger browser download simulation
        const link = document.createElement('a');
        link.href = data.downloadUrl || '/covers/cover_quantum.jpg';
        link.download = resource.fileName || 'study_notes.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'Cheat Sheet':
        return '#f59e0b';
      case 'Question Paper':
        return '#06b6d4';
      case 'Notes':
        return '#818cf8';
      case 'Presentation':
        return '#a855f7';
      default:
        return '#10b981';
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.6rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(10, 14, 24, 0.95) 100%)'
      }}
    >
      {/* Archival Left Accent Border */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          bottom: '16px',
          left: 0,
          width: '3px',
          background: getFileTypeColor(resource.fileType),
          borderRadius: '0 4px 4px 0'
        }}
      />

      {/* Top Meta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}
      >
        <span
          className="badge"
          style={{
            background: `${getFileTypeColor(resource.fileType)}18`,
            color: getFileTypeColor(resource.fileType),
            border: `1px solid ${getFileTypeColor(resource.fileType)}40`,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.72rem'
          }}
        >
          <FileText size={12} /> {resource.fileType}
        </span>
        <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {resource.fileSize}
        </span>
      </div>

      {/* Title & Subject */}
      <h3
        className="font-serif-literary"
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '0.45rem',
          lineHeight: 1.35,
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {resource.title}
      </h3>

      <div
        style={{
          fontSize: '0.82rem',
          color: 'var(--accent-gold)',
          fontWeight: 600,
          marginBottom: '0.7rem'
        }}
      >
        {resource.subject} • {resource.semester}
      </div>

      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          marginBottom: '1.2rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}
      >
        {resource.description}
      </p>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem' }}>
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.74rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.18rem 0.55rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with Uploader & Download Action */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src={
              resource.uploader?.avatar ||
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resource.uploader?.name || 'Student')}`
            }
            alt={resource.uploader?.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-gold)' }}
          />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{resource.uploader?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {resource.uploader?.college}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownload}
          disabled={downloading}
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem', borderRadius: '8px' }}
        >
          {downloading ? (
            <>
              <Check size={14} /> Preserved
            </>
          ) : (
            <>
              <Download size={14} /> <span className="font-mono">{downloadCount}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
