import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCalendar, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import './Login.css';

const PROFILES = [
  { label: 'Coordinador', email: 'admin@uni.edu', pw: 'admin123', color: '#E53E3E' },
  { label: 'Docente', email: 'ana.vargas@uni.edu', pw: 'docente123', color: '#38A169' },
  { label: 'Estudiante', email: 'luis.ramirez@uni.edu', pw: 'estudiante123', color: '#3182CE' },
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

  const quickLogin = (profile) => {
    setEmail(profile.email);
    setPassword(profile.pw);
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-card animate-fadeIn">
        <div className="login-header">
          <div className="login-logo">
            <HiOutlineCalendar />
          </div>
          <h1>UniScheduler</h1>
          <p>Sistema Inteligente de Generación de Horarios</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon">
              <HiOutlineMail className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="correo@universidad.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Iniciar sesión'}
          </button>
        </form>

        <div className="quick-login">
          <span className="quick-login-label">Acceso rápido:</span>
          <div className="quick-login-btns">
            {PROFILES.map(p => (
              <button
                key={p.label}
                type="button"
                className="quick-login-btn"
                style={{ '--accent': p.color }}
                onClick={() => quickLogin(p)}
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
