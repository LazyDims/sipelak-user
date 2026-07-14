import React from 'react';
import { Landmark, ArrowUp } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: 'home' | 'form') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  
  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="container footer-grid">
        {/* Col 1: About */}
        <div className="footer-col-about">
          <div className="footer-logo">
            <div className="logo-icon white">
              <Landmark size={22} className="text-primary" />
            </div>
            <span className="logo-title">SIPELAK</span>
          </div>
          <p className="footer-desc">
            Sistem Informasi Pelayanan Administrasi Kecamatan Cerdas. Komitmen mewujudkan pelayanan publik yang cepat, mudah, transparan, dan bebas pungli bagi seluruh lapisan masyarakat.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col-links">
          <h4>Navigasi</h4>
          <ul>
            <li><a href="#home" onClick={(e) => handleNavClick('home', e)}>Beranda</a></li>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Layanan</a></li>
            <li><a href="#alur" onClick={(e) => handleNavClick('alur', e)}>Alur Pengajuan</a></li>
            <li><a href="#statistik" onClick={(e) => handleNavClick('statistik', e)}>Statistik</a></li>
            <li><a href="#faq" onClick={(e) => handleNavClick('faq', e)}>FAQ</a></li>
            <li><a href="#kontak" onClick={(e) => handleNavClick('kontak', e)}>Kontak</a></li>
          </ul>
        </div>

        {/* Col 3: Services Shortlist */}
        <div className="footer-col-links">
          <h4>Layanan Utama</h4>
          <ul>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Kartu Tanda Penduduk (KTP)</a></li>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Kartu Keluarga (KK)</a></li>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Kartu Identitas Anak (KIA)</a></li>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Surat Keterangan Usaha (SKU)</a></li>
            <li><a href="#layanan" onClick={(e) => handleNavClick('layanan', e)}>Surat Keterangan Tidak Mampu (SKTM)</a></li>
          </ul>
        </div>

        {/* Col 4: Contact Hours */}
        <div className="footer-col-hours">
          <h4>Jam Layanan Fisik</h4>
          <p className="hours-row"><strong>Senin - Kamis:</strong> 08:00 - 15:30 WIB</p>
          <p className="hours-row"><strong>Jumat:</strong> 08:00 - 15:00 WIB</p>
          <p className="hours-row"><strong>Sabtu - Minggu:</strong> Libur</p>
          <p className="hours-callout">Pelayanan online SIPELAK dapat diakses 24 jam untuk pengajuan berkas kependudukan.</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} SIPELAK Kecamatan Cerdas. All rights reserved. 
          </p>
          <button className="btn-back-to-top" onClick={handleScrollToTop} aria-label="Scroll ke atas">
            <span>Kembali ke Atas</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
