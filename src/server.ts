import { app } from './app.js';
import { connectDB } from './db/mongoose';

/**
 * Puerto de escucha obtenido de variables de entorno o por defecto 3000
 */
const port = process.env.PORT || 3000;

connectDB();

/**
 * Puesta en marcha del servidor
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
