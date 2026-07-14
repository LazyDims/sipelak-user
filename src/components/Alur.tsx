import React from 'react';
import { Search, Edit3, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Alur: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pilih Layanan',
      desc: 'Tentukan jenis administrasi yang Anda butuhkan, baca persyaratannya, lalu klik tombol Ajukan Sekarang.',
      icon: <Search size={24} className="text-primary" />
    },
    {
      number: '02',
      title: 'Isi Data & Unggah',
      desc: 'Lengkapi formulir online dengan data diri Anda yang valid, dan unggah foto/scan dokumen persyaratan yang diminta.',
      icon: <Edit3 size={24} className="text-primary" />
    },
    {
      number: '03',
      title: 'Verifikasi Petugas',
      desc: 'Petugas kecamatan akan memverifikasi berkas Anda secara online. Jika ada kekurangan, Anda akan langsung dihubungi.',
      icon: <ShieldAlert size={24} className="text-primary" />
    },
    {
      number: '04',
      title: 'Selesai & Ambil',
      desc: 'Setelah dokumen selesai diproses, Anda akan menerima notifikasi untuk mengunduh dokumen atau mengambilnya di kantor.',
      icon: <CheckCircle2 size={24} className="text-primary" />
    }
  ];

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
          {/* Connector Line for Desktop */}
          <div className="alur-line"></div>

          {steps.map((step, index) => (
            <div key={index} className="alur-card-wrapper">
              <div className="alur-card">
                <div className="alur-icon-outer animate-pulse-slow">
                  <div className="alur-icon-inner">
                    {step.icon}
                  </div>
                  <span className="alur-number">{step.number}</span>
                </div>
                <h3 className="alur-step-title">{step.title}</h3>
                <p className="alur-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
