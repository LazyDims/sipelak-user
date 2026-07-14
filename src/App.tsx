import { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Layanan } from './components/Layanan';
import { Alur } from './components/Alur';
import { Statistik } from './components/Statistik';
import { Berita } from './components/Berita';
import { FAQ } from './components/FAQ';
import { Kontak } from './components/Kontak';
import { Footer } from './components/Footer';
import { FormPengajuan } from './components/FormPengajuan';
import { TrackingModal } from './components/TrackingModal';
import type { SubmittedDoc } from './components/TrackingModal';
import { Auth } from './components/Auth';
import { SuratSaya } from './components/SuratSaya';
import { apiService, isSupabaseConfigured } from './lib/supabaseService';
import type { UserProfile } from './lib/supabaseService';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'form' | 'surat' | 'auth'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Tracking search state
  const [searchCode, setSearchCode] = useState<string>('');
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);

  // Submitted documents cache for anonymous tracking (will merge local submissions)
  const [submittedDocs, setSubmittedDocs] = useState<SubmittedDoc[]>([
    {
      code: 'SPLK-98234',
      nik: '3273012345670001',
      nama: 'Budi Santoso',
      serviceTitle: 'Kartu Tanda Penduduk (KTP-el)',
      date: '10 Juli 2026, 09:15 WIB',
      status: 'Siap Diambil',
      statusDetail: 'KTP-el fisik Anda telah selesai dicetak dan divalidasi. Silakan datang ke kantor kecamatan dan mengambilnya di loket pelayanan Nomor 3 dengan membawa Kartu Keluarga (KK) asli sebagai bukti verifikasi.'
    },
    {
      code: 'SPLK-12403',
      nik: '3273017654320002',
      nama: 'Siti Aminah',
      serviceTitle: 'Kartu Keluarga (KK)',
      date: '11 Juli 2026, 08:30 WIB',
      status: 'Sedang Diproses',
      statusDetail: 'Dokumen pengajuan Kartu Keluarga Anda telah berhasil diverifikasi lengkap oleh petugas. Saat ini data sedang dalam proses penerbitan Tanda Tangan Elektronik (TTE) resmi oleh Kepala Kantor Kecamatan.'
    },
    {
      code: 'SPLK-87291',
      nik: '3273011122330003',
      nama: 'Joko Susilo',
      serviceTitle: 'Surat Keterangan Tidak Mampu (SKTM)',
      date: '08 Juli 2026, 14:20 WIB',
      status: 'Ditolak',
      statusDetail: 'Pengajuan ditolak karena foto Surat Pernyataan Miskin yang dilampirkan tidak ditandatangani oleh Ketua RT/RW setempat. Silakan ajukan ulang berkas Anda dengan tanda tangan yang lengkap.'
    }
  ]);

  // Check user session on mount
  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await apiService.auth.getCurrentUser();
      setUser(currentUser);
    };
    checkSession();
  }, []);

  const handleSearchStatus = async (code: string) => {
    setSearchCode(code);
    setIsTrackingOpen(true);

    try {
      const { data } = await apiService.pengajuan.getByCode(code);
      if (data) {
        const dateString = new Date(data.created_at).toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB';

        const newDoc: SubmittedDoc = {
          code: data.code,
          nik: data.nik,
          nama: data.nama,
          serviceTitle: data.service_title,
          date: dateString,
          status: data.status,
          statusDetail: data.status_detail
        };

        setSubmittedDocs(prev => {
          const index = prev.findIndex(d => d.code.toLowerCase() === code.trim().toLowerCase());
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = newDoc;
            return copy;
          } else {
            return [newDoc, ...prev];
          }
        });
      }
    } catch (err) {
      console.warn("Unable to fetch live submission tracking status:", err);
    }
  };

  const handleAddSubmittedDoc = (newDoc: any) => {
    // Add to local submitted docs cache
    setSubmittedDocs(prev => [newDoc, ...prev]);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    // If a service was pre-selected, go to form page, otherwise go to home page
    if (selectedServiceId) {
      setCurrentPage('form');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => {
    await apiService.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  // Navigational wrapper to intercept anonymous applications
  const handlePageRedirect = (page: 'home' | 'form') => {
    if (page === 'form') {
      if (user) {
        setCurrentPage('form');
      } else {
        setCurrentPage('auth');
      }
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setSelectedServiceId={setSelectedServiceId}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Show configuration notice banner (optional info only) */}
      {!isSupabaseConfigured && currentPage === 'home' && (
        <div style={{ backgroundColor: '#fff3cd', color: '#664d03', padding: '10px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid #ffe69c', position: 'relative', zIndex: 100, marginTop: '80px' }} className="no-print">
          ℹ️ Mode Demonstrasi Aktif (Data disimpan di database bersama admin).
        </div>
      )}

      {currentPage === 'home' && (
        <>
          <Hero 
            setCurrentPage={handlePageRedirect} 
            onSearchStatus={handleSearchStatus} 
          />
          <Layanan 
            setCurrentPage={handlePageRedirect} 
            setSelectedServiceId={setSelectedServiceId} 
          />
          <Alur />
          <Statistik />
          <Berita />
          <FAQ />
          <Kontak />
        </>
      )}

      {currentPage === 'form' && (
        <FormPengajuan 
          selectedServiceId={selectedServiceId} 
          setCurrentPage={setCurrentPage}
          onAddSubmittedDoc={handleAddSubmittedDoc}
          user={user}
        />
      )}

      {currentPage === 'auth' && (
        <Auth 
          onLoginSuccess={handleLoginSuccess}
          onGoBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'surat' && user && (
        <SuratSaya 
          user={user}
          setCurrentPage={setCurrentPage}
        />
      )}

      <Footer setCurrentPage={setCurrentPage} />

      {/* Tracking Status Modal Overlay (combines local submitted docs cache and Supabase backend queries) */}
      <TrackingModal 
        isOpen={isTrackingOpen} 
        onClose={() => setIsTrackingOpen(false)} 
        searchCode={searchCode}
        submittedDocs={submittedDocs}
      />
    </>
  );
}

export default App;
