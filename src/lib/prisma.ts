// Singleton PrismaClient — une seule connexion partagée
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

export default prisma
