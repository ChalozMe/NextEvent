import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {

      if (isRegister) {

        if (!fullName.trim()) {
          setError("Por favor ingresa tu nombre completo.");
          return;
        }

        await register({
          username: email.split("@")[0],
          fullName,
          email,
          password
        });

        navigate("/");
        return;
      }

      await login({ email, password });
      navigate("/");

      } catch (error) {

        console.error(error);
        setError("Error al iniciar sesión o registrar usuario.");

      } finally {
      setIsLoading(false);
    }
  };
  
  {/*
  const fillDemoCredentials = () => {
    setEmail('admin@nexevent.com');
    setPassword('admin123');
  };
  */}

  return (
    <div className="split-login">
      {/* LEFT SIDE - BANNER */}
      <div className="split-login__banner">
        <div className="split-login__logo">
          <div className="split-login__logo-icon">✦</div>
          <span>NexEvent</span>
        </div>

        <div className="split-login__badge">
          Plataforma inteligente para eventos
        </div>

        <h1 className="split-login__title">
          Organiza eventos
          <span className="split-login__title-highlight">sin complicaciones</span>
        </h1>

        <p className="split-login__subtitle">
          Gestiona cronogramas, invitados, presupuestos y tareas desde una sola plataforma impulsada por IA.
        </p>

        {/* Decorative elements to mimic the image */}
        <div className="split-login__decorations">
          <div className="decor-card decor-calendar">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cronograma</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#10B981' }}>✓ Reservar local</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#10B981' }}>✓ Confirmar catering</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#4F46E5' }}>○ Enviar invitaciones</div>
          </div>
          <div className="decor-card decor-budget">
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Presupuesto</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>$4,560</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '0.5rem' }}>de $7,000</div>
            <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px' }}>
              <div style={{ width: '65%', height: '100%', background: '#4F46E5', borderRadius: '2px' }}></div>
            </div>
          </div>
          <div className="decor-card decor-tasks">
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>Tareas completadas</div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '6px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '1rem', fontWeight: 700 }}>
              68%
            </div>
          </div>
        </div>

        <div className="split-login__trust">
          <div className="split-login__trust-icon">🛡️</div>
          <div>
            <strong>Más de 2,500 organizadores</strong> confían en NexEvent para hacer eventos inolvidables.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="split-login__form-side">
        <div className="split-login__header">
          <span>¿Necesitas ayuda?</span>
          <a href="#" className="btn-contact">🎧 Contáctanos</a>
        </div>

        <div className="split-login__form-container">
          <div className="form-logo">
            <div className="split-login__logo-icon" style={{ width: '24px', height: '24px' }}>✦</div>
            <span>NexEvent</span>
          </div>

          <h2 className="form-title">
            {isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </h2>
          <p className="form-subtitle">
            {isRegister
              ? 'Regístrate para comenzar a planificar eventos.'
              : 'Inicia sesión para continuar gestionando tus eventos.'}
          </p>

          {error && (
            <div className="split-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="split-input-group">
              <label className="split-input-label" htmlFor="email">
                Correo electrónico
              </label>
              <div className="split-input-wrapper">
                <span className="split-input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  className="split-input"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="split-input-group">
                <label className="split-input-label" htmlFor="fullName">
                  Nombre completo
                </label>
                <div className="split-input-wrapper">
                  <span className="split-input-icon">👤</span>
                  <input
                    id="fullName"
                    type="text"
                    className="split-input"
                    placeholder="Tu nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="split-input-group">
              <label className="split-input-label" htmlFor="password">
                Contraseña
              </label>
              <div className="split-input-wrapper">
                <span className="split-input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="split-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="split-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isRegister && (
              <div className="split-form-options">
                <label className="split-checkbox">
                  <input type="checkbox" /> Recordarme
                </label>
                <a href="#" className="split-forgot">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button type="submit" className="split-btn-primary" disabled={isLoading}>
              {isLoading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Iniciar Sesión →'}
            </button>
          </form>

          {!isRegister && (
            <>
            </>
          )}

          <div className="split-footer">
            {isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Inicia sesión' : 'Crear cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
