const express = require('express')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/pedidos', orderRoutes)

// endpoint para verificar status da API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

module.exports = app