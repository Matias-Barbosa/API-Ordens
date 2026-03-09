const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')


// Cria um pool de conexões com o banco de dados PostgreSQL
// O pool gerencia multiplas conexões simultaneas de forma eficiente
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Cria o adapter que integra o driver nativo do PostgreSQL com o Prisma
const adapter = new PrismaPg(pool)

// Instancia o cliente do Prisma utilizando o adapter configurado
const prisma = new PrismaClient({ adapter })

module.exports = prisma