import { useEffect, useState } from "react";
import {
  userService,
  type UserProfile,
} from "../services/userService";

import { Link } from 'react-router-dom';
import './SettingsPage.css';

type Tab = 'perfil' | 'notificaciones' | 'preferencias' | 'privacidad';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile: UserProfile =
          await userService.getCurrentUser();

        setForm((currentForm) => ({
          ...currentForm,
          nombre: profile.name,
          email: profile.email,
        }));
      } catch (error) {
        console.error("Error al cargar el perfil:", error);

        setAlert({
          msg: "No se pudo cargar la información del usuario.",
          type: "error",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);


  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",

    notifRsvp: true,
    notifFotos: true,
    notifResenas: false,
    notifIA: true,

    zonaHoraria: "America/Lima",
    moneda: "PEN",
    formatoFecha: "DD/MM/YYYY",

    galeriaPublica: false,
    permitirDescargas: true,
    mostrarListaInvitados: false,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSave = async () => {
  setAlert(null);

  if (!form.nombre.trim()) {
    setAlert({
      msg: "El nombre no puede estar vacío.",
      type: "error",
    });
    return;
  }

  if (!form.email.trim()) {
    setAlert({
      msg: "El correo no puede estar vacío.",
      type: "error",
    });
    return;
  }

  setIsSaving(true);

  try {
    const updatedProfile =
      await userService.updateCurrentUser({
        name: form.nombre.trim(),
        email: form.email.trim(),
      });

    setForm((currentForm) => ({
      ...currentForm,
      nombre: updatedProfile.name,
      email: updatedProfile.email,
    }));

    setAlert({
      msg: "Los cambios se han guardado correctamente.",
      type: "success",
    });
  } catch (error) {
    console.error("Error al guardar configuración:", error);

    setAlert({
      msg:
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios.",
      type: "error",
    });
  } finally {
    setIsSaving(false);

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }
};


  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        
        if (loadingProfile) {
          return (
            <div className="settings-page">
              <p>Cargando configuración...</p>
            </div>
          );
        }

        return (
          <div className="settings__section animate-fade-in">
            <h2 className="settings__panel-title">Perfil Público</h2>
            
            <div className="settings__avatar-group">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="settings__avatar-preview" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button className="settings__avatar-btn" type="button">Cambiar foto de perfil</button>
                <span className="settings__hint">JPG, PNG o GIF. Máximo 2MB.</span>
              </div>
            </div>

            <div className="settings__field-row">
              <div className="settings__field">
                <label className="settings__label">Nombre completo</label>
                <input className="settings__input" name="nombre" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="settings__field">
                <label className="settings__label">Correo electrónico</label>
                <input className="settings__input" name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="settings__field-row">
              <div className="settings__field">
                <label className="settings__label">Teléfono</label>
                <input className="settings__input" name="telefono" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="settings__field">
                <label className="settings__label">Empresa u Organización</label>
                <input className="settings__input" name="empresa" value={form.empresa} onChange={handleChange} />
              </div>
            </div>

            <div className="settings__field" style={{ marginTop: '1rem' }}>
              <button className="settings__avatar-btn" style={{ width: 'fit-content', color: '#DC2626', borderColor: '#FECACA' }} type="button">
                Cambiar contraseña
              </button>
            </div>
          </div>
        );
      
      case 'notificaciones':
        return (
          <div className="settings__section animate-fade-in">
            <h2 className="settings__panel-title">Notificaciones y Alertas</h2>
            
            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Confirmaciones RSVP</span>
                <span className="settings__toggle-desc">Recibe un correo cada vez que un invitado confirme o rechace.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="notifRsvp" checked={form.notifRsvp} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Nuevas fotos en Galería</span>
                <span className="settings__toggle-desc">Notificarme cuando los invitados suban nuevas fotos compartidas.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="notifFotos" checked={form.notifFotos} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Nuevas reseñas de servicios</span>
                <span className="settings__toggle-desc">Recibe un resumen semanal de las calificaciones de tus proveedores.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="notifResenas" checked={form.notifResenas} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Sugerencias de Inteligencia Artificial ✨</span>
                <span className="settings__toggle-desc">Recibir alertas cuando la IA detecte mejoras en la distribución de mesas o cronograma.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="notifIA" checked={form.notifIA} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'preferencias':
        return (
          <div className="settings__section animate-fade-in">
            <h2 className="settings__panel-title">Preferencias por defecto</h2>
            
            <div className="settings__field">
              <label className="settings__label">Zona Horaria</label>
              <select className="settings__select" name="zonaHoraria" value={form.zonaHoraria} onChange={handleChange}>
                <option value="America/Lima">Lima (GMT-5)</option>
                <option value="America/Bogota">Bogotá (GMT-5)</option>
                <option value="America/Santiago">Santiago (GMT-4)</option>
                <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
              </select>
              <span className="settings__hint">Utilizada para las invitaciones RSVP y el cronograma IA.</span>
            </div>

            <div className="settings__field">
              <label className="settings__label">Moneda principal</label>
              <select className="settings__select" name="moneda" value={form.moneda} onChange={handleChange}>
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>

            <div className="settings__field">
              <label className="settings__label">Formato de fecha</label>
              <select className="settings__select" name="formatoFecha" value={form.formatoFecha} onChange={handleChange}>
                <option value="DD/MM/YYYY">DD/MM/YYYY (Ej. 25/12/2025)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (Ej. 12/25/2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (Ej. 2025-12-25)</option>
              </select>
            </div>
          </div>
        );

      case 'privacidad':
        return (
          <div className="settings__section animate-fade-in">
            <h2 className="settings__panel-title">Privacidad y Seguridad</h2>
            
            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Galería Pública</span>
                <span className="settings__toggle-desc">Cualquier persona con el enlace del evento podrá ver las fotos (sin necesidad de estar en la lista RSVP).</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="galeriaPublica" checked={form.galeriaPublica} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Permitir descarga de fotos</span>
                <span className="settings__toggle-desc">Los invitados podrán descargar las fotos en alta resolución de la galería.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="permitirDescargas" checked={form.permitirDescargas} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings__toggle-group">
              <div className="settings__toggle-text">
                <span className="settings__toggle-title">Mostrar lista de invitados</span>
                <span className="settings__toggle-desc">Los invitados podrán ver quién más asistirá al evento desde su enlace RSVP.</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" name="mostrarListaInvitados" checked={form.mostrarListaInvitados} onChange={handleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      {/* Topbar */}
      <div className="settings__topbar">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Dashboard</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Configuración</span>
        </nav>
        <div className="settings__topbar-actions">
          <button 
            className="btn-save-settings" 
            onClick={handleSave} 
            type="button"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : '💾 Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="settings__header">
        <div className="settings__header-icon">⚙️</div>
        <div className="settings__header-text">
          <h1 className="settings__title">Configuración general</h1>
          <p className="settings__subtitle">Administra tu perfil, notificaciones y preferencias del sistema.</p>
        </div>
      </div>

      {/* Alerta */}
      {alert && (
      <div
        className={`alert alert--${alert.type} animate-fade-in-down`}
        style={{ marginBottom: "1.5rem" }}
          >
        {alert.msg}
      </div>
      )}

      {/* Contenido (Tabs + Form) */}
      <div className="settings__content">
        
        <div className="settings__tabs">
          <button 
            className={`settings__tab ${activeTab === 'perfil' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <span className="settings__tab-icon">👤</span> Perfil
          </button>
          <button 
            className={`settings__tab ${activeTab === 'notificaciones' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('notificaciones')}
          >
            <span className="settings__tab-icon">🔔</span> Notificaciones
          </button>
          <button 
            className={`settings__tab ${activeTab === 'preferencias' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('preferencias')}
          >
            <span className="settings__tab-icon">🌍</span> Preferencias
          </button>
          <button 
            className={`settings__tab ${activeTab === 'privacidad' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('privacidad')}
          >
            <span className="settings__tab-icon">🔒</span> Privacidad
          </button>
        </div>

        <div className="settings__panel">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
