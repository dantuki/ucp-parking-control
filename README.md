<div align="center">

  # 🚗 UCP Parking Control
  ### Sistema IoT & Web de Control y Gestión Automatizada de Parqueaderos

  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/es/docs/Web/JavaScript)
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.x-000000.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    Plataforma full-stack que combina hardware IoT con desarrollo web moderno para resolver el control de ocupación, gestión de acceso y analítica operativa en parqueaderos en tiempo real.
  </p>

</div>

---

## 📋 Tabla de Contenidos
- [Vista General](#-vista-general)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Autor y Créditos](#-autor-y-créditos)

---

## 🎯 Vista General

**UCP Parking Control** integra sensores físicos de presencia con una aplicación web centralizada. Diseñado para optimizar la trazabilidad operativa, mitigar la congestión vehicular y automatizar la asignación de espacios, el sistema procesa datos en tiempo real desde la detección física hasta la facturación final.

---

## 🚀 Características Principales

* 📡 **Monitoreo IoT en Tiempo Real:** Detección automática de ocupación por celda sincronizada al instante con la interfaz web.
* 🎫 **Gestión de Entradas y Salidas:** Registro automatizado de vehículos, sellado de tiempo de permanencia y generación de comprobantes.
* 💰 **Motor de Tarifas Dinámicas:** Cálculo de cobros según categoría vehicular, tiempos de estadía y reglas de negocio configurables.
* 🧩 **Asignación Inteligente de Celdas:** Guiado de usuarios a espacios libres óptimos para reducir tiempos de circulación.
* 📊 **Dashboard Analítico:** Panel de control con métricas de flujo vehicular, horas pico, tasa de ocupación e ingresos consolidados.

---

## 🏗️ Arquitectura del Sistema

```text
  [ Sensores IoT / Hardware ]
              │
              ▼  (Eventos / HTTP / Sockets)
   ┌──────────────────────┐
   │    REST API Backend  │ ◄─── Node.js & Express.js
   └──────────┬───────────┘
              │
              ▼  (Estado & Consultas)
   ┌──────────────────────┐
   │   Frontend Web App   │ ◄─── React.js (Dashboard & Control)
   └──────────────────────┘
