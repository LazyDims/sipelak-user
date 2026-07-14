import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Users, 
  Baby, 
  MapPin, 
  FileText, 
  Briefcase, 
  Heart, 
  FileCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ArrowRight,
  Landmark
} from 'lucide-react';
import { apiService } from '../lib/supabaseService';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  requirements: string[];
}

interface LayananProps {
  setCurrentPage: (page: 'home' | 'form') => void;
  setSelectedServiceId: (id: string | null) => void;
}

export const getIconForService = (id: string) => {
  switch (id) {
    case 'ktp': return <CreditCard size={24} />;
    case 'kk': return <Users size={24} />;
    case 'kia': return <Baby size={24} />;
    case 'skp': return <MapPin size={24} />;
    case 'sktm': return <FileText size={24} />;
    case 'sku': return <Briefcase size={24} />;
    case 'nikah': return <Heart size={24} />;
    case 'skck': return <FileCheck size={24} />;
    default: return <Landmark size={24} />;
  }
};

export const servicesData = [
  {
    id: 'ktp',
    title: 'Kartu Tanda Penduduk (KTP-el)',
    description: 'Pengajuan KTP-el baru (pemula usia 17 tahun) maupun penggantian KTP yang rusak atau hilang.',
    icon: <CreditCard size={24} />,
    requirements: [
      'Berusia minimal 17 tahun atau sudah menikah',
      'Fotokopi Kartu Keluarga (KK) terbaru',
      'Surat Pengantar dari RT/RW setempat',
      'Surat Keterangan Kehilangan dari Kepolisian (khusus jika KTP hilang)',
      'KTP lama yang rusak (khusus jika KTP rusak)'
    ]
  },
  {
    id: 'kk',
    title: 'Kartu Keluarga (KK)',
    description: 'Pengurusan Kartu Keluarga baru, perubahan data anggota keluarga, atau pemecahan KK.',
    icon: <Users size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Kartu Keluarga (KK) asli yang lama',
      'Fotokopi Akta Nikah / Buku Nikah bagi yang baru menikah',
      'Fotokopi Akta Kelahiran (untuk penambahan anggota keluarga baru)',
      'Surat Keterangan Pindah (jika ada anggota keluarga yang pindah masuk)'
    ]
  },
  {
    id: 'kia',
    title: 'Kartu Identitas Anak (KIA)',
    description: 'Penerbitan kartu identitas resmi bagi anak di bawah usia 17 tahun untuk akses fasilitas publik.',
    icon: <Baby size={24} />,
    requirements: [
      'Fotokopi Akta Kelahiran Anak',
      'Fotokopi Kartu Keluarga (KK) orang tua',
      'Fotokopi KTP kedua orang tua / wali',
      'Pas foto anak ukuran 2x3 berwarna sebanyak 2 lembar (bagi anak usia di atas 5 tahun)'
    ]
  },
  {
    id: 'skp',
    title: 'Surat Keterangan Pindah (SKP)',
    description: 'Pengurusan surat kepindahan domisili penduduk ke luar daerah/kecamatan.',
    icon: <MapPin size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Kartu Keluarga (KK) asli dan fotokopi',
      'KTP-el asli dan fotokopi',
      'Alamat tujuan pindah yang lengkap (RT/RW, Desa/Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi)',
      'Pas foto terbaru ukuran 3x4 sebanyak 3 lembar'
    ]
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    description: 'Surat keterangan untuk keringanan biaya pendidikan, pelayanan kesehatan, atau bantuan sosial.',
    icon: <FileText size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Fotokopi KTP dan Kartu Keluarga (KK) pemohon',
      'Surat Pernyataan Miskin yang ditandatangani oleh RT/RW di atas materai Rp10.000',
      'Fotokopi Kartu Indonesia Sehat (KIS) / BPJS (jika ada)',
      'Foto rumah tampak depan'
    ]
  },
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    description: 'Pemberian surat keterangan legalitas usaha mikro/kecil untuk syarat pengajuan kredit atau kemitraan.',
    icon: <Briefcase size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Fotokopi KTP-el pengusaha',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pernyataan Kepemilikan Usaha dari yang bersangkutan',
      'Foto kegiatan / lokasi usaha secara jelas'
    ]
  },
  {
    id: 'nikah',
    title: 'Surat Pengantar Nikah (N1-N4)',
    description: 'Pengurusan berkas administrasi dan surat pengantar pengantar nikah ke KUA.',
    icon: <Heart size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Fotokopi KTP-el calon pengantin laki-laki & perempuan',
      'Fotokopi Kartu Keluarga (KK) calon pengantin',
      'Fotokopi Akta Kelahiran calon pengantin',
      'Pas foto latar belakang biru (2x3 sebanyak 4 lembar, 4x6 sebanyak 2 lembar)'
    ]
  },
  {
    id: 'skck',
    title: 'Surat Pengantar SKCK',
    description: 'Surat rekomendasi kecamatan untuk pengajuan SKCK di Kepolisian Sektor (Polsek) setempat.',
    icon: <FileCheck size={24} />,
    requirements: [
      'Surat Pengantar RT/RW',
      'Fotokopi KTP-el pemohon',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran atau Ijazah Terakhir',
      'Pas foto berwarna ukuran 4x6 sebanyak 2 lembar'
    ]
  }
];

export const Layanan: React.FC<LayananProps> = ({ setCurrentPage, setSelectedServiceId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>(servicesData);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await apiService.services.getAll();
        if (data && data.length > 0) {
          const mapped = data.map(s => ({
            ...s,
            icon: getIconForService(s.id)
          }));
          setServices(mapped);
        }
      } catch (e) {
        console.warn("Using offline services data");
      }
    };
    loadServices();
  }, []);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRequirements = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleApply = (id: string) => {
    setSelectedServiceId(id);
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="layanan" className="section-bg-light">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Layanan Administrasi</span>
          <h2 className="section-title">Jenis Layanan Kami</h2>
          <p className="section-desc">
            Pilih layanan yang Anda butuhkan. Kami menyediakan berbagai pengurusan dokumen administratif secara digital untuk kemudahan Anda.
          </p>
        </div>

        {/* Search Bar */}
        <div className="services-search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Cari layanan administrasi... (contoh: KTP, KK, SKTM)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="services-search-input"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map((service) => {
              const isExpanded = expandedCard === service.id;
              return (
                <div 
                  key={service.id} 
                  className={`service-card ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setExpandedCard(isExpanded ? null : service.id)}
                >
                  <div className="service-icon-wrapper">
                    {service.icon}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.description}</p>
                  
                  {/* Requirements Accordion */}
                  <div className="service-requirements-wrapper">
                    <button 
                      className="btn-requirements-toggle"
                      onClick={(e) => toggleRequirements(service.id, e)}
                    >
                      <span>Persyaratan Dokumen</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {isExpanded && (
                      <div className="requirements-list-container">
                        <div className="requirements-info-alert">
                          <Info size={14} />
                          <span>Siapkan file scan/foto dokumen berikut sebelum mengisi form.</span>
                        </div>
                        <ul className="requirements-list">
                          {service.requirements.map((req: string, index: number) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="service-card-action">
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(service.id);
                      }}
                    >
                      Ajukan Sekarang
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <Info size={48} className="text-muted" />
            <p>Layanan yang Anda cari tidak ditemukan. Coba gunakan kata kunci lain.</p>
          </div>
        )}
      </div>
    </section>
  );
};
