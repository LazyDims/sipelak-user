import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut, FileText } from 'lucide-react';
import type { UserProfile } from '../lib/supabaseService';
import logoSmg from '../assets/logo_smg.png';

interface NavbarProps {
  currentPage: 'home' | 'form' | 'surat' | 'auth';
  setCurrentPage: (page: 'home' | 'form' | 'surat' | 'auth') => void;
  setSelectedServiceId: (id: string | null) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  setSelectedServiceId,
  user,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentPage === 'home') {
        const sections = ['home', 'layanan', 'alur', 'statistik', 'faq', 'kontak'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAjukanClick = () => {
    setIsOpen(false);
    setSelectedServiceId(null);
    if (user) {
      setCurrentPage('form');
    } else {
      setCurrentPage('auth');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuratSayaClick = () => {
    setIsOpen(false);
    if (user) {
      setCurrentPage('surat');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
    setCurrentPage('home');
  };

  const getUserFirstName = () => {
    if (!user) return '';
    return user.nama_lengkap.split(' ')[0];
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} no-print`}>
      <div className="navbar-container container">
        <a href="#home" className="navbar-logo" onClick={handleLogoClick}>
          <img src={logoSmg} alt="Logo Semarang" className="logo-img" />
          <div className="logo-text">
            <span className="logo-title">SIPELAK</span>
            <span className="logo-subtitle">Kecamatan Gayamsari</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-menu-desktop">
          <ul className="navbar-nav">
            <li>
              <a
                href="#home"
                className={`nav-link ${currentPage === 'home' && activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#layanan"
                className={`nav-link ${currentPage === 'home' && activeSection === 'layanan' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('layanan'); }}
              >
                Layanan
              </a>
            </li>
            <li>
              <a
                href="#alur"
                className={`nav-link ${currentPage === 'home' && activeSection === 'alur' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('alur'); }}
              >
                Alur
              </a>
            </li>
            <li>
              <a
                href="#statistik"
                className={`nav-link ${currentPage === 'home' && activeSection === 'statistik' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('statistik'); }}
              >
                Statistik
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className={`nav-link ${currentPage === 'home' && activeSection === 'faq' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#kontak"
                className={`nav-link ${currentPage === 'home' && activeSection === 'kontak' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('kontak'); }}
              >
                Kontak
              </a>
            </li>
            {user && (
              <li>
                <a
                  href="#surat-saya"
                  className={`nav-link ${currentPage === 'surat' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleSuratSayaClick(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)' }}
                >
                  <FileText size={16} />
                  Surat Saya
                </a>
              </li>
            )}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-color)' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <span>Hai, {getUserFirstName()}</span>
                </div>
                <button className="btn btn-light" onClick={handleLogoutClick} style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', gap: '4px' }} title="Keluar Akun">
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary btn-nav" onClick={() => { setCurrentPage('auth'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                Masuk / Daftar
              </button>
            )}
            
            <button className="btn btn-primary btn-nav" onClick={handleAjukanClick}>
              Ajukan Sekarang
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`navbar-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header container">
          <a href="#home" className="navbar-logo" onClick={handleLogoClick}>
            <img src={logoSmg} alt="Logo Semarang" className="logo-img" />
            <div className="logo-text">
              <span className="logo-title">SIPELAK</span>
            </div>
          </a>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="sidebar-body container">
          <ul className="sidebar-nav">
            <li>
              <a
                href="#home"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#layanan"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'layanan' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('layanan'); }}
              >
                Layanan
              </a>
            </li>
            <li>
              <a
                href="#alur"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'alur' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('alur'); }}
              >
                Alur
              </a>
            </li>
            <li>
              <a
                href="#statistik"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'statistik' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('statistik'); }}
              >
                Statistik
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'faq' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#kontak"
                className={`sidebar-link ${currentPage === 'home' && activeSection === 'kontak' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('kontak'); }}
              >
                Kontak
              </a>
            </li>
            {user && (
              <li>
                <a
                  href="#surat-saya"
                  className={`sidebar-link ${currentPage === 'surat' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleSuratSayaClick(); }}
                  style={{ color: 'var(--success-color)' }}
                >
                  Surat Saya
                </a>
              </li>
            )}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <User size={18} className="text-primary" />
                  <span style={{ fontWeight: 600 }}>Hai, {user.nama_lengkap}</span>
                </div>
                <button className="btn btn-light btn-block" onClick={handleLogoutClick}>
                  <LogOut size={16} />
                  Keluar Akun
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary btn-block" onClick={() => { setIsOpen(false); setCurrentPage('auth'); }}>
                Masuk / Daftar
              </button>
            )}
            
            <button className="btn btn-primary btn-block" onClick={handleAjukanClick}>
              Ajukan Sekarang
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </nav>
  );
};
