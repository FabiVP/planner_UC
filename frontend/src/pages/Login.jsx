import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCalendar, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import './Login.css';

const PROFILES = [
  { label: 'Coordinador', email: 'admin@uni.edu', pw: 'admin123', color: '#E53E3E' },
  { label: 'Docente', email: 'ana.vargas@uni.edu', pw: 'docente123', color: '#38A169' },
  { label: 'Estudiante', email: 'jorge.lopez@uni.edu', pw: 'estudiante123', color: '#3182CE' },
];

export default function Login() {
  const [email, setEmail] = useState('admin@uni.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (profile) => {
    setEmail(profile.email);
    setPassword(profile.pw);
    setLoading(true);
    setError('');
    try {
      await login(profile.email, profile.pw);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* WCAG 2.1: Decorative background shapes hidden from assistive tech */}
      <div className="login-bg-shapes" aria-hidden="true">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card animate-fadeIn">
        <div className="login-header">
          {/* WCAG 2.1 SC 1.1.1: Decorative icon hidden from screen readers */}
          <div className="login-logo" aria-hidden="true">
            <HiOutlineCalendar />
          </div>
          <h1>UniScheduler</h1>
          <p>Sistema Inteligente de Generación de Horarios</p>
        </div>

        {/* WCAG 2.1 SC 4.1.3: Live region for error messages */}
        <div
          id="login-error-region"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error && <div className="login-error">{error}</div>}
        </div>

        {/* WCAG 2.1 SC 1.3.5: Input Purpose + SC 3.3.2: Labels */}
        <form
          onSubmit={handleSubmit}
          className="login-form"
          aria-label="Formulario de inicio de sesión"
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon">
              <HiOutlineMail className="input-icon" aria-hidden="true" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="correo@universidad.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-required="true"
                aria-describedby={error ? 'login-error-region' : undefined}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="input-icon" aria-hidden="true" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-required="true"
                minLength={6}
              />
            </div>
          </div>

          {/* WCAG 2.1 SC 2.5.3: Accessible name for button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg login-btn"
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? 'Iniciando sesión, por favor espere...' : 'Iniciar sesión'}
          >
            {loading ? (
              <>
                <span className="spinner" style={{width:20,height:20,borderWidth:2}} aria-hidden="true"></span>
                <span className="sr-only">Cargando...</span>
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* WCAG 2.1 SC 2.4.6: Headings and Labels */}
        <div className="quick-login" role="group" aria-labelledby="quick-login-label">
          <span className="quick-login-label" id="quick-login-label">Acceso rápido:</span>
          <div className="quick-login-btns">
            {PROFILES.map(p => (
              <button
                key={p.label}
                type="button"
                className="quick-login-btn"
                style={{ '--accent': p.color }}
                onClick={() => quickLogin(p)}
                aria-label={`Acceso rápido como ${p.label} (${p.email})`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <p className="login-footer">Universidad Continental · Taller de Proyectos 2</p>
      </div>
    </div>
  );
}
