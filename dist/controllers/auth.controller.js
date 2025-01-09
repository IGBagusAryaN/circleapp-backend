"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'adade3938eeh3huedaihoaheao83h3ra8oa3hr8a4'; // harus ada default
const SALT_ROUNDS = 10;
async function register(req, res) {
    const { username, email, password, fullname } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        res
            .status(200)
            .json({ message: 'User successfully registered', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // jika email gaada
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // compare password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            // console.log(SECRET_KEY)
            const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '3h' });
            res.status(200).json({
                message: 'Login Successful',
                user: {
                    username: user.username,
                    email: user.email,
                },
                token,
            });
        }
        else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}
