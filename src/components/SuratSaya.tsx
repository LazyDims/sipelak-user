import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Download, ArrowLeft, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { apiService } from '../lib/supabaseService';
import type { PengajuanDocument, UserProfile } from '../lib/supabaseService';

interface SuratSayaProps {
  user: UserProfile;
  setCurrentPage: (page: 'home' | 'form' | 'surat' | 'auth') => void;
}

export const SuratSaya: React.FC<SuratSayaProps> = ({ user, setCurrentPage }) => {
  const [docs, setDocs] = useState<PengajuanDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Printable Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<PengajuanDocument | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: apiErr } = await apiService.pengajuan.getByUser(user.id);
      if (apiErr) {
        setError('Gagal memuat dokumen Anda.');
      } else {
        setDocs(data);
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [user.id]);

  const handlePrint = (doc: PengajuanDocument) => {
    setPreviewDoc(doc);
    // Wait for state update to render modal, then trigger browser print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Verifikasi Berkas': return 'status-badge-inline verifikasi-berkas';
      case 'Sedang Diproses': return 'status-badge-inline sedang-diproses';
      case 'Siap Diambil': return 'status-badge-inline siap-diambil';
      case 'Ditolak': return 'status-badge-inline ditolak';
      default: return 'status-badge-inline';
    }
  };



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

  return (
    <div className="form-page-container container printable-area-parent">
      {/* Hide on print */}
      <div className="no-print">
        <button className="btn-back-home" onClick={() => setCurrentPage('home')}>
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="form-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="form-page-title">Tracking Surat Saya</h1>
            <p className="form-page-desc">
              Pantau status verifikasi pengajuan administrasi Anda dan unduh dokumen yang telah selesai.
            </p>
          </div>
          <button className="btn btn-light" onClick={fetchDocs} style={{ padding: '8px 16px', display: 'flex', gap: '8px', fontSize: '0.88rem' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Perbarui Data
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner-container" style={{ textAlign: 'center', padding: '50px 0' }}>
            <RefreshCw size={40} className="animate-spin text-primary" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px auto' }} />
            <p style={{ color: 'var(--text-muted)' }}>Memuat berkas pengajuan Anda...</p>
          </div>
        ) : docs.length > 0 ? (
          <div className="my-docs-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            {docs.map((doc) => (
              <div key={doc.id} className="my-doc-card" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexGrow: '1' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <FileText size={24} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{doc.service_title}</h3>
                      <span className={getStatusBadgeClass(doc.status)}>{doc.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {formatDate(doc.created_at)}
                      </span>
                      <span>Kode: <strong>{doc.code}</strong></span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-color)', margin: 0, borderLeft: '3px solid var(--border-color)', paddingLeft: '10px', marginTop: '10px' }}>
                      <strong>Detail:</strong> {doc.status_detail}
                    </p>
                  </div>
                </div>

                <div className="doc-actions" style={{ display: 'flex', gap: '12px', flexShrink: 0, width: '100%', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', clear: 'both' }}>
                  {doc.status === 'Siap Diambil' ? (
                    <>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setPreviewDoc(doc)}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <Eye size={16} />
                        Pratinjau Surat
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handlePrint(doc)}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <Download size={16} />
                        Unduh PDF
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-light" disabled style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'not-allowed', color: 'var(--text-muted)' }}>
                      Belum Terverifikasi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '50px 20px' }}>
            <FileText size={48} className="text-muted" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3>Belum Ada Riwayat Pengajuan</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 20px auto' }}>
              Anda belum pernah mengajukan dokumen administrasi melalui akun ini.
            </p>
            <button className="btn btn-primary" onClick={() => setCurrentPage('form')}>
              Mulai Ajukan Sekarang
            </button>
          </div>
        )}
      </div>

      {/* ==========================================================================
         OFFICIAL DOCUMENT PRINT PREVIEW MODAL
         ========================================================================== */}
      {previewDoc && (
        <div className="preview-document-modal-overlay no-print" onClick={() => setPreviewDoc(null)}>
          <div className="preview-document-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-header-title">Pratinjau Surat Terbit</h3>
              <button className="modal-close-btn" onClick={() => setPreviewDoc(null)}>Tutup</button>
            </div>
            
            <div className="modal-body" style={{ overflowY: 'auto', backgroundColor: '#e2e8f0', padding: '24px' }}>
              {/* This represents the visual preview of the paper document */}
              <div className="paper-document-sheet">
                <div className="doc-letterhead">
                  <div className="letterhead-header">
                    <h4>PEMERINTAH KABUPATEN METROPOLITAN</h4>
                    <h3>KANTOR KECAMATAN CERDAS</h3>
                    <p>Jl. Raya Pembangunan No. 45, Komplek Perkantoran Terpadu, Kode Pos 14045</p>
                  </div>
                  <div className="letterhead-divider"></div>
                </div>

                <div className="doc-title-area">
                  <h3 className="doc-main-title">{previewDoc.service_title.toUpperCase()}</h3>
                  <p className="doc-serial-number">Nomor: 400 / {previewDoc.code.split('-')[1]} / KC-VII / {new Date().getFullYear()}</p>
                </div>

                <div className="doc-body-area">
                  <p>Yang bertanda tangan di bawah ini, Camat Kecamatan Cerdas, Kabupaten Metropolitan, menerangkan dengan sebenarnya bahwa:</p>
                  
                  <table className="doc-data-table">
                    <tbody>
                      <tr>
                        <td width="30%"><strong>Nama Lengkap</strong></td>
                        <td width="5%">:</td>
                        <td>{previewDoc.nama}</td>
                      </tr>
                      <tr>
                        <td><strong>NIK</strong></td>
                        <td>:</td>
                        <td>{previewDoc.nik}</td>
                      </tr>
                      <tr>
                        <td><strong>Alamat</strong></td>
                        <td>:</td>
                        <td>{previewDoc.alamat}, RT {previewDoc.rt} / RW {previewDoc.rw}, Kecamatan Cerdas</td>
                      </tr>
                      <tr>
                        <td><strong>No. WhatsApp</strong></td>
                        <td>:</td>
                        <td>{previewDoc.phone}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="doc-justification">
                    Berdasarkan data kependudukan dan hasil verifikasi berkas online pada sistem SIPELAK, nama yang tercantum di atas adalah benar warga domisili Kecamatan Cerdas dan dokumen administrasi **{previewDoc.service_title}** miliknya telah resmi diterbitkan, disetujui, serta sah menurut hukum yang berlaku.
                  </p>
                  
                  <p className="doc-closing">Demikian surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya.</p>
                </div>

                <div className="doc-footer-area">
                  <div className="doc-qr-verification">
                    {/* Simulated Verification QR Code */}
                    <div className="qr-code-placeholder">
                      <div className="qr-blocks"></div>
                      <div className="qr-center-text">SIPELAK VERIFIED</div>
                    </div>
                    <span className="qr-caption">Scan QR untuk verifikasi keaslian dokumen</span>
                  </div>
                  
                  <div className="doc-signature-block">
                    <p>Cerdas, {formatDate(new Date().toISOString())}</p>
                    <p className="signer-role"><strong>CAMAT KECAMATAN CERDAS</strong></p>
                    
                    {/* Simulated Digital Signature Stamp */}
                    <div className="digital-stamp">
                      <div className="stamp-ring">
                        <span>TTE KECAMATAN CERDAS</span>
                      </div>
                      <span className="stamp-date">DIVERIFIKASI SECARA ELEKTRONIK</span>
                    </div>

                    <p className="signer-name"><strong>Drs. H. ADITYA NUGRAHA, M.Si.</strong></p>
                    <p className="signer-nip">NIP. 19780512 200501 1 002</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPreviewDoc(null)}>Batal</button>
              <button className="btn btn-primary" onClick={() => handlePrint(previewDoc)}>
                Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         HIDDEN PRINTABLE DOCUMENT SHEET (EXCLUSIVELY SHOWN FOR window.print())
         ========================================================================== */}
      {previewDoc && (
        <div className="only-print paper-document-sheet">
          <div className="doc-letterhead">
            <div className="letterhead-header">
              <h4>PEMERINTAH KABUPATEN METROPOLITAN</h4>
              <h3>KANTOR KECAMATAN CERDAS</h3>
              <p>Jl. Raya Pembangunan No. 45, Komplek Perkantoran Terpadu, Kode Pos 14045</p>
            </div>
            <div className="letterhead-divider"></div>
          </div>

          <div className="doc-title-area">
            <h3 className="doc-main-title">{previewDoc.service_title.toUpperCase()}</h3>
            <p className="doc-serial-number">Nomor: 400 / {previewDoc.code.split('-')[1]} / KC-VII / {new Date().getFullYear()}</p>
          </div>

          <div className="doc-body-area">
            <p>Yang bertanda tangan di bawah ini, Camat Kecamatan Cerdas, Kabupaten Metropolitan, menerangkan dengan sebenarnya bahwa:</p>
            
            <table className="doc-data-table">
              <tbody>
                <tr>
                  <td width="30%"><strong>Nama Lengkap</strong></td>
                  <td width="5%">:</td>
                  <td>{previewDoc.nama}</td>
                </tr>
                <tr>
                  <td><strong>NIK</strong></td>
                  <td>:</td>
                  <td>{previewDoc.nik}</td>
                </tr>
                <tr>
                  <td><strong>Alamat</strong></td>
                  <td>:</td>
                  <td>{previewDoc.alamat}, RT {previewDoc.rt} / RW {previewDoc.rw}, Kecamatan Cerdas</td>
                </tr>
                <tr>
                  <td><strong>No. WhatsApp</strong></td>
                  <td>:</td>
                  <td>{previewDoc.phone}</td>
                </tr>
              </tbody>
            </table>

            <p className="doc-justification">
              Berdasarkan data kependudukan dan hasil verifikasi berkas online pada sistem SIPELAK, nama yang tercantum di atas adalah benar warga domisili Kecamatan Cerdas dan dokumen administrasi <strong>{previewDoc.service_title}</strong> miliknya telah resmi diterbitkan, disetujui, serta sah menurut hukum yang berlaku.
            </p>
            
            <p className="doc-closing">Demikian surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          <div className="doc-footer-area">
            <div className="doc-qr-verification">
              <div className="qr-code-placeholder">
                <div className="qr-blocks"></div>
                <div className="qr-center-text">SIPELAK VERIFIED</div>
              </div>
              <span className="qr-caption">Scan QR untuk verifikasi keaslian dokumen</span>
            </div>
            
            <div className="doc-signature-block">
              <p>Cerdas, {formatDate(new Date().toISOString())}</p>
              <p className="signer-role"><strong>CAMAT KECAMATAN CERDAS</strong></p>
              
              <div className="digital-stamp">
                <div className="stamp-ring">
                  <span>TTE KECAMATAN CERDAS</span>
                </div>
                <span className="stamp-date">DIVERIFIKASI SECARA ELEKTRONIK</span>
              </div>

              <p className="signer-name"><strong>Drs. H. ADITYA NUGRAHA, M.Si.</strong></p>
              <p className="signer-nip">NIP. 19780512 200501 1 002</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
