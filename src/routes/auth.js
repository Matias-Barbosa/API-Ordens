const { Router } = require('express')
const { register, login } = require('../controllers/authController')

// Instancia o roteador do Express para definir as rotas de autenticação
const router = Router()

/**
 * @swagger
 * tags:
 *      name: Auth
 *      description: Rotas de autenticação
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: matias
 *               email:
 *                 type: string
 *                 example: matias@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
// Rota para cadastro de novo usuário
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário e obter token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: matias@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */
// Rota para autenticação do usuário e geração do token JWT
router.post('/login', login)

module.exports = router