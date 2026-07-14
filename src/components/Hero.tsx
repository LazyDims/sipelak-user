import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface HeroProps {
  setCurrentPage: (page: 'home' | 'form') => void;
  onSearchStatus: (code: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentPage, onSearchStatus }) => {
  const [statusCode, setStatusCode] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusCode.trim()) {
      onSearchStatus(statusCode.trim());
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-accent"></div>
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>Resmi & 100% Gratis</span>
          </div>
          <h1 className="hero-title">
            Layanan Administrasi Kecamatan Dalam <span className="text-gradient">Satu Genggaman</span>
          </h1>
          <p className="hero-desc">
            SIPELAK hadir memberikan kemudahan bagi warga dalam mengajukan dan mengurus berbagai dokumen kependudukan secara online, cepat, dan transparan tanpa harus antre di kantor kecamatan.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => { setCurrentPage('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Ajukan Sekarang
              <FileText size={18} />
            </button>
            <a href="#layanan" className="btn btn-secondary btn-lg">
              Lihat Layanan
            </a>
          </div>

          {/* Quick Tracking Widget */}
          <div className="tracking-widget">
            <h3 className="tracking-title">Lacak Status Pengajuan</h3>
            <form onSubmit={handleSearchSubmit} className="tracking-form">
              <div className="tracking-input-wrapper">
                <Search className="tracking-icon" size={18} />
                <input
                  type="text"
                  placeholder="Masukkan Kode Pengajuan (Contoh: SPLK-98234)"
                  value={statusCode}
                  onChange={(e) => setStatusCode(e.target.value)}
                  className="tracking-input"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-tracking-submit">
                Cari
              </button>
            </form>
          </div>
        </div>

        {/* Hero Decorative Illustration */}
        <div className="hero-visual">
          <div className="visual-wrapper">
            <div className="glow-sphere"></div>
            
            {/* Mock Dashboard App Preview Card */}
            <div className="preview-card main-card animate-float">
              <div className="card-header">
                <span className="card-dot red"></span>
                <span className="card-dot yellow"></span>
                <span className="card-dot green"></span>
                <span className="card-header-title">SIPELAK Online</span>
              </div>
              <div className="card-body">
                <div className="card-stat-row">
                  <div className="card-mini-stat">
                    <div className="stat-circle blue">
                      <FileText size={16} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Pengajuan Baru</span>
                      <span className="stat-value">25</span>
                    </div>
                  </div>
                  <div className="card-mini-stat">
                    <div className="stat-circle green">
                      <CheckCircle size={16} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Selesai Hari Ini</span>
                      <span className="stat-value">18</span>
                    </div>
                  </div>
                </div>

                <div className="card-list">
                  <span className="list-title">Aktivitas Terkini</span>
                  <div className="list-item">
                    <div className="item-indicator done"></div>
                    <div className="item-text">
                      <p className="item-name">KTP-el - Budi Santoso</p>
                      <p className="item-time">Selesai diproses • 5m yang lalu</p>
                    </div>
                  </div>
                  <div className="list-item">
                    <div className="item-indicator pending"></div>
                    <div className="item-text">
                      <p className="item-name">Kartu Keluarga - Siti Aminah</p>
                      <p className="item-time">Sedang diverifikasi • 15m yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Float Cards */}
            <div className="floating-card float-left">
              <div className="float-icon-wrapper blue">
                <Clock size={20} />
              </div>
              <div className="float-text">
                <strong>Proses 1 Hari</strong>
                <span>Cepat & Tepat Waktu</span>
              </div>
            </div>

            <div className="floating-card float-right">
              <div className="float-icon-wrapper green">
                <ShieldCheck size={20} />
              </div>
              <div className="float-text">
                <strong>Data Terenkripsi</strong>
                <span>Aman & Rahasia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
