import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Download, 
  AlertCircle
} from 'lucide-react';
import { servicesData } from './Layanan';
import { apiService } from '../lib/supabaseService';
import type { UserProfile } from '../lib/supabaseService';

interface FormPengajuanProps {
  selectedServiceId: string | null;
  setCurrentPage: (page: 'home' | 'form' | 'surat' | 'auth') => void;
  onAddSubmittedDoc: (doc: any) => void;
  user: UserProfile | null;
}

export const FormPengajuan: React.FC<FormPengajuanProps> = ({ 
  selectedServiceId, 
  setCurrentPage, 
  onAddSubmittedDoc,
  user
}) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>(servicesData);
  const [selectedService, setSelectedService] = useState(servicesData[0]);
  
  // Form State
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  
  // Files State - stores uploaded files
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  
  // Validation State
  const [errors, setErrors] = useState<string | null>(null);
  
  // Success Receipt State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  // Load dynamic services and auto-select service
  useEffect(() => {
    const loadServicesAndSelect = async () => {
      let list: any[] = servicesData;
      try {
        const { data } = await apiService.services.getAll();
        if (data && data.length > 0) {
          list = data;
          setServices(data);
        }
      } catch (err) {
        console.warn("Using offline static services in FormPengajuan");
      }

      // Auto select service
      if (selectedServiceId) {
        const service = list.find(s => s.id === selectedServiceId);
        if (service) {
          setSelectedService(service);
        }
      } else {
        setSelectedService(list[0]);
      }
    };
    loadServicesAndSelect();
  }, [selectedServiceId]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setNik(user.nik || '');
      setNama(user.nama_lengkap || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Handle service change
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find(s => s.id === e.target.value);
    if (service) {
      setSelectedService(service);
      setFiles({}); // Reset files for new service
      setErrors(null);
    }
  };

  // Drag and Drop File Handlers
  const handleFileChange = (reqName: string, file: File | null) => {
    if (file) {
      // Check size limit (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(`Berkas "${reqName}" melebihi ukuran maksimal 5MB.`);
        return;
      }
      // Check extension (jpg, png, pdf)
      const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(fileExt)) {
        setErrors(`Berkas "${reqName}" harus bertipe JPG, PNG, atau PDF.`);
        return;
      }
      
      setFiles(prev => ({ ...prev, [reqName]: file }));
      setErrors(null);
    }
  };

  // Step Navigations
  const handleNextStep = () => {
    setErrors(null);
    
    if (step === 1) {
      // Service is always selected by default, so proceed
      setStep(2);
    } else if (step === 2) {
      // Validate Personal Info
      if (!nik || nik.length < 16) {
        setErrors('NIK harus terdiri dari 16 digit angka.');
        return;
      }
      if (!/^\d+$/.test(nik)) {
        setErrors('NIK hanya boleh berisi angka.');
        return;
      }
      if (!nama || nama.trim().length < 3) {
        setErrors('Nama Lengkap harus diisi dengan benar (min. 3 karakter).');
        return;
      }
      if (!phone || phone.length < 10) {
        setErrors('Nomor WhatsApp tidak valid (min. 10 digit).');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrors('Alamat Email tidak valid.');
        return;
      }
      if (!alamat || alamat.trim().length < 10) {
        setErrors('Alamat Lengkap harus diisi secara jelas.');
        return;
      }
      if (!rt || !rw) {
        setErrors('RT dan RW wajib diisi.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrors(null);
    setStep(prev => prev - 1);
  };

  // Submit Handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Validate if all files for current service requirements are uploaded
    const missingDocs: string[] = [];
    selectedService.requirements.forEach(req => {
      if (!files[req]) {
        missingDocs.push(req);
      }
    });

    if (missingDocs.length > 0) {
      setErrors(`Harap unggah seluruh dokumen persyaratan. Dokumen yang kurang: ${missingDocs.join(', ')}`);
      return;
    }

    if (!user) {
      setErrors('Anda harus login terlebih dahulu.');
      return;
    }

    try {
      const { data, error: apiErr } = await apiService.pengajuan.create({
        nik,
        nama,
        phone,
        email,
        alamat,
        rt,
        rw,
        service_type: selectedService.id,
        service_title: selectedService.title
      }, user.id);

      if (apiErr) {
        setErrors(apiErr.message || 'Gagal mengirimkan pengajuan.');
        return;
      }

      if (data) {
        // Format date string for displaying in receipt
        const today = new Date(data.created_at);
        const dateString = today.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB';

        const newDoc = {
          code: data.code,
          nik: data.nik,
          nama: data.nama,
          serviceTitle: data.service_title,
          date: dateString,
          status: data.status,
          statusDetail: data.status_detail
        };
        onAddSubmittedDoc(newDoc);

        setReceiptCode(data.code);
        setSubmissionDate(dateString);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setErrors(err?.message || 'Terjadi kesalahan sistem saat mengirimkan data.');
    }
  };

  const handleGoBack = () => {
    setCurrentPage('home');
  };

  // If already submitted, show beautiful receipt
  if (isSubmitted) {
    return (
      <div className="form-page-container container">
        <div className="receipt-card animate-float">
          <div className="receipt-header">
            <div className="receipt-success-badge">
              <CheckCircle2 size={48} className="text-success" />
            </div>
            <h2>Pengajuan Berhasil Dikirim!</h2>
            <p>Pengajuan Anda telah tercatat ke dalam sistem SIPELAK Kecamatan.</p>
          </div>
          
          <div className="receipt-details">
            <div className="receipt-row-highlight">
              <span className="row-label">Kode Pengajuan</span>
              <span className="row-value code-highlight">{receiptCode}</span>
            </div>
            <div className="receipt-divider"></div>
            <div className="receipt-row">
              <span className="row-label">Layanan</span>
              <span className="row-value font-medium">{selectedService.title}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Nama Pemohon</span>
              <span className="row-value">{nama}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">NIK Pemohon</span>
              <span className="row-value">{nik}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Waktu Pengajuan</span>
              <span className="row-value">{submissionDate}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Status Awal</span>
              <span className="row-value text-primary font-medium">Dalam Verifikasi</span>
            </div>
          </div>

          <div className="receipt-instructions">
            <h4><AlertCircle size={16} /> Langkah Selanjutnya:</h4>
            <ol>
              <li>Simpan / salin <strong>Kode Pengajuan ({receiptCode})</strong> di atas.</li>
              <li>Status berkas akan kami kirimkan berkala melalui WhatsApp ke nomor <strong>{phone}</strong>.</li>
              <li>Anda juga dapat memantau status secara berkala di halaman utama SIPELAK menggunakan kolom pelacakan.</li>
              <li>Proses verifikasi membutuhkan waktu maksimal <strong>1 x 24 jam</strong>.</li>
            </ol>
          </div>

          <div className="receipt-actions">
            <button className="btn btn-secondary btn-block" onClick={() => window.print()}>
              <Download size={16} />
              Cetak Bukti Pengajuan
            </button>
            <button className="btn btn-primary btn-block" onClick={handleGoBack}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-container container">
      {/* Back Button */}
      <button className="btn-back-home" onClick={handleGoBack}>
        <ArrowLeft size={18} />
        <span>Kembali ke Beranda</span>
      </button>

      <div className="form-section-header">
        <h1 className="form-page-title">Formulir Pengajuan Layanan</h1>
        <p className="form-page-desc">
          Silakan lengkapi informasi formulir di bawah ini secara teliti untuk mengajukan dokumen secara online.
        </p>
      </div>

      {/* Progress Multi Step bar */}
      <div className="form-stepper">
        <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">{step > 1 ? <Check size={16} /> : 1}</div>
          <span className="step-name">Layanan</span>
        </div>
        <div className="step-line">
          <div className={`step-line-progress w-${step === 2 ? '50' : step === 3 ? '100' : '0'}`}></div>
        </div>
        <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">{step > 2 ? <Check size={16} /> : 2}</div>
          <span className="step-name">Data Diri</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-name">Unggah Berkas</span>
        </div>
      </div>

      {/* Error Alert Box */}
      {errors && (
        <div className="alert alert-danger animate-float" style={{ animationDuration: '0s' }}>
          <AlertCircle size={20} />
          <div>{errors}</div>
        </div>
      )}

      {/* Main Form Content Container */}
      <div className="form-card">
        <form onSubmit={handleSubmitForm}>
          
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="form-step-content animate-fade-in">
              <h3 className="form-step-title">Pilih Jenis Layanan Administrasi</h3>
              <p className="form-step-subtitle">Pilih jenis dokumen kependudukan yang ingin Anda urus saat ini.</p>
              
              <div className="form-group">
                <label htmlFor="service-select" className="form-label">Pilihan Layanan Administrasi <span>*</span></label>
                <select 
                  id="service-select" 
                  className="form-control form-select"
                  value={selectedService.id}
                  onChange={handleServiceChange}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="service-details-box">
                <h4>Detail Layanan & Dokumen yang Diperlukan:</h4>
                <p className="service-description-box">{selectedService.description}</p>
                <div className="checklist-box">
                  <h5>Daftar Dokumen yang Harus Disiapkan (Scan/Foto):</h5>
                  <ul>
                    {selectedService.requirements.map((req, i) => (
                      <li key={i}>
                        <Check size={14} className="text-success" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="form-actions-row flex-end">
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Lanjutkan Pengisian
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DATA FORM */}
          {step === 2 && (
            <div className="form-step-content animate-fade-in">
              <h3 className="form-step-title">Lengkapi Data Diri Pemohon</h3>
              <p className="form-step-subtitle">Isi data identitas diri Anda secara akurat sesuai dengan Kartu Keluarga terbaru.</p>

              <div className="form-grid-fields">
                <div className="form-group">
                  <label htmlFor="nik" className="form-label">Nomor Induk Kependudukan (NIK) <span>*</span></label>
                  <input
                    type="text"
                    id="nik"
                    className="form-control"
                    placeholder="Masukkan 16 digit NIK Anda"
                    value={nik}
                    maxLength={16}
                    onChange={(e) => setNik(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nama" className="form-label">Nama Lengkap <span>*</span></label>
                  <input
                    type="text"
                    id="nama"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Nomor HP / WhatsApp <span>*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control"
                    placeholder="Contoh: 0821XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Alamat Email <span>*</span></label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Contoh: budi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group col-span-2">
                  <label htmlFor="alamat" className="form-label">Alamat Lengkap Rumah (Kecamatan Cerdas) <span>*</span></label>
                  <input
                    type="text"
                    id="alamat"
                    className="form-control"
                    placeholder="Contoh: Jl. Merpati No. 123, Desa Cerdas Jaya"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rt" className="form-label">RT <span>*</span></label>
                  <input
                    type="text"
                    id="rt"
                    className="form-control"
                    placeholder="Contoh: 005"
                    value={rt}
                    onChange={(e) => setRt(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rw" className="form-label">RW <span>*</span></label>
                  <input
                    type="text"
                    id="rw"
                    className="form-control"
                    placeholder="Contoh: 002"
                    value={rw}
                    onChange={(e) => setRw(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-actions-row">
                <button type="button" className="btn btn-light" onClick={handlePrevStep}>
                  <ArrowLeft size={16} />
                  Kembali
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Lanjutkan Pengisian
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD DOCUMENTS */}
          {step === 3 && (
            <div className="form-step-content animate-fade-in">
              <h3 className="form-step-title">Unggah Dokumen Persyaratan</h3>
              <p className="form-step-subtitle">Upload berkas pendukung dalam format JPG, PNG, atau PDF. Ukuran maksimal file adalah 5MB.</p>

              <div className="uploads-list">
                {selectedService.requirements.map((req, index) => {
                  const uploadedFile = files[req];
                  return (
                    <div key={index} className="upload-item-card">
                      <div className="upload-info-side">
                        <span className="upload-number-tag">{index + 1}</span>
                        <div className="upload-text-details">
                          <h5>{req} <span>*</span></h5>
                          <p>Format yang diizinkan: PDF, JPG, PNG (Maks 5MB)</p>
                        </div>
                      </div>
                      <div className="upload-input-side">
                        {uploadedFile ? (
                          <div className="file-uploaded-badge">
                            <CheckCircle2 size={18} className="text-success" />
                            <div className="file-details">
                              <span className="file-name">{uploadedFile.name}</span>
                              <span className="file-size">({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            </div>
                            <button 
                              type="button" 
                              className="btn-remove-file"
                              onClick={() => setFiles(prev => ({ ...prev, [req]: null }))}
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <label className="custom-upload-button">
                            <Upload size={16} />
                            <span>Pilih Berkas</span>
                            <input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const selected = e.target.files ? e.target.files[0] : null;
                                handleFileChange(req, selected);
                              }}
                              required
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="form-actions-row">
                <button type="button" className="btn btn-light" onClick={handlePrevStep}>
                  <ArrowLeft size={16} />
                  Kembali
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Pengajuan
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
