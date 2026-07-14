import React, { useState, useEffect } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { apiService } from '../lib/supabaseService';

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'Apakah pelayanan administrasi SIPELAK dipungut biaya?',
    answer: 'Tidak sama sekali. Semua jenis pelayanan administrasi kependudukan yang dilakukan melalui sistem SIPELAK adalah 100% gratis atau Rp0 (tanpa biaya apapun), sebagai komitmen kami memberantas pungli.'
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan hingga dokumen selesai?',
    answer: 'Rata-rata proses verifikasi dan penyelesaian berkas berlangsung selama 1x24 jam hari kerja sejak berkas Anda diunggah dengan lengkap. Anda akan menerima notifikasi status pengajuan Anda secara berkala.'
  },
  {
    question: 'Bagaimana cara memantau status pengajuan dokumen saya?',
    answer: 'Anda dapat memantau status secara langsung melalui fitur "Lacak Status Pengajuan" di halaman Beranda. Cukup masukkan Kode Pengajuan (misalnya: SPLK-XXXXX) yang Anda dapatkan sesaat setelah mengirim formulir.'
  },
  {
    question: 'Apakah saya masih perlu datang ke kantor kecamatan?',
    answer: 'Untuk beberapa dokumen yang sudah menggunakan Tanda Tangan Elektronik (TTE) resmi seperti KK atau SKTM, Anda dapat mengunduh dan mencetaknya sendiri di rumah. Namun, untuk berkas fisik seperti KTP-el asli atau kartu KIA, Anda harus datang mengambilnya ke kantor kecamatan dengan menunjukkan Kode Pengajuan.'
  },
  {
    question: 'Apa yang harus dilakukan jika pengajuan saya ditolak?',
    answer: 'Jika pengajuan ditolak, Anda akan menerima keterangan atau alasan penolakan secara transparan (misalnya: foto dokumen buram atau KK kedaluwarsa). Anda dipersilakan melakukan pengajuan ulang dengan memperbaiki dokumen sesuai instruksi petugas.'
  },
  {
    question: 'Bagaimana cara menghubungi petugas jika ada kendala?',
    answer: 'Anda dapat menghubungi layanan pengaduan dan bantuan kami melalui nomor WhatsApp resmi kecamatan atau mengunjungi bagian Layanan Pelanggan di kantor kecamatan yang detail kontaknya tercantum di bagian bawah website ini.'
  }
];

export const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const { data } = await apiService.faqs.getAll();
        if (data && data.length > 0) {
          setFaqs(data);
        }
      } catch (e) {
        console.warn("Using offline static FAQs", e);
      }
    };
    loadFaqs();
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tanya Jawab</span>
          <h2 className="section-title">Pertanyaan Umum (FAQ)</h2>
          <p className="section-desc">
            Temukan jawaban cepat atas pertanyaan yang sering diajukan mengenai pelayanan administrasi kecamatan SIPELAK.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item-card ${isOpen ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="faq-question-row">
                  <div className="faq-question-title">
                    <HelpCircle size={20} className="text-primary" />
                    <span>{faq.question}</span>
                  </div>
                  <div className="faq-toggle-icon">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>
                
                {/* Accordion panel */}
                <div className={`faq-answer-panel ${isOpen ? 'open' : ''}`}>
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
