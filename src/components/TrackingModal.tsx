import React from 'react';
import { X, CheckCircle, Clock, AlertTriangle, Landmark } from 'lucide-react';

export interface SubmittedDoc {
  code: string;
  nik: string;
  nama: string;
  serviceTitle: string;
  date: string;
  status: 'Verifikasi Berkas' | 'Sedang Diproses' | 'Siap Diambil' | 'Ditolak';
  statusDetail: string;
}

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchCode: string;
  submittedDocs: SubmittedDoc[];
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ 
  isOpen, 
  onClose, 
  searchCode, 
  submittedDocs 
}) => {
  if (!isOpen) return null;

  // Search for the document
  const doc = submittedDocs.find(
    d => d.code.toLowerCase() === searchCode.trim().toLowerCase()
  );

  const getStepStatus = (currentStatus: string, stepNumber: number) => {
    // Steps: 1: Diajukan, 2: Verifikasi, 3: Diproses, 4: Selesai/Ditolak
    if (currentStatus === 'Ditolak') {
      if (stepNumber < 4) return 'completed';
      return 'failed';
    }

    const statusMap: { [key: string]: number } = {
      'Verifikasi Berkas': 2,
      'Sedang Diproses': 3,
      'Siap Diambil': 4
    };

    const currentStepNum = statusMap[currentStatus] || 1;

    if (stepNumber < currentStepNum) return 'completed';
    if (stepNumber === currentStepNum) return 'active';
    return 'waiting';
  };

  return (
    <div className="tracking-modal-overlay">
      <div className="tracking-modal-card animate-float" style={{ animationDuration: '0s' }}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Landmark size={20} className="text-primary" />
            <span>Detail Status Pengajuan</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Detail Status">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {doc ? (
            <div className="tracking-result-details">
              <div className="doc-meta-badge">
                <span>Kode: <strong>{doc.code}</strong></span>
                <span className={`status-badge-inline ${doc.status.toLowerCase().replace(' ', '-')}`}>
                  {doc.status}
                </span>
              </div>

              <div className="doc-summary-box">
                <div className="summary-field">
                  <span className="field-label">Nama Pemohon:</span>
                  <span className="field-value">{doc.nama}</span>
                </div>
                <div className="summary-field">
                  <span className="field-label">Jenis Layanan:</span>
                  <span className="field-value font-medium">{doc.serviceTitle}</span>
                </div>
                <div className="summary-field">
                  <span className="field-label">Tanggal Masuk:</span>
                  <span className="field-value">{doc.date}</span>
                </div>
              </div>

              {/* Status Stepper Timeline */}
              <div className="status-timeline">
                {/* Step 1 */}
                <div className={`timeline-step ${getStepStatus(doc.status, 1)}`}>
                  <div className="timeline-node">
                    <CheckCircle size={16} />
                  </div>
                  <div className="timeline-content">
                    <h5>Pengajuan Terkirim</h5>
                    <p>Warga berhasil mengirim dokumen pengajuan via SIPELAK.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`timeline-step ${getStepStatus(doc.status, 2)}`}>
                  <div className="timeline-node">
                    {getStepStatus(doc.status, 2) === 'active' ? <Clock size={16} /> : <CheckCircle size={16} />}
                  </div>
                  <div className="timeline-content">
                    <h5>Verifikasi Berkas</h5>
                    <p>Pemeriksaan kelengkapan dan kecocokan data dokumen oleh verifikator.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`timeline-step ${getStepStatus(doc.status, 3)}`}>
                  <div className="timeline-node">
                    {getStepStatus(doc.status, 3) === 'active' ? <Clock size={16} /> : <CheckCircle size={16} />}
                  </div>
                  <div className="timeline-content">
                    <h5>Sedang Diproses</h5>
                    <p>Pembuatan dokumen fisik dan tanda tangan pejabat berwenang.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`timeline-step ${getStepStatus(doc.status, 4)}`}>
                  <div className="timeline-node">
                    {doc.status === 'Ditolak' ? (
                      <AlertTriangle size={16} />
                    ) : doc.status === 'Siap Diambil' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <h5>{doc.status === 'Ditolak' ? 'Pengajuan Ditolak' : 'Selesai / Siap Diambil'}</h5>
                    <p>
                      {doc.status === 'Ditolak' 
                        ? 'Pengajuan tidak dapat diproses karena berkas tidak memenuhi syarat.' 
                        : 'Dokumen telah terbit dan dapat diunduh atau diambil di kecamatan.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Action Detail Box */}
              <div className="status-detail-desc-box">
                <h4>Keterangan Petugas:</h4>
                <p className="detail-text">{doc.statusDetail}</p>
                {doc.status === 'Siap Diambil' && (
                  <div className="instructions-callout">
                    <strong>Catatan Pengambilan:</strong> Bawa fotokopi KK dan tunjukkan Kode Pengajuan {doc.code} ke loket loket pelayanan kecamatan.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="tracking-not-found">
              <AlertTriangle size={48} className="text-warning animate-float" style={{ animationDuration: '3s' }} />
              <h3>Kode Pengajuan Tidak Ditemukan</h3>
              <p>
                Kami tidak menemukan pengajuan dengan kode <strong>"{searchCode}"</strong>. 
                Harap periksa kembali penulisan kode Anda, termasuk huruf besar/kecil dan tanda hubung.
              </p>
              <div className="tip-box">
                <strong>Tips:</strong> Contoh kode pengajuan resmi adalah <code>SPLK-12345</code> atau <code>SPLK-87291</code>.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Tutup Pelacakan
          </button>
        </div>
      </div>
    </div>
  );
};
