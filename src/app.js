const express = require('express')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)

// endpoint para verificar status da API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

module.exports = app