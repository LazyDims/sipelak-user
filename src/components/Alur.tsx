import React, { useState, useEffect } from 'react';
import { Search, Edit3, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiService } from '../lib/supabaseService';
import type { AlurItem } from '../lib/supabaseService';

export const Alur: React.FC = () => {
  const [steps, setSteps] = useState<AlurItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getIconForAlur = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search size={24} className="text-primary" />;
      case 'Edit3': return <Edit3 size={24} className="text-primary" />;
      case 'ShieldAlert': return <ShieldAlert size={24} className="text-primary" />;
      case 'CheckCircle2': return <CheckCircle2 size={24} className="text-primary" />;
      default: return <Search size={24} className="text-primary" />;
    }
  };

  useEffect(() => {
    const loadAlur = async () => {
      try {
        const { data } = await apiService.alur.getAll();
        if (data && data.length > 0) {
          setSteps(data);
        }
      } catch (e) {
        console.warn("Using offline alur steps");
      } finally {
        setLoading(false);
      }
    };
    loadAlur();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
        Memuat data alur...
      </div>
    );
  }

  return (
    <section id="alur" className="alur-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Alur Kerja</span>
          <h2 className="section-title">Alur Pengajuan Mudah</h2>
          <p className="section-desc">
            Ikuti 4 langkah sederhana berikut untuk menyelesaikan pengurusan dokumen kependudukan Anda secara online tanpa hambatan.
          </p>
        </div>

        <div className="alur-grid">
          <div className="alur-line"></div>

          {steps.map((step, index) => (
            <div key={index} className="alur-card-wrapper">
              <div className="alur-card">
                <div className="alur-icon-outer animate-pulse-slow">
                  <div className="alur-icon-inner">
                    {getIconForAlur(step.icon_name)}
                  </div>
                  <span className="alur-number">{step.step_number}</span>
                </div>
                <h3 className="alur-step-title">{step.title}</h3>
                <p className="alur-step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
