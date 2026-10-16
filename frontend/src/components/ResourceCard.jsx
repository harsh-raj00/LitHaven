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
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Top Meta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.9rem'
        }}
      >
        <span
          className="badge"
          style={{
            background: `${getFileTypeColor(resource.fileType)}18`,
            color: getFileTypeColor(resource.fileType),
            border: `1px solid ${getFileTypeColor(resource.fileType)}40`,
            textTransform: 'none'
          }}
        >
          <FileText size={13} /> {resource.fileType}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {resource.fileSize}
        </span>
      </div>

      {/* Title & Subject */}
      <h3
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.4rem',
          lineHeight: 1.4,
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
          color: 'var(--primary-light)',
          fontWeight: 600,
          marginBottom: '0.6rem'
        }}
      >
        {resource.subject} • {resource.semester}
      </div>

      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1rem',
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem' }}>
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px'
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
          paddingTop: '0.9rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <img
            src={
              resource.uploader?.avatar ||
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resource.uploader?.name || 'Student')}`
            }
            alt={resource.uploader?.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{resource.uploader?.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {resource.uploader?.college}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownload}
          disabled={downloading}
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
        >
          {downloading ? (
            <>
              <Check size={14} /> Saved
            </>
          ) : (
            <>
              <Download size={14} /> {downloadCount}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
