import React from 'react';
import { Layers, CheckCircle2, Clock, ThumbsUp } from 'lucide-react';

export const Statistik: React.FC = () => {
  const stats = [
    {
      id: 1,
      value: '14,825',
      label: 'Total Pengajuan',
      desc: 'Dokumen masuk terhitung sejak awal tahun',
      icon: <Layers size={32} className="stat-card-icon text-primary" />,
      colorClass: 'blue'
    },
    {
      id: 2,
      value: '14,562',
      label: 'Selesai Diproses',
      desc: 'Dokumen berhasil diterbitkan & diserahkan',
      icon: <CheckCircle2 size={32} className="stat-card-icon text-success" />,
      colorClass: 'green'
    },
    {
      id: 3,
      value: '24 Jam',
      label: 'Rata-rata Waktu Proses',
      desc: 'Lebih cepat dibanding pengurusan konvensional',
      icon: <Clock size={32} className="stat-card-icon text-warning" />,
      colorClass: 'yellow'
    },
    {
      id: 4,
      value: '98.6%',
      label: 'Kepuasan Warga (IKM)',
      desc: 'Berdasarkan survei kepuasan pelayanan online',
      icon: <ThumbsUp size={32} className="stat-card-icon text-info" />,
      colorClass: 'teal'
    }
  ];

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
            <div key={stat.id} className={`stat-card stat-card-${stat.colorClass}`}>
              <div className="stat-icon-container">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.value}</div>
              <h3 className="stat-label">{stat.label}</h3>
              <p className="stat-desc">{stat.desc}</p>
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
