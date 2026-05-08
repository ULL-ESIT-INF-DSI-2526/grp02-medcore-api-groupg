import express from "express";
import "./db/mongoose.js";


import { medicationRouter } from "./routes/medication.js";
import { defaultRouter } from "./routes/default.js";


import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";


export const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(medicationRouter);
app.use(defaultRouter);


