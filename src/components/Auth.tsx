import React, { useState } from 'react';
import { Mail, Lock, User, CreditCard, Phone, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiService } from '../lib/supabaseService';
import type { UserProfile } from '../lib/supabaseService';

interface AuthProps {
  onLoginSuccess: (profile: UserProfile) => void;
  onGoBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onGoBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const { data, error: loginErr } = await apiService.auth.signIn(email, password);
        if (loginErr) {
          setError(loginErr.message || 'Email atau kata sandi salah.');
        } else if (data?.profile) {
          setSuccess('Masuk berhasil! Mengalihkan...');
          setTimeout(() => {
            onLoginSuccess(data.profile);
          }, 1000);
        }
      } else {
        // Sign Up / Register
        // Validate NIK
        if (!nik || nik.length < 16 || !/^\d+$/.test(nik)) {
          setError('NIK harus berisi 16 digit angka.');
          setLoading(false);
          return;
        }
        if (!namaLengkap || namaLengkap.trim().length < 3) {
          setError('Nama Lengkap wajib diisi (min. 3 karakter).');
          setLoading(false);
          return;
        }
        if (!phone || phone.length < 10) {
          setError('Nomor WhatsApp wajib diisi dengan benar.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Kata sandi harus minimal 6 karakter.');
          setLoading(false);
          return;
        }

        const { data, error: signUpErr } = await apiService.auth.signUp(
          email,
          password,
          namaLengkap,
          nik,
          phone
        );

        if (signUpErr) {
          setError(signUpErr.message || 'Pendaftaran gagal. Silakan coba lagi.');
        } else if (data?.user) {
          setSuccess('Pendaftaran berhasil! Akun Anda telah aktif.');
          setTimeout(() => {
            // Get profile and trigger login success
            onLoginSuccess(data.user);
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container container" style={{ maxWidth: '480px' }}>
      <div className="form-section-header text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 className="form-page-title">{isLogin ? 'Masuk ke SIPELAK' : 'Daftar Akun Baru'}</h1>
        <p className="form-page-desc">
          {isLogin 
            ? 'Silakan masuk untuk mengajukan dokumen administrasi dan melacak berkas Anda.' 
            : 'Lengkapi formulir untuk membuat akun SIPELAK resmi.'}
        </p>
      </div>

      <div className="form-card">
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Alamat Email <span>*</span></label>
            <div className="tracking-input-wrapper">
              <Mail className="tracking-icon" size={16} />
              <input
                type="email"
                className="tracking-input"
                style={{ paddingLeft: '42px' }}
                placeholder="budi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Kata Sandi <span>*</span></label>
            <div className="tracking-input-wrapper">
              <Lock className="tracking-icon" size={16} />
              <input
                type="password"
                className="tracking-input"
                style={{ paddingLeft: '42px' }}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Registration Fields */}
          {!isLogin && (
            <div className="auth-signup-fields animate-fade-in">
              {/* Nama Lengkap */}
              <div className="form-group">
                <label className="form-label">Nama Lengkap <span>*</span></label>
                <div className="tracking-input-wrapper">
                  <User className="tracking-icon" size={16} />
                  <input
                    type="text"
                    className="tracking-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Contoh: Budi Santoso"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* NIK */}
              <div className="form-group">
                <label className="form-label">Nomor Induk Kependudukan (NIK) <span>*</span></label>
                <div className="tracking-input-wrapper">
                  <CreditCard className="tracking-icon" size={16} />
                  <input
                    type="text"
                    className="tracking-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="16 digit angka kependudukan"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* WhatsApp Phone */}
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp <span>*</span></label>
                <div className="tracking-input-wrapper">
                  <Phone className="tracking-icon" size={16} />
                  <input
                    type="tel"
                    className="tracking-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Contoh: 0821xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            style={{ marginTop: '10px', height: '48px' }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : isLogin ? (
              <>
                <span>Masuk Sekarang</span>
                <LogIn size={18} />
              </>
            ) : (
              <>
                <span>Daftar Akun</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle-box" style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          {isLogin ? (
            <p>
              Belum punya akun?{' '}
              <button 
                type="button" 
                className="btn-requirements-toggle" 
                style={{ display: 'inline', fontWeight: 'bold' }}
                onClick={() => { setIsLogin(false); setError(null); }}
              >
                Daftar Disini
              </button>
            </p>
          ) : (
            <p>
              Sudah memiliki akun?{' '}
              <button 
                type="button" 
                className="btn-requirements-toggle" 
                style={{ display: 'inline', fontWeight: 'bold' }}
                onClick={() => { setIsLogin(true); setError(null); }}
              >
                Masuk Disini
              </button>
            </p>
          )}
        </div>
      </div>

      <button 
        type="button" 
        className="btn-back-home" 
        style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        onClick={onGoBack}
      >
        Batalkan & Kembali
      </button>
    </div>
  );
};
