const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')

const app = express()

app.use(express.json())

const swaggerOptions = { 
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orders API',
            version: '1.0.0',
            description: 'API de gerenciamento de pedidos com auteautenticação JWT'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/auth', authRoutes)
app.use('/pedidos', orderRoutes)

// endpoint para verificar status da API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

module.exports = app