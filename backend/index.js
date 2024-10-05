import express from 'express';
import dotenv from 'dotenv'; // Importa dotenv para cargar variables de entorno
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import boardRoutes from './routes/board.routes.js';
import columnRoutes from './routes/column.routes.js';
import taskRoutes from './routes/task.routes.js';

dotenv.config(); // Carga las variables de entorno

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', boardRoutes);
app.use('/api', columnRoutes);
app.use('/api', taskRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});