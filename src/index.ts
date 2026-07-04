import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
dotenv.config()

import logger from './utils/logger'
import { loggerMiddleware } from './middlewares/logger.middleware'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import stockRoutes from './routes/stock.routes'
import commandeRoutes from './routes/commande.routes'
import livraisonRoutes from './routes/livraison.routes'
import clientRoutes from './routes/client.routes'
import transfertRoutes from './routes/transfert.routes'
import dashboardRoutes from './routes/dashboard.routes'
import agenceRoutes from './routes/agence.routes'
import fruitRoutes from './routes/fruit.routes'
import retourRoutes from './routes/retour.routes'

const app = express()
const PORT = process.env.PORT || 3000

// Créer les dossiers nécessaires
const dossiers = ['logs', 'uploads']
dossiers.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
})

// Middlewares globaux
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(loggerMiddleware)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/auth', authRoutes)
app.use('/admin/users', userRoutes)
app.use('/stock', stockRoutes)
app.use('/commandes', commandeRoutes)
app.use('/livraisons', livraisonRoutes)
app.use('/clients', clientRoutes)
app.use('/transferts', transfertRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/agences', agenceRoutes)
app.use('/fruits', fruitRoutes)
app.use('/retours', retourRoutes)
app.get('/health', (req, res) => res.json({ status: "ok", timestamp: new Date() }))

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', version: '1.0.0', timestamp: new Date().toISOString() })
})

// Route inexistante
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} introuvable.`,
  })
})

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(`Serveur FruitImport demarre sur http://localhost:${PORT}`)
  logger.info(`Environnement : ${process.env.NODE_ENV || 'development'}`)
})

export default app
