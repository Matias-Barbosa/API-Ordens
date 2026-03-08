const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const {
    listarPedidos,
    obterPedido,
    criarPedido,
    atualizarStatusPedido,
    deletarPedido
} = require('../controllers/ordersController')

const router = Router()

router.use(authMiddleware)

router.get('/', listarPedidos)
router.get('/:id', obterPedido)
router.post('/', criarPedido)
router.patch('/:id/status', atualizarStatusPedido)
router.delete('/:id', deletarPedido)

module.exports = router