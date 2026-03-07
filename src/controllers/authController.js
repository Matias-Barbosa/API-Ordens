const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const prisma = require('../prisma')

const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
    email: z.string().email('Email inválido.'),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
})

const loginSchema = z.object({
    email: z.string().email('E-mail invalido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

async function register(req, res){
    const result = registerSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ error: result.error.flattern().fieldErrors })
    }

    const { name, email, password } = result.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if(existingUser) {
        return res.status(409).json({ error: 'E-mail ja cadastrado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true },
    })

    return res.status(201).json({ user })
}

async function login(req, res){
    const result = loginSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({ errors: result.error.flattern().fieldErrors })
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({ where: { email } })
    if(!user){
        return res.status(401).json({ error: 'Credenciais inválidas'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas'})
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    )

    return res.json({
        token,
        user: { id: user, name: user.name, email: user.email },
    })
}

module.exports = { register, login }