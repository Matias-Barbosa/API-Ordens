const { z } = require('zod')
const prisma = require('../prisma')

// Schema de validação de cada item do pedido
const orderItemSchema = z.object({
  idItem: z.string().min(1, 'ID do item é obrigatório.'),
  quantidadeItem: z.number().int().positive('Quantidade deve ser um inteiro positivo.'),
  valorItem: z.number().positive('Valor do item deve ser positivo.'),
})

// Schema de validação do body de criação do pedido
const createOrderSchema = z.object({
  numeroPedido: z.string().min(1, 'Número do pedido é obrigatório.'),
  valorTotal: z.number().positive('Valor total deve ser positivo.'),
  dataCriacao: z.coerce.date(), // converte automaticamente string ISO para Date
  items: z.array(orderItemSchema).min(1, 'O pedido deve ter ao menos 1 item.'),
})

// Schema de validação para atualização de status
const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

// Cria um novo pedido no banco de dados
// Realiza o mapeamento dos campos do body (português) para o banco (inglês)
async function criarPedido(req, res) {
    // Valida os dados recebidos no body
    const result = createOrderSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const { numeroPedido, valorTotal, dataCriacao, items } = result.data

    // Mapeia os campos e cria o pedido junto com seus itens
    const order = await prisma.order.create({
        data: {
            orderId: numeroPedido,       // numeroPedido → orderId
            value: valorTotal,           // valorTotal → value
            creationDate: dataCriacao,   // dataCriacao → creationDate
            userId: req.userId,
            items: {
                create: items.map(item => ({
                    productId: parseInt(item.idItem),   // idItem → productId
                    quantity: item.quantidadeItem,       // quantidadeItem → quantity
                    price: item.valorItem,               // valorItem → price
                })),
            },
        },
        include: { items: true },
    })

    return res.status(201).json({ order })
}

// Retorna todos os pedidos do usuário autenticado
async function listarPedidos(req, res) {
    const orders = await prisma.order.findMany({
        where: { userId: req.userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' }, // mais recentes primeiro
    })

    return res.json({ orders })
}

// Retorna um pedido específico pelo ID
async function obterPedido(req, res) {
    const { id } = req.params

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    })

    // Verifica se o pedido existe
    if(!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' })
    }

    // Verifica se o pedido pertence ao usuário autenticado
    if (order.userId !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    return res.json({ order })
}

// Atualiza o status de um pedido existente
async function atualizarStatusPedido(req, res) {
    const { id } = req.params

    // Valida o status recebido no body
    const result = updateStatusSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const order = await prisma.order.findUnique({ where: { id } })

    // Verifica se o pedido existe
    if(!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' })
    }

    // Verifica se o pedido pertence ao usuário autenticado
    if (order.userId !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado.' })
    }

    // Atualiza o status do pedido
    const updated = await prisma.order.update({
        where: { id },
        data: { status: result.data.status },
        include: { items: true },
    })

    return res.json({ order: updated })
}

// Deleta um pedido — apenas pedidos com status PENDING podem ser deletados
async function deletarPedido(req, res){
    const { id } = req.params

    const order = await prisma.order.findUnique({ where: { id } })

    // Verifica se o pedido existe
    if(!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.'})
    }

    // Verifica se o pedido pertence ao usuário autenticado
    if(order.userId !== req.userId) {
        return res.status(403).json({ error: "Acesso negado."})
    }

    // Impede a exclusão de pedidos que já foram processados
    if(order.status !== 'PENDING') {
        return res.status(400).json({ error: 'Apenas pedidos com status PENDING podem ser deletados.' })
    }

    // Deleta primeiro os itens e depois o pedido (respeita a foreign key)
    await prisma.orderItem.deleteMany({ where: { orderId: id } })
    await prisma.order.delete({ where: { id } })

    return res.status(204).send()
}

module.exports = { listarPedidos, obterPedido, criarPedido, atualizarStatusPedido, deletarPedido }