/**
 * Login.test.jsx — Pruebas unitarias del componente Login
 * Cobertura: renderizado, validación de formulario, accesibilidad WCAG,
 * manejo de errores, estados de carga y quick-login.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../pages/Login';

// Mock the AuthContext
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────
  describe('Renderizado básico', () => {
    it('debe renderizar el título UniScheduler', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: /UniScheduler/i })).toBeInTheDocument();
    });

    it('debe renderizar el campo de correo electrónico', () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('debe renderizar el campo de contraseña', () => {
      renderLogin();
      const passInput = screen.getByLabelText(/contraseña/i);
      expect(passInput).toBeInTheDocument();
      expect(passInput).toHaveAttribute('type', 'password');
    });

    it('debe renderizar el botón de inicio de sesión', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe renderizar los botones de acceso rápido', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /coordinador/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /docente/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /estudiante/i })).toBeInTheDocument();
    });
  });

  // ── WCAG Accessibility ────────────────────────────────────────────────────
  describe('Accesibilidad WCAG 2.1', () => {
    it('SC 1.3.1: el formulario tiene aria-label', () => {
      renderLogin();
      const form = screen.getByRole('form', { name: /formulario de inicio de sesión/i });
      expect(form).toBeInTheDocument();
    });

    it('SC 1.1.1: los íconos decorativos tienen aria-hidden', () => {
      renderLogin();
      const decorativeIcons = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeIcons.length).toBeGreaterThan(0);
    });

    it('SC 4.1.3: existe región de alerta para errores (aria-live)', () => {
      renderLogin();
      const alertRegion = screen.getByRole('alert');
      expect(alertRegion).toBeInTheDocument();
      expect(alertRegion).toHaveAttribute('aria-live', 'assertive');
    });

    it('SC 1.3.5: campo de email tiene autocomplete=email', () => {
      renderLogin();
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveAttribute('autocomplete', 'email');
    });

    it('SC 1.3.5: campo de contraseña tiene autocomplete=current-password', () => {
      renderLogin();
      expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('autocomplete', 'current-password');
    });

    it('SC 3.3.2: campos tienen aria-required=true', () => {
      renderLogin();
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('aria-required', 'true');
    });

    it('SC 2.4.6: botones de acceso rápido tienen aria-label descriptivo', () => {
      renderLogin();
      const coordBtn = screen.getByRole('button', { name: /acceso rápido como coordinador/i });
      expect(coordBtn).toBeInTheDocument();
    });
  });

  // ── Form Behavior ─────────────────────────────────────────────────────────
  describe('Comportamiento del formulario', () => {
    it('debe actualizar el valor del email al escribir', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'nuevo@test.com');
      expect(emailInput).toHaveValue('nuevo@test.com');
    });

    it('debe actualizar el valor de la contraseña al escribir', async () => {
      renderLogin();
      const passInput = screen.getByLabelText(/contraseña/i);
      await userEvent.clear(passInput);
      await userEvent.type(passInput, 'nuevapass');
      expect(passInput).toHaveValue('nuevapass');
    });

    it('debe llamar a login con las credenciales correctas al enviar', async () => {
      mockLogin.mockResolvedValue({ role: 'admin' });
      renderLogin();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passInput = screen.getByLabelText(/contraseña/i);
      const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });

      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'test@uni.edu');
      await userEvent.clear(passInput);
      await userEvent.type(passInput, 'pass123');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@uni.edu', 'pass123');
      });
    });

    it('debe navegar al dashboard tras login exitoso', async () => {
      mockLogin.mockResolvedValue({ role: 'admin' });
      renderLogin();

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('debe mostrar mensaje de error cuando login falla', async () => {
      mockLogin.mockRejectedValue({
        response: { data: { message: 'Credenciales inválidas' } },
      });
      renderLogin();

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => {
        expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje genérico si el error no tiene response', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'));
      renderLogin();

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => {
        expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument();
      });
    });
  });

  // ── Loading State ─────────────────────────────────────────────────────────
  describe('Estado de carga', () => {
    it('debe deshabilitar el botón durante la carga', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderLogin();

      const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(submitBtn).toBeDisabled();
      });
    });

    it('debe tener aria-busy=true durante la carga', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {}));
      renderLogin();

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => {
        const btn = screen.getByRole('button', { name: /iniciando sesión/i });
        expect(btn).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  // ── Quick Login ────────────────────────────────────────────────────────────
  describe('Acceso rápido', () => {
    it('debe ejecutar quickLogin al hacer clic en perfil Coordinador', async () => {
      mockLogin.mockResolvedValue({ role: 'admin' });
      renderLogin();

      const coordBtn = screen.getByRole('button', { name: /acceso rápido como coordinador/i });
      fireEvent.click(coordBtn);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('admin@uni.edu', 'admin123');
      });
    });

    it('debe ejecutar quickLogin con credenciales de docente', async () => {
      mockLogin.mockResolvedValue({ role: 'teacher' });
      renderLogin();

      const docenteBtn = screen.getByRole('button', { name: /acceso rápido como docente/i });
      fireEvent.click(docenteBtn);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('ana.vargas@uni.edu', 'docente123');
      });
    });
  });
});
