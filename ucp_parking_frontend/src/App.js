import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import {
  History,
  Users,
  ShieldCheck,
  LogIn,
  LogOut,
  Activity,
  Car,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const COLORS = {
  bgMain: "#0F1319",
  cardBg: "#181D26",
  border: "#262C36",
  yellowUCP: "#FFCC00",
  greenUCP: "#00A859",
  redUCP: "#FF3B30",
  textWhite: "#FFFFFF",
  textMuted: "#8B95A5"
};

function App() {
  const [view, setView] = useState('user');

  const [estado, setEstado] = useState({
    espaciosLibres: 70,
    totalCeldas: 70
  });

  const [historial, setHistorial] = useState([]);

  const fontMain = "'Open Sans', sans-serif";
  const fontTitles = "'Montserrat', sans-serif";

  const cuposOcupados = estado.totalCeldas - estado.espaciosLibres;
  const porcentajeOcupacion = Math.round((cuposOcupados / estado.totalCeldas) * 100);
  const hayCupos = estado.espaciosLibres > 0;

  const cargarHistorial = async () => {
    try {
      const resHistorial = await axios.get(`${API_URL}/historial`);
      setHistorial(resHistorial.data);
    } catch (e) {
      console.log("⚠️ Error cargando historial:", e);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resCupos = await axios.get(`${API_URL}/cupos`);
        setEstado(prev => ({
          ...prev,
          espaciosLibres: Number(resCupos.data.cupos)
        }));
        if (view === 'admin') {
          await cargarHistorial();
        }
      } catch (err) {
        console.error("❌ Error Axios:", err);
      }
    };
    fetchInitialData();
  }, [view]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true
    });

    socket.on('connect', () => console.log("🟢 WebSocket conectado"));

    socket.on('actualizar_cupos', (cupos) => {
      setEstado(prev => ({ ...prev, espaciosLibres: Number(cupos) }));
      if (view === 'admin') cargarHistorial();
    });

    socket.on('disconnect', () => console.log("🔴 WebSocket desconectado"));

    return () => {
      socket.off('actualizar_cupos');
      socket.disconnect();
    };
  }, [view]);

  const manejarEntradaManual = async () => {
    try { await axios.post(`${API_URL}/manual-entrada`); } 
    catch (err) { console.error("Error entrada:", err); }
  };

  const manejarSalidaManual = async () => {
    try { await axios.post(`${API_URL}/manual-salida`); } 
    catch (err) { console.error("Error salida:", err); }
  };

  const cardStyle = {
    backgroundColor: COLORS.cardBg,
    borderRadius: '18px',
    border: `1px solid ${COLORS.border}`,
    padding: '25px',
    boxShadow: '0 16px 50px rgba(0,0,0,0.28)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)'
  };

  const thStyle = {
    padding: '15px',
    textAlign: 'center',
    fontSize: '13px',
    color: COLORS.yellowUCP,
    fontWeight: '700',
    borderBottom: `1px solid ${COLORS.border}`
  };
  const tdStyle = {
    padding: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: COLORS.textMuted,
    borderBottom: `1px solid ${COLORS.border}`
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily: fontMain,
        backgroundColor: COLORS.bgMain,
        minHeight: '100vh',
        color: COLORS.textWhite,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ===== SOL UCP DE FONDO ===== */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <svg
          viewBox="0 0 1200 1200"
          style={{
            position: 'absolute',
            width: '1400px',
            height: '1400px',
            top: '-350px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.07,
            filter: 'drop-shadow(0 0 40px rgba(255,204,0,0.25))'
          }}
        >
          <defs>
            <radialGradient id="sunCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFCC00" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFCC00" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          {/* CENTRO */}
          <circle
            cx="600"
            cy="600"
            r="150"
            fill="url(#sunCenter)"
          />

          {/* RAYOS ORGÁNICOS ESTILO UCP */}
          {[
            0, 15, 30, 45, 60, 75, 90, 105,
            120, 135, 150, 165, 180, 195,
            210, 225, 240, 255, 270, 285,
            300, 315, 330, 345
          ].map((angle, i) => (
            <g
              key={i}
              transform={`rotate(${angle} 600 600)`}
            >
              <path
                d="
                  M600 390
                  C620 330, 660 300, 640 220
                  C620 170, 690 160, 680 240
                  C670 310, 640 350, 620 420
                  Z
                "
                fill="#FFCC00"
              />
            </g>
          ))}

          {/* ARO SUAVE */}
          <circle
            cx="600"
            cy="600"
            r="220"
            fill="none"
            stroke="#FFCC00"
            strokeWidth="8"
            opacity="0.15"
          />
        </svg>

        {/* OSCURECER PARA QUE NO MOLESTE */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,19,25,0.15), rgba(15,19,25,0.85) 70%, rgba(15,19,25,1))'
          }}
        />
      </div>

      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          backgroundColor: 'rgba(24, 29, 38, 0.90)',
          borderBottom: `2px solid ${COLORS.yellowUCP}`,
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.24)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: COLORS.yellowUCP, padding: '10px', borderRadius: '10px', display: 'flex', boxShadow: '0 8px 20px rgba(255,204,0,0.18)' }}>
            <Car size={24} color={COLORS.bgMain} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontFamily: fontTitles, margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
              UCP PARKING CONTROL
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: COLORS.yellowUCP, fontWeight: '700', letterSpacing: '1px' }}>
              SMART MANAGEMENT SYSTEM
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '30px', border: `1px solid ${COLORS.border}` }}>
          <Activity size={16} color={COLORS.textMuted} />
          <span style={{ fontSize: '13px', color: COLORS.textWhite, fontWeight: '600' }}>Sistema Operativo</span>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.greenUCP, boxShadow: `0 0 8px ${COLORS.greenUCP}` }}></div>
        </div>
      </header>

      {/* NAVEGACIÓN */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '25px 0', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => setView('user')}
          style={{
            padding: '10px 25px', cursor: 'pointer', borderRadius: '8px', border: `1px solid ${view === 'user' ? COLORS.yellowUCP : 'transparent'}`,
            backgroundColor: view === 'user' ? 'rgba(255, 204, 0, 0.12)' : COLORS.cardBg,
            color: view === 'user' ? COLORS.yellowUCP : COLORS.textMuted,
            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', transition: '0.3s',
            boxShadow: view === 'user' ? '0 10px 25px rgba(255,204,0,0.10)' : 'none'
          }}
        >
          <Users size={18} /> VISTA USUARIO
        </button>
        <button
          onClick={() => setView('admin')}
          style={{
            padding: '10px 25px', cursor: 'pointer', borderRadius: '8px', border: `1px solid ${view === 'admin' ? COLORS.yellowUCP : 'transparent'}`,
            backgroundColor: view === 'admin' ? 'rgba(255, 204, 0, 0.12)' : COLORS.cardBg,
            color: view === 'admin' ? COLORS.yellowUCP : COLORS.textMuted,
            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', transition: '0.3s',
            boxShadow: view === 'admin' ? '0 10px 25px rgba(255,204,0,0.10)' : 'none'
          }}
        >
          <ShieldCheck size={18} /> VISTA ADMIN
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: '0 30px 40px 30px', flex: '1', position: 'relative', zIndex: 1 }}>

        {/* VISTA USUARIO */}
        {view === 'user' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ ...cardStyle, width: '420px', textAlign: 'center', padding: '40px 30px' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(255,204,0,0.08), transparent 40%)', pointerEvents: 'none' }} />

              <h2 style={{ fontFamily: fontTitles, color: COLORS.textWhite, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0 0 30px 0', position: 'relative', zIndex: 1 }}>
                <Activity size={20} color={COLORS.yellowUCP} /> CELDAS DISPONIBLES
              </h2>

              {/* BANNER DE ALERTA AL LLEGAR A 0 */}
              {!hayCupos && (
                <div style={{
                  backgroundColor: 'rgba(255, 59, 48, 0.15)',
                  border: `1px solid ${COLORS.redUCP}`,
                  color: COLORS.redUCP,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '25px',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 8px 24px rgba(255, 59, 48, 0.15)',
                  letterSpacing: '0.5px'
                }}>
                  <AlertTriangle size={18} color={COLORS.redUCP} /> ¡ALERTA: PARQUEADERO LLENO!
                </div>
              )}

              {/* CÍRCULO CENTRAL CON CAMBIO DINÁMICO DE COLOR */}
              <div style={{
                width: '200px', height: '200px', margin: '0 auto', borderRadius: '50%',
                background: hayCupos
                  ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(0,168,89,0.95) 35%, #00994f 100%)'
                  : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(214,40,40,0.95) 35%, #b31616 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `6px solid ${hayCupos ? COLORS.yellowUCP : COLORS.redUCP}`, 
                boxShadow: hayCupos
                  ? '0 0 40px rgba(0,168,89,0.28), inset 0 0 20px rgba(255,255,255,0.05)'
                  : '0 0 40px rgba(255,59,48,0.45), inset 0 0 20px rgba(255,255,255,0.05)',
                position: 'relative', zIndex: 1,
                transition: 'all 0.4s ease'
              }}>
                <span style={{ fontSize: '90px', fontWeight: '800', color: COLORS.textWhite, textShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>
                  {estado.espaciosLibres}
                </span>
              </div>

              {/* PILL INFERIOR DINÁMICO */}
              <div style={{ 
                marginTop: '25px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: hayCupos ? 'rgba(0, 168, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                border: `1px solid ${hayCupos ? COLORS.greenUCP : COLORS.redUCP}`, 
                position: 'relative', 
                zIndex: 1,
                transition: 'all 0.4s ease'
              }}>
                <CheckSquare size={16} color={hayCupos ? COLORS.greenUCP : COLORS.redUCP} />
                <span style={{ color: hayCupos ? COLORS.greenUCP : COLORS.redUCP, fontWeight: '700', fontSize: '14px' }}>
                  {hayCupos ? "Hay cupos disponibles" : "Parqueadero lleno"}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: `1px solid ${COLORS.border}`, paddingTop: '20px', position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: COLORS.yellowUCP }}>{estado.totalCeldas}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '600' }}>TOTAL CELDAS</div>
                </div>
                <div style={{ width: '1px', backgroundColor: COLORS.border }}></div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: COLORS.textWhite }}>{cuposOcupados}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '600' }}>OCUPADAS</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA ADMIN */}
        {view === 'admin' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>

            {/* Fila de Estadísticas Superiores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: '700', marginBottom: '10px' }}>ESPACIOS LIBRES</div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: COLORS.greenUCP }}>{estado.espaciosLibres}</div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: '700', marginBottom: '10px' }}>OCUPACIÓN ACTUAL</div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: COLORS.yellowUCP }}>{porcentajeOcupacion}%</div>
              </div>
            </div>

            {/* Panel de Controles Manuales */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${COLORS.greenUCP}, ${COLORS.yellowUCP}, ${COLORS.redUCP})` }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,204,0,0.08), transparent 35%)', pointerEvents: 'none' }} />
              <h3 style={{ fontFamily: fontTitles, color: COLORS.textWhite, fontSize: '14px', textAlign: 'center', marginTop: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
                <Activity size={18} color={COLORS.yellowUCP} /> CONTROLES MANUALES DE SIMULACIÓN
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                <button onClick={manejarEntradaManual} style={{ padding: '12px 30px', backgroundColor: COLORS.greenUCP, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', boxShadow: `0 8px 20px rgba(0, 168, 89, 0.22)` }}>
                  <LogIn size={18} /> ENTRADA
                </button>
                <button onClick={manejarSalidaManual} style={{ padding: '12px 30px', backgroundColor: COLORS.redUCP, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', boxShadow: `0 8px 20px rgba(255, 59, 48, 0.20)` }}>
                  <LogOut size={18} /> SALIDA
                </button>
              </div>
            </div>

            {/* Tabla de Auditoría */}
            <div style={cardStyle}>
              <h2 style={{ fontFamily: fontTitles, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.textWhite, borderBottom: `2px solid ${COLORS.yellowUCP}`, paddingBottom: '15px', margin: '0 0 15px 0' }}>
                <History size={20} color={COLORS.yellowUCP} /> AUDITORÍA DE REGISTROS
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>HORA</th>
                    <th style={thStyle}>EVENTO</th>
                    <th style={thStyle}>ORIGEN</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((evt, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={tdStyle}>
                        <span style={{ color: evt.evento === 'entrada' ? COLORS.greenUCP : COLORS.redUCP, fontWeight: '700', fontSize: '13px' }}>
                          {evt.evento ? evt.evento.toUpperCase() : 'N/A'}
                        </span>
                      </td>
                      <td style={tdStyle}>{evt.device_id === 'WEB_ADMIN' ? '💻 PANEL WEB' : '🔌 SENSOR FÍSICO'}</td>
                    </tr>
                  ))}
                  {historial.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: '30px', color: COLORS.textMuted, textAlign: 'center', fontSize: '14px' }}>
                        No hay registros guardados todavía en la base de datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: COLORS.cardBg, borderTop: `1px solid ${COLORS.border}`, padding: '20px', textAlign: 'center', color: COLORS.textMuted, fontSize: '12px', position: 'relative', zIndex: 1 }}>
        <p style={{ margin: 0, fontWeight: '600' }}>© 2026 UCP Parking Control. Todos los derechos reservados.</p>
        <p style={{ margin: '4px 0 0 0', color: COLORS.yellowUCP, fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px' }}>UNIVERSIDAD CATÓLICA DE PEREIRA • Desarrollo de Software</p>
      </footer>

    </div>
  );
}

export default App;