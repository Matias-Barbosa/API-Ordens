const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const {
    listarPedidos,
    obterPedido,
    criarPedido,
    atualizarStatusPedido,
    deletarPedido
} = require('../controllers/ordersController')

// Instancia o roteador do Express para definir as rotas de pedidos
const router = Router()

// Aplica o middleware de autenticação em todas as rotas deste roteador
// Ou seja, todas as rotas abaixo exigem um token JWT válido
router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Rotas de gerenciamento de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar todos os pedidos do usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */
// Rota para listar todos os pedidos do usuário autenticado
router.get('/', listarPedidos)

/**
 * @swagger
 * /pedidos/{orderId}:
 *   get:
 *     summary: Obter pedido pelo número do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089016vdb
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
// Rota para obter um pedido específico pelo seu ID
router.get('/:id', obterPedido)

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numeroPedido, valorTotal, dataCriacao, items]
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: v10089016vdb
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [idItem, quantidadeItem, valorItem]
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
// Rota para criar um novo pedido com mapeamento de campos
router.post('/', criarPedido)

/**
 * @swagger
 * /pedidos/{orderId}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089016vdb
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
// Rota para atualizar o status de um pedido existente
router.patch('/:id/status', atualizarStatusPedido)

/**
 * @swagger
 * /pedidos/{orderId}:
 *   delete:
 *     summary: Deletar pedido (apenas pedidos com status PENDING)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089016vdb
 *     responses:
 *       204:
 *         description: Pedido deletado com sucesso
 *       400:
 *         description: Pedido não pode ser deletado pois não está com status PENDING
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
// Rota para deletar um pedido — apenas pedidos com status PENDING podem ser removidos
router.delete('/:id', deletarPedido)

module.exports = router