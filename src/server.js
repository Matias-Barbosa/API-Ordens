// Carrega as variaveis de ambiente do arquivo .env
require('dotenv').config()
const app = require('./app')

// Define a porta do servidor, usando a variavel de ambiente ou 3000 como padrão
const PORT = process.env.PORT || 3000


// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`)
})