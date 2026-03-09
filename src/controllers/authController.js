const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const prisma = require('../prisma')

// Schema de validação dos dados de cadastro
const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
    email: z.string().email('Email inválido.'),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
})

// Schema de validação dos dados de login
const loginSchema = z.object({
    email: z.string().email('E-mail invalido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

// Cadastra um novo usuário no banco de dados
async function register(req, res){
    // Valida os dados recebidos no body
    const result = registerSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const { name, email, password } = result.data

    // Verifica se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if(existingUser) {
        return res.status(409).json({ error: 'E-mail ja cadastrado.' })
    }

    // Gera o hash da senha antes de salvar no banco (fator 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário no banco, retornando apenas os campos necessários
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true },
    })

    return res.status(201).json({ user })
}

// Autentica o usuário e retorna um token JWT
async function login(req, res){
    // Valida os dados recebidos no body
    const result = loginSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }

    const { email, password } = result.data

    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user){
        // Mensagem genérica para não revelar se o e-mail existe ou não
        return res.status(401).json({ error: 'Credenciais inválidas'})
    }

    // Compara a senha enviada com o hash armazenado no banco
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas'})
    }

    // Gera o token JWT com o userId no payload, válido por 7 dias
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    )

    return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    })
}

module.exports = { register, login }