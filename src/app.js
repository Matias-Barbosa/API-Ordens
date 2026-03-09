const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')


// Inicializa app Express
const app = express()


// Permite que a API receba e interprete JSON no body
app.use(express.json())


// Configurações do Swagger
const swaggerOptions = { 
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orders API',
            version: '1.0.0',
            description: 'API de gerenciamento de pedidos com autenticação JWT'
        },
        components: {
            // Define o esquema de autenticação JWT via Bearer Token
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },

    // Caminho dos arquivos onde o Swagger vai buscar as anotações das rotas
    apis: ['./src/routes/*.js'],
}


// Gera a especificação Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Disponibiliza documentacao no http://localhost:3000/docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rotas do authenticator
app.use('/auth', authRoutes)

// Rota de gerenciamento de pedidos
app.use('/pedidos', orderRoutes)

// Endpoint para verificar status da API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Trata rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada." })
})

// Trata erros internos inesperados
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Erro interno do servidor.' })
})

module.exports = app