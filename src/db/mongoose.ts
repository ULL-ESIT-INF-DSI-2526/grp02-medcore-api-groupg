/**
 * Conexión a MongoDB usando Mongoose.
 * Igual que el ejemplo del profesor: se ejecuta al importar.
 */
import { connect } from "mongoose";

try {
  await connect("mongodb://127.0.0.1:27017/medcore");
  console.log("Connection to MongoDB server established");
} catch (error) {
  console.log(error);
}
