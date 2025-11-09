import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import plantasRoutes from './routes/plantas.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';

// Importar inicialización de base de datos
import './config/init-database.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de formularios

// Servir archivos estáticos (imágenes)
app.use('/recursos/imagenes', express.static(path.join(__dirname, '../../recursos/imagenes')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/plantas', plantasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        texto: "Texto agregado desde la rama de Svein",
        mensaje: 'API de Jardín Botánico',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            plantas: '/api/plantas',
            solicitudes: '/api/solicitudes'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        ruta: req.url
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/`);
});

export default app;
