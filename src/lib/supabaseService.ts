import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize Supabase Client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================================================
// Types
// ==========================================================================
export interface UserProfile {
  id: string;
  email: string;
  nama_lengkap: string;
  nik: string;
  phone: string;
}

export interface PengajuanDocument {
  id: string;
  code: string;
  user_id: string;
  nik: string;
  nama: string;
  service_type: string;
  service_title: string;
  phone: string;
  email: string;
  alamat: string;
  rt: string;
  rw: string;
  status: 'Verifikasi Berkas' | 'Sedang Diproses' | 'Siap Diambil' | 'Ditolak';
  status_detail: string;
  created_at: string;
  document_url?: string;
  verified_at?: string;
  document_name?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Layanan' | 'Pengumuman' | 'Kegiatan';
  content: string;
  created_at: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  alamat: string;
  camat_nama: string;
  camat_nip: string;
}

export interface StatistikItem {
  id: number;
  value: string;
  label: string;
  description: string;
  color_class: string;
  icon_name?: string;
}

export interface AlurItem {
  id: number;
  step_number: string;
  title: string;
  description: string;
  icon_name: string;
}

// ==========================================================================
// Local Storage Mock Engine (Fallback when Admin Server is Offline)
// ==========================================================================
const MOCK_USERS_KEY = 'sipelak_mock_users';
const MOCK_PROFILES_KEY = 'sipelak_mock_profiles';
const MOCK_DOCS_KEY = 'sipelak_mock_docs';
const CURRENT_USER_KEY = 'sipelak_current_user';
const MOCK_STATS_KEY = 'sipelak_mock_stats';
const MOCK_ALUR_KEY = 'sipelak_mock_alur';
const MOCK_CONTACT_KEY = 'sipelak_mock_contact';

const ADMIN_API_URL = 'http://localhost:3000/api/mock';

