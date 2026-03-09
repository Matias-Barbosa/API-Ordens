const jwt = require('jsonwebtoken')


// MiddleWare de autenticação, verifica se o token JWT é válido
// Deve ser aplicado em todas as rotas protegidas
function authMiddleware(req, res, next) {
    // Obtém o header de autorização da requisição
    const authHeader = req.headers.authorization

    // Verifica se o header existe e esta no formato correto: "Bearer <token>"
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido'})
    }

    // Extrai apenas o token, removendo o prefixo "Bearer "
    const token = authHeader.split(' ')[1]

    try {
        // Valida o token atraves da chave no .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Injeta o userId no objeto req para ser usado nos controller
        req.userId = decoded.userId
        next()
    } catch {
        // Token invalido, expirado ou malformado
        return res.status(401).json({ error: 'Token invalido ou expirado' })
    }
}

module.exports = authMiddleware