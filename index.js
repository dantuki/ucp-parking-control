require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ===============================
// CONEXIÓN MONGO
// ===============================

mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/ucp_parking'
)
.then(() => console.log('✅ MONGO CONECTADO'))
.catch(err => console.error('❌ Error Mongo:', err));

const EventModel = mongoose.model('Event', new mongoose.Schema({
    device_id: String,
    user_id: String,
    tipo_acceso: String,
    evento: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}));

// ===============================
// CUPOS INICIALES
// ===============================

let cuposDisponibles = 70;

// ===============================
// SERIAL ESP32
// ===============================

const puertoCOM = process.env.SERIAL_PORT || 'COM3';

let port;
let parser;

try {
    port = new SerialPort({
        path: puertoCOM,
        baudRate: 115200
    });

    parser = port.pipe(
        new ReadlineParser({
            delimiter: '\r\n'
        })
    );

    port.on('open', () => {
        console.log(`🔌 Puerto serial ${puertoCOM} abierto correctamente`);
    });

    // SERIAL DATA (Solo se ejecuta si el puerto abre bien)
    parser.on('data', async (data) => {
        const comando = data.trim();
        console.log("📥 Serial recibido:", comando);

        if (comando === "S_ENTRADA_ACTIVO") {
            if (cuposDisponibles > 0) {
                cuposDisponibles--;
                console.log(`🚗 Entrada detectada por ESP32`);
                io.emit('actualizar_cupos', cuposDisponibles);
                try {
                    await EventModel.create({
                        device_id: "BOTON_ENTRADA",
                        user_id: "MANUAL",
                        tipo_acceso: "PULSADOR",
                        evento: "entrada"
                    });
                } catch (e) { console.error(e); }
            }
        }

        if (comando === "S_SALIDA_ACTIVO") {
            if (cuposDisponibles < 70) {
                cuposDisponibles++;
                console.log(`🚗 Salida detectada por ESP32`);
                io.emit('actualizar_cupos', cuposDisponibles);
                try {
                    await EventModel.create({
                        device_id: "BOTON_SALIDA",
                        user_id: "MANUAL",
                        tipo_acceso: "PULSADOR",
                        evento: "salida"
                    });
                } catch (e) { console.error(e); }
            }
        }
    });

} catch (err) {
    console.log("⚠️ No se pudo abrir el puerto Serial. Trabajando en modo simulación/web.");
}

// ===============================
// SOCKET SERVER
// ===============================

const server = app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ===============================
// SOCKET CONNECTION
// ===============================

io.on('connection', (socket) => {
    console.log('💻 Frontend conectado');
    socket.emit('actualizar_cupos', cuposDisponibles);
});

// ===============================
// API ENDPOINTS
// ===============================

app.get('/api/cupos', (req, res) => {
    res.json({ cupos: cuposDisponibles });
});

// Endpoint para traer el historial ordenado por fecha más reciente
app.get('/api/historial', async (req, res) => {
    try {
        const registros = await EventModel.find().sort({ timestamp: -1 }).limit(20);
        res.json(registros);
    } catch (err) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

// Botón Manual Web: Entrada
app.post('/api/manual-entrada', async (req, res) => {
    if (cuposDisponibles > 0) {
        cuposDisponibles--;
        io.emit('actualizar_cupos', cuposDisponibles);
        try {
            const nuevoEvento = await EventModel.create({
                device_id: "WEB_ADMIN",
                user_id: "ADMIN_PANEL",
                tipo_acceso: "DIGITAL",
                evento: "entrada"
            });
            return res.json({ success: true, cupos: cuposDisponibles, registro: nuevoEvento });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
    res.status(400).json({ error: "Parqueadero lleno" });
});

// Botón Manual Web: Salida
app.post('/api/manual-salida', async (req, res) => {
    if (cuposDisponibles < 70) {
        cuposDisponibles++;
        io.emit('actualizar_cupos', cuposDisponibles);
        try {
            const nuevoEvento = await EventModel.create({
                device_id: "WEB_ADMIN",
                user_id: "ADMIN_PANEL",
                tipo_acceso: "DIGITAL",
                evento: "salida"
            });
            return res.json({ success: true, cupos: cuposDisponibles, registro: nuevoEvento });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
    res.status(400).json({ error: "Parqueadero vacío" });
});