// Utility to test if the Admin Server is online
async function checkAdminServerOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${ADMIN_API_URL}/contact`, { method: 'GET', signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch (e) {
    return false;
  }
}

const initMockData = () => {
  // Initialize mock documents if not exists in local storage
  if (typeof window !== 'undefined' && !localStorage.getItem(MOCK_DOCS_KEY)) {
    const defaultDocs: PengajuanDocument[] = [
      {
        id: '1',
        code: 'SPLK-98234',
        user_id: 'mock-user-1',
        nik: '3273012345670001',
        nama: 'Budi Santoso',
        service_type: 'ktp',
        service_title: 'Kartu Tanda Penduduk (KTP-el)',
        phone: '08123456789',
        email: 'budi@gmail.com',
        alamat: 'Jl. Merdeka No. 12',
        rt: '003',
        rw: '004',
        status: 'Siap Diambil',
        status_detail: 'KTP-el fisik Anda telah selesai dicetak. Silakan datang ke kantor kecamatan dan mengambilnya di loket pelayanan Nomor 3 dengan membawa Kartu Keluarga (KK) asli.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        code: 'SPLK-12403',
        user_id: 'mock-user-1',
        nik: '3273017654320002',
        nama: 'Siti Aminah',
        service_type: 'kk',
        service_title: 'Kartu Keluarga (KK)',
        phone: '08987654321',
        email: 'siti@gmail.com',
        alamat: 'Jl. Melati No. 45',
        rt: '002',
        rw: '001',
        status: 'Sedang Diproses',
        status_detail: 'Berkas Kartu Keluarga Anda telah diverifikasi lengkap. Saat ini sedang dalam proses penerbitan Tanda Tangan Elektronik (TTE) resmi Camat.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        code: 'SPLK-87291',
        user_id: 'mock-user-2',
        nik: '3273011122330003',
        nama: 'Joko Susilo',
        service_type: 'sktm',
        service_title: 'Surat Keterangan Tidak Mampu (SKTM)',
        phone: '08112233445',
        email: 'joko@gmail.com',
        alamat: 'Jl. Anggrek No. 8',
        rt: '001',
        rw: '002',
        status: 'Ditolak',
        status_detail: 'Pengajuan ditolak karena surat pernyataan miskin tidak ditandatangani RT/RW setempat. Silakan ajukan ulang dengan berkas bertanda tangan lengkap.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem(MOCK_DOCS_KEY, JSON.stringify(defaultDocs));
  }

  // Initialize mock statistics if not exists in local storage
  if (typeof window !== 'undefined' && !localStorage.getItem(MOCK_STATS_KEY)) {
    const defaultStats = [
      { id: 1, value: '14,825', label: 'Total Pengajuan', description: 'Dokumen masuk terhitung sejak awal tahun', color_class: 'blue' },
      { id: 2, value: '14,562', label: 'Selesai Diproses', description: 'Dokumen berhasil diterbitkan & diserahkan', color_class: 'green' },
      { id: 3, value: '24 Jam', label: 'Rata-rata Waktu Proses', description: 'Lebih cepat dibanding pengurusan konvensional', color_class: 'yellow' },
      { id: 4, value: '98.6%', label: 'Kepuasan Warga (IKM)', description: 'Berdasarkan survei kepuasan pelayanan online', color_class: 'teal' }
    ];
    localStorage.setItem(MOCK_STATS_KEY, JSON.stringify(defaultStats));
  }

  // Initialize mock alur if not exists in local storage
  if (typeof window !== 'undefined' && !localStorage.getItem(MOCK_ALUR_KEY)) {
    const defaultAlur = [
      { id: 1, step_number: '01', title: 'Pilih Layanan', description: 'Tentukan jenis administrasi yang Anda butuhkan, baca persyaratannya, lalu klik tombol Ajukan Sekarang.', icon_name: 'Search' },
      { id: 2, step_number: '02', title: 'Isi Data & Unggah', description: 'Lengkapi formulir online dengan data diri Anda yang valid, dan unggah foto/scan dokumen persyaratan yang diminta.', icon_name: 'Edit3' },
      { id: 3, step_number: '03', title: 'Verifikasi Petugas', description: 'Petugas kecamatan akan memverifikasi berkas Anda secara online. Jika ada kekurangan, Anda akan langsung dihubungi.', icon_name: 'ShieldAlert' },
      { id: 4, step_number: '04', title: 'Selesai & Ambil', description: 'Setelah dokumen selesai diproses, Anda akan menerima notifikasi untuk mengunduh dokumen atau mengambilnya di kantor.', icon_name: 'CheckCircle2' }
    ];
    localStorage.setItem(MOCK_ALUR_KEY, JSON.stringify(defaultAlur));
  }

  // Initialize mock contact if not exists in local storage
  if (typeof window !== 'undefined' && !localStorage.getItem(MOCK_CONTACT_KEY)) {
    const defaultContact: ContactInfo = {
      phone: '08123456789',
      email: 'kecamatan.cerdas@sipelak.go.id',
      alamat: 'Jl.Slamet Riyadi No.8, Gayamsari, Kec. Gayamsari, Kota Semarang, Jawa Tengah',
      camat_nama: 'Drs. H. ADITYA NUGRAHA, M.Si.',
      camat_nip: '19780512 200501 1 002'
    };
    localStorage.setItem(MOCK_CONTACT_KEY, JSON.stringify(defaultContact));
  }
};

if (typeof window !== 'undefined') {
  initMockData();
}

// ==========================================================================
// Unified API Services (Switches between Real Supabase, Admin Server, & LocalStorage Mock)
// ==========================================================================
export const apiService = {
  // ------------------------------------------------------------------------
  // Auth Operations
  // ------------------------------------------------------------------------
  auth: {
    async signUp(email: string, password: string, namaLengkap: string, nik: string, phone: string): Promise<{ data: any; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nama_lengkap: namaLengkap,
              nik: nik,
              phone: phone
            }
          }
        });
        return { data, error };
      } else {
        // Try calling the Next.js Admin backend API first
        const isOnline = await checkAdminServerOnline();
        if (isOnline) {
          try {
            const res = await fetch(`${ADMIN_API_URL}/auth/signup`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, nama_lengkap: namaLengkap, nik, phone }),
            });
            const result = await res.json();
            if (res.ok) {
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
              return { data: result, error: null };
            } else {
              return { data: null, error: { message: result.error || 'Gagal mendaftar.' } };
            }
          } catch (e) {
            console.warn("Backend signup failed, falling back to localStorage", e);
          }
        }

        // Fallback: Local Storage Mock Register
        const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
        if (users.find((u: any) => u.email === email)) {
          return { data: null, error: { message: 'Email sudah terdaftar.' } };
        }
        
        const newUserId = `mock-user-${Math.floor(1000 + Math.random() * 9000)}`;
        const newUser = { id: newUserId, email, password };
        users.push(newUser);
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

        const profiles = JSON.parse(localStorage.getItem(MOCK_PROFILES_KEY) || '[]');
        const newProfile: UserProfile = { id: newUserId, email, nama_lengkap: namaLengkap, nik, phone };
        profiles.push(newProfile);
        localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(profiles));

        // Auto Login
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
        return { data: { user: newProfile }, error: null };
      }
    },

    async signIn(email: string, password: string): Promise<{ data: any; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (data?.user) {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          return { data: { user: data.user, profile }, error };
        }
        return { data, error };
      } else {
        // Try calling the Next.js Admin backend API first
        const isOnline = await checkAdminServerOnline();
        if (isOnline) {
          try {
            const res = await fetch(`${ADMIN_API_URL}/auth/signin`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            const result = await res.json();
            if (res.ok) {
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
              return { data: result, error: null };
            } else {
              return { data: null, error: { message: result.error || 'Email atau password salah.' } };
            }
          } catch (e) {
            console.warn("Backend login failed, falling back to localStorage", e);
          }
        }

        // Fallback: Local Storage Mock Login
        const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (!user) {
          return { data: null, error: { message: 'Email atau kata sandi salah.' } };
        }

        const profiles = JSON.parse(localStorage.getItem(MOCK_PROFILES_KEY) || '[]');
        const profile = profiles.find((p: any) => p.id === user.id) || {
          id: user.id,
          email: user.email,
          nama_lengkap: 'Budi Santoso', // Fallback name
          nik: '3273012345670001',
          phone: '08123456789'
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
        return { data: { user, profile }, error: null };
      }
    },

    async signOut(): Promise<{ error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signOut();
        return { error };
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        return { error: null };
      }
    },

    async getCurrentUser(): Promise<UserProfile | null> {
      if (isSupabaseConfigured && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (profile) {
            return {
              id: user.id,
              email: user.email || '',
              nama_lengkap: profile.nama_lengkap,
              nik: profile.nik,
              phone: profile.phone
            };
          }
        }
        return null;
      } else {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
      }
    }
  },

  // ------------------------------------------------------------------------
  // Pengajuan Documents Operations
  // ------------------------------------------------------------------------
  pengajuan: {
    async create(docData: Omit<PengajuanDocument, 'id' | 'code' | 'user_id' | 'status' | 'status_detail' | 'created_at'>, userId: string): Promise<{ data: PengajuanDocument | null; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const code = `SPLK-${Math.floor(10000 + Math.random() * 90000)}`;
        const status = 'Verifikasi Berkas';
        const status_detail = 'Berkas pengajuan Anda telah diterima dan sedang diperiksa oleh petugas verifikator kecamatan.';
        const { data, error } = await supabase
          .from('pengajuan')
          .insert([
            {
              code,
              user_id: userId,
              nik: docData.nik,
              nama: docData.nama,
              service_type: docData.service_type,
              service_title: docData.service_title,
              phone: docData.phone,
              email: docData.email,
              alamat: docData.alamat,
              rt: docData.rt,
              rw: docData.rw,
              status,
              status_detail,
              document_name: docData.document_name,
              document_url: docData.document_url
            }
          ])
          .select()
          .single();
        return { data, error };
      } else {
        // Try calling the Next.js Admin backend API first
        const isOnline = await checkAdminServerOnline();
        if (isOnline) {
          try {
            const res = await fetch(`${ADMIN_API_URL}/pengajuan`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...docData, user_id: userId }),
            });
            const result = await res.json();
            if (res.ok) {
              return { data: result, error: null };
            } else {
              return { data: null, error: { message: result.error || 'Gagal mengirim pengajuan.' } };
            }
          } catch (e) {
            console.warn("Backend create submission failed, falling back to localStorage", e);
          }
        }

        // Fallback: Local Storage Mock Insert
        const code = `SPLK-${Math.floor(10000 + Math.random() * 90000)}`;
        const status = 'Verifikasi Berkas';
        const status_detail = 'Berkas pengajuan Anda telah diterima dan sedang diperiksa oleh petugas verifikator kecamatan.';
        const created_at = new Date().toISOString();

        const docs = JSON.parse(localStorage.getItem(MOCK_DOCS_KEY) || '[]');
        const newDoc: PengajuanDocument = {
          id: `doc-${Math.floor(1000 + Math.random() * 9000)}`,
          code,
          user_id: userId,
          nik: docData.nik,
          nama: docData.nama,
          service_type: docData.service_type,
          service_title: docData.service_title,
          phone: docData.phone,
          email: docData.email,
          alamat: docData.alamat,
          rt: docData.rt,
          rw: docData.rw,
          status,
          status_detail,
          created_at,
          document_name: docData.document_name,
          document_url: docData.document_url
        };
        docs.push(newDoc);
        localStorage.setItem(MOCK_DOCS_KEY, JSON.stringify(docs));
        return { data: newDoc, error: null };
      }
    },

    async getByUser(userId: string): Promise<{ data: PengajuanDocument[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('pengajuan')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        return { data: data || [], error };
      } else {
        // Try calling the Next.js Admin backend API first
        const isOnline = await checkAdminServerOnline();
        if (isOnline) {
          try {
            const res = await fetch(`${ADMIN_API_URL}/pengajuan/user/${userId}`);
            const result = await res.json();
            if (res.ok) {
              return { data: result, error: null };
            }
          } catch (e) {
            console.warn("Backend fetch by user failed, falling back to localStorage", e);
          }
        }

        // Fallback: Local Storage Get User Docs
        const docs = JSON.parse(localStorage.getItem(MOCK_DOCS_KEY) || '[]');
        const userDocs = docs.filter((d: PengajuanDocument) => d.user_id === userId);
        userDocs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { data: userDocs, error: null };
      }
    },

    async getByCode(code: string): Promise<{ data: PengajuanDocument | null; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('pengajuan')
          .select('*')
          .eq('code', code.trim().toUpperCase())
          .maybeSingle();
        return { data, error };
      } else {
        // Try calling the Next.js Admin backend API first
        const isOnline = await checkAdminServerOnline();
        if (isOnline) {
          try {
            const res = await fetch(`${ADMIN_API_URL}/pengajuan/code/${code.trim()}`);
            const result = await res.json();
            if (res.ok) {
              return { data: result, error: null };
            } else {
              return { data: null, error: { message: result.error || 'Dokumen tidak ditemukan.' } };
            }
          } catch (e) {
            console.warn("Backend fetch by code failed, falling back to localStorage", e);
          }
        }

        // Fallback: Local Storage Get By Code
        const docs = JSON.parse(localStorage.getItem(MOCK_DOCS_KEY) || '[]');
        const doc = docs.find((d: PengajuanDocument) => d.code.toLowerCase() === code.trim().toLowerCase());
        return { data: doc || null, error: doc ? null : { message: 'Dokumen tidak ditemukan.' } };
      }
    }
  },

  // ------------------------------------------------------------------------
  // Dynamic Content Operations (Services, FAQs, News, Contact, Statistik, Alur)
  // ------------------------------------------------------------------------
  services: {
    async getAll(): Promise<{ data: ServiceItem[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/services`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic services from admin backend", e);
        }
      }
      return { data: [], error: { message: 'Backend offline' } };
    }
  },

  faqs: {
    async getAll(): Promise<{ data: FaqItem[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/faqs`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic faqs from admin backend", e);
        }
      }
      return { data: [], error: { message: 'Backend offline' } };
    }
  },

  news: {
    async getAll(): Promise<{ data: NewsItem[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/news`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic news from admin backend", e);
        }
      }
      return { data: [], error: { message: 'Backend offline' } };
    }
  },

  contact: {
    async get(): Promise<{ data: ContactInfo | null; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('contact')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/contact`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic contact settings from admin backend", e);
        }
      }
      // Fallback: Local Storage Get Contact
      if (typeof window !== 'undefined') {
        const contact = localStorage.getItem(MOCK_CONTACT_KEY);
        if (contact) return { data: JSON.parse(contact), error: null };
      }
      return { data: null, error: { message: 'Backend offline' } };
    }
  },

  statistik: {
    async getAll(): Promise<{ data: StatistikItem[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('statistik')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/statistik`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic statistik from admin backend", e);
        }
      }
      // Fallback: Local Storage Get Stats
      if (typeof window !== 'undefined') {
        const stats = localStorage.getItem(MOCK_STATS_KEY);
        if (stats) return { data: JSON.parse(stats), error: null };
      }
      return { data: [], error: { message: 'Backend offline' } };
    }
  },

  alur: {
    async getAll(): Promise<{ data: AlurItem[]; error: any }> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('alur')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data) return { data, error: null };
      }
      const isOnline = await checkAdminServerOnline();
      if (isOnline) {
        try {
          const res = await fetch(`${ADMIN_API_URL}/alur`);
          if (res.ok) return { data: await res.json(), error: null };
        } catch (e) {
          console.warn("Failed fetching dynamic alur from admin backend", e);
        }
      }
      // Fallback: Local Storage Get Alur
      if (typeof window !== 'undefined') {
        const alur = localStorage.getItem(MOCK_ALUR_KEY);
        if (alur) return { data: JSON.parse(alur), error: null };
      }
      return { data: [], error: { message: 'Backend offline' } };
    }
  }
};
