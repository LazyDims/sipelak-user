import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Clock, ThumbsUp } from 'lucide-react';
import { apiService } from '../lib/supabaseService';
import type { StatistikItem } from '../lib/supabaseService';

export const Statistik: React.FC = () => {
  const [stats, setStats] = useState<StatistikItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getIconForStat = (iconName: string, colorClass: string) => {
    const iconColorMap: Record<string, string> = {
      blue: 'text-primary',
      green: 'text-success',
      yellow: 'text-warning',
      teal: 'text-info'
    };
    const colorClassVal = iconColorMap[colorClass] || 'text-primary';

    switch (iconName) {
      case 'Layers': return <Layers size={32} className={`stat-card-icon ${colorClassVal}`} />;
      case 'CheckCircle2': return <CheckCircle2 size={32} className={`stat-card-icon ${colorClassVal}`} />;
      case 'Clock': return <Clock size={32} className={`stat-card-icon ${colorClassVal}`} />;
      case 'ThumbsUp': return <ThumbsUp size={32} className={`stat-card-icon ${colorClassVal}`} />;
      default: return <Layers size={32} className={`stat-card-icon ${colorClassVal}`} />;
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await apiService.statistik.getAll();
        if (data && data.length > 0) {
          setStats(data);
        }
      } catch (e) {
        console.warn("Using offline statistics");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
        Memuat data statistik...
      </div>
    );
  }

  return (
    <section id="statistik" className="statistik-section section-bg-light">
      {/* Decorative background grids */}
      <div className="stats-bg-pattern"></div>
      
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Statistik Pelayanan</span>
          <h2 className="section-title">Kinerja Pelayanan Kami</h2>
          <p className="section-desc">
            Komitmen kami adalah transparansi dan efisiensi. Berikut data pencapaian real-time pelayanan administrasi online SIPELAK.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className={`stat-card stat-card-${stat.color_class}`}>
              <div className="stat-icon-container">
                {getIconForStat(stat.icon_name || stat.label, stat.color_class)}
              </div>
              <div className="stat-number">{stat.value}</div>
              <h3 className="stat-label">{stat.label}</h3>
              <p className="stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Dynamic banner detail */}
        <div className="stats-banner">
          <div className="banner-content">
            <h3>Siap Mengurus Dokumen Anda Secara Online?</h3>
            <p>Hemat waktu, tanpa biaya, aman dari pungli. SIPELAK memberikan kemudahan akses 24/7 dari manapun.</p>
          </div>
          <div className="banner-action">
            <a href="#layanan" className="btn btn-secondary">Pelajari Persyaratan</a>
          </div>
        </div>
      </div>
    </section>
  );
};
