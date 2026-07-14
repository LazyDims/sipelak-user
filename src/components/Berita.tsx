import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { apiService } from '../lib/supabaseService';
import type { NewsItem } from '../lib/supabaseService';

export const Berita: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await apiService.news.getAll();
        if (data && data.length > 0) {
          setNews(data);
        }
      } catch (e) {
        console.error("Error loading news:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return isoString;
    }
  };

  // Only render section if we have news or if it's loading
  if (!loading && news.length === 0) return null;

  return (
    <section id="berita" className="section-bg-white" style={{ padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Informasi Terkini</span>
          <h2 className="section-title">Berita & Pengumuman</h2>
          <p className="section-desc">
            Ikuti berita terbaru, pengumuman resmi, dan dokumentasi kegiatan pelayanan di wilayah Kecamatan Cerdas.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>Memuat berita...</p>
          </div>
        ) : (
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', marginTop: '40px' }}>
            {news.map((item) => (
              <div 
                key={item.id} 
                className="news-card" 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* News Image Placeholder with nice blue gradient */}
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#fff',
                  position: 'relative'
                }}>
                  <Newspaper size={48} style={{ opacity: 0.3 }} />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '16px', 
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#1e3a8a',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {item.category}
                  </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <Calendar size={14} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', lineHeight: 1.4, height: '50px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6, flexGrow: 1, height: '72px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {item.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: 600, color: '#2563eb', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto' }}>
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
