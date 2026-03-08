const { z } = require('zod')
const prisma = require('../prisma')

const orderItemSchema = z.object({
  idItem: z.string().min(1, 'ID do item é obrigatório.'),
  quantidadeItem: z.number().int().positive('Quantidade deve ser um inteiro positivo.'),
  valorItem: z.number().positive('Valor do item deve ser positivo.'),
})

const createOrderSchema = z.object({
  numeroPedido: z.string().min(1, 'Número do pedido é obrigatório.'),
  valorTotal: z.number().positive('Valor total deve ser positivo.'),
  items: z.array(orderItemSchema).min(1, 'O pedido deve ter ao menos 1 item.'),
})

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

async function criarPedido(req, res) {
    const result = createOrderSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const { numeroPedido, valorTotal, items } = result.data

    const order = await prisma.order.create({
        data: {
            orderId: numeroPedido,
            value: valorTotal,
            creationDate: new Date(),
            userId: req.userId,
            items: {
                create: items.map(item => ({
                    productId: parseInt(item.idItem),
                    quantity: item.quantidadeItem,
                    price: item.valorItem,
                })),
            },
        },
        include: { items: true },
    })

    return res.status(201).json({ order })
}

async function listarPedidos(req, res) {
    const orders = await prisma.order.findMany({
        where: { userId: req.userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
    })

    return res.json({ orders })
}

async function obterPedido(req, res) {
    const { id } = req.params

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    })

    if(!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' })
    }

    if (order.userId !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    return res.json({ order })
}

async function atualizarStatusPedido(req, res) {
    const { id } = req.params

    const result = updateStatusSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const order = await prisma.order.findUnique({ where: { id } })

    if(!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' })
    }

    if (order.userId !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    const updated = await prisma.order.update({
        where: { id },
        data: { status: result.data.status },
        include: { items: true },
    })

    return res.json({ order: updated })
}

async function deletarPedido(req, res){
    const { id } = req.params

    const order = await prisma.order.findUnique({ where: { id } })

    if(!order) {
        return res.staus(404).json({ error: 'Pedido não encontrado.'})
    }

    if(order.userId !== req.userId) {
        return res.status(403).json({ error: "Acesso negado."})
    }

    if(order.status !== 'PENDING') {
        return res.status(400).json({ error: 'Apenas pedidos com status PENDING podem ser deletados.' })
    }

    await prisma.orderItem.deleteMany({ where: { orderId: id } })
    await prisma.order.delete({ where: { id } })

    return res.status(204).send()
}

module.exports = { listarPedidos, obterPedido, criarPedido, atualizarStatusPedido, deletarPedido }