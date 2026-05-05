import express from 'express'
import './db/mongoose.js'
import patientRouter from './routes/Rpatient.js' 
import staffRouter from './routes/Rstaff.js'

export const app = express()
app.use(express.json())

app.use('/patients', patientRouter)
app.use('/staff', staffRouter)

/**
 * Manejador para rutas no implementadas
 * Devuelve un estado 501 
 */
app.all('/{*splat}', (_, res) => {
  res.status(501).send()
})