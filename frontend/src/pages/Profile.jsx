import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', career: '', department: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', career: user.career || '', department: user.department || '' });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile', form);
      updateUser(res.data);
      setMsg('Perfil actualizado');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg('Error al guardar'); }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    try {
      await api.put('/profile/password', pwForm);
      setMsg('Contraseña actualizada');
      setPwForm({ currentPassword: '', newPassword: '' });
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg(e.response?.data?.message || 'Error'); }
  };

  const roleLabels = { estudiante: 'Estudiante', docente: 'Docente', coordinador: 'Coordinador' };

  return (
    <div className="profile-page animate-fadeIn">
      <div className="page-header"><h1>Perfil</h1><p>Información de tu cuenta y configuración.</p></div>

      {msg && <div className="toast toast-success">{msg}</div>}

      <div className="profile-grid">
        <div className="card">
          <h3 className="card-title">Información personal</h3>
          <div className="profile-form">
            <div className="form-group"><label>Nombre completo</label><input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="form-group"><label>Correo electrónico</label><input className="form-input" value={form.email} disabled /></div>
            <div className="form-group"><label>Teléfono</label><input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            {user?.role === 'estudiante' && <div className="form-group"><label>Carrera</label><input className="form-input" value={form.career} onChange={e => setForm(p => ({ ...p, career: e.target.value }))} /></div>}
            {user?.role === 'docente' && <div className="form-group"><label>Departamento</label><input className="form-input" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} /></div>}
            <div className="form-group"><label>Rol</label><input className="form-input" value={roleLabels[user?.role] || user?.role} disabled /></div>
            <div className="form-group"><label>Semestre actual</label><input className="form-input" value={user?.semester || '—'} disabled /></div>
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 20 }}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>

        <div className="card">
          <h3 className="card-title">Cambiar contraseña</h3>
          <div className="profile-form">
            <div className="form-group"><label>Contraseña actual</label><input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} /></div>
            <div className="form-group"><label>Nueva contraseña</label><input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} /></div>
          </div>
          <button className="btn btn-outline" onClick={handleChangePassword} style={{ marginTop: 20 }}>Actualizar contraseña</button>
        </div>
      </div>
    </div>
  );
}
