
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
🛠️ Stack TecnológicoCapaTecnologíaDescripciónFrontendReact.jsInterfaz reactiva, modular e intuitivaBackendNode.js & Express.jsAPI RESTful sólida para procesamiento de eventosHardware / IoTSensores FísicosDetección de ocupación por celdaControl de VersionesGit & GitHubFlujo de trabajo colaborativo y modular📁 Estructura del ProyectoBashucp-parking-control/
├── client/                 # Aplicación Frontend (React.js)
│   ├── src/
│   │   ├── components/     # Componentes de interfaz reutilizables
│   │   ├── pages/          # Vistas (Dashboard, Entradas, Métricas)
│   │   └── services/       # Conexión con la API REST
│   └── package.json
├── server/                 # API Backend (Node.js + Express)
│   ├── config/             # Variables de entorno y DB
│   ├── controllers/        # Lógica de negocio y tarifación
│   ├── routes/             # Endpoints REST
│   └── package.json
└── README.md
⚡ Instalación y ConfiguraciónPrerrequisitosNode.js >= 18.0.0npm o yarnDispositivos o simuladores IoT configurados para envío de eventos HTTP/Socket1. Clonar el repositorioBashgit clone [https://github.com/dantuki/ucp-parking-control.git](https://github.com/dantuki/ucp-parking-control.git)
cd ucp-parking-control
2. Configurar el BackendBashcd server
npm install
npm run dev
3. Configurar el FrontendEn una nueva terminal:Bashcd client
npm install
npm start
🔌 Endpoints de la API (Resumen)MétodoEndpointDescripciónGET/api/parking/statusObtiene el estado y ocupación general de las celdasPOST/api/parking/entryRegistra el ingreso de un nuevo vehículoPOST/api/parking/exitRegistra salida y retorna tarifa calculadaGET/api/analytics/metricsObtiene indicadores clave para el dashboard👨‍💻 AutorDesarrollado por Daniel Bedoya López (@dantuki)Tecnólogo en Desarrollo de Software - Universidad Católica de Pereira
