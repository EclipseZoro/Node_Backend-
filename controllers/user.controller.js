import bcrypt from "bcryptjs";
import {z} from "zod";
import {Users} from "../models/user.model.js";

const CreateUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    password: z.string().min(8)
});

export const createUser = async (req, res, next) => {
    try {
        const body = CreateUserSchema.parse(req.body);
        const existing = await Users.findByEmail(body.email);
        if (existing) return res.status(409).json({ error: "Email already registered" });

        const hash = await bcrypt.hash(body.password, 10);
        const user = await Users.create({
            email: body.email,
            name: body.name ?? null,
            password: hash
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        });

    } catch (e) {
        next(e);
    }
};

export const listUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const pageSize = Number(req.query.pageSize ?? 20);
        const skip = (page-1) * pageSize;

        const users = await Users.list(skip, pageSize);
        res.json({data: users, page, pageSize});
    } catch (e) {
        next(e);
    }
};

export const me = async (req, res) => {
    res.json({userId: req.user.sub, roles: req.user.role});
};

