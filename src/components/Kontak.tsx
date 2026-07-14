import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Kontak: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nama && formData.email && formData.pesan) {
      setSubmitted(true);
      setFormData({ nama: '', email: '', pesan: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="kontak" className="kontak-section section-bg-light">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Hubungi Kami</span>
          <h2 className="section-title">Kontak & Lokasi Kantor</h2>
          <p className="section-desc">
            Punya pertanyaan atau masukan? Silakan hubungi kami melalui formulir atau kunjungi kantor kecamatan kami secara langsung.
          </p>
        </div>

        <div className="kontak-grid">
          {/* Contact Details Column */}
          <div className="kontak-info-card">
            <h3>Informasi Kantor Kecamatan</h3>
            <p className="kontak-intro-text">
              Kami siap melayani kebutuhan administrasi Anda secara langsung di kantor pada hari dan jam kerja.
            </p>

            <div className="info-items-list">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div className="info-content">
                  <h4>Alamat Kantor</h4>
                  <p>Jl. Raya Pembangunan No. 45, Komplek Perkantoran Terpadu, Kecamatan Cerdas, Kota Metropolitan, 14045</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Phone size={20} className="text-primary" />
                </div>
                <div className="info-content">
                  <h4>Telepon / WhatsApp</h4>
                  <p>+62 821-3456-7890 (WA Pengaduan)</p>
                  <p>(021) 8299-123 (Telepon Kantor)</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Mail size={20} className="text-primary" />
                </div>
                <div className="info-content">
                  <h4>Email Resmi</h4>
                  <p>kontak@kecamatancerdas.go.id</p>
                  <p>sipelak@kecamatancerdas.go.id</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Clock size={20} className="text-primary" />
                </div>
                <div className="info-content">
                  <h4>Jam Operasional</h4>
                  <p>Senin - Kamis: 08:00 - 15:30 WIB</p>
                  <p>Jumat: 08:00 - 15:00 WIB (Istirahat 11:30 - 13:00 WIB)</p>
                  <p>Sabtu, Minggu & Hari Libur Nasional: Tutup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Map Columns */}
          <div className="kontak-form-map-wrapper">
            {/* Feedback Form */}
            <div className="feedback-card">
              <h3>Kirim Pesan / Pengaduan</h3>
              
              {submitted ? (
                <div className="alert alert-success">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>Pesan Terkirim!</strong> Terima kasih atas masukan Anda. Kami akan segera merespons ke email Anda.
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nama" className="form-label">Nama Lengkap <span>*</span></label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Contoh: Ahmad Subagja"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Alamat Email <span>*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Contoh: ahmad@gmail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pesan" className="form-label">Pesan / Pengaduan <span>*</span></label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    placeholder="Tuliskan pertanyaan, saran, atau aduan Anda secara rinci..."
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Kirim Pesan
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* Stylized Google Map Placeholder */}
            <div className="map-card">
              <div className="map-placeholder">
                <div className="map-pulse-point"></div>
                <div className="map-marker-pin">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div className="map-popup">
                  <strong>Kantor Kecamatan Cerdas</strong>
                  <span>Klik untuk rute Google Maps</span>
                </div>
                <div className="map-grid-layer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
