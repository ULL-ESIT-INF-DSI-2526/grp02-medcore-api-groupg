import { connect } from 'mongoose';

// Usamos la variable de entorno que definimos en dev.env
const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  console.error('Error: La variable MONGODB_URL no está definida');
} else {
  try {
    await connect(mongodbUrl);
    console.log('Conexión a MongoDB Atlas establecida con éxito');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
  }
}