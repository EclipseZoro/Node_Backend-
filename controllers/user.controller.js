import bcrypt from "bcryptjs";
import {z} from "zod";
import {Users} from "../models/user.model.js";

const CreateUserSchema = z.object({
    email: z.email(),
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

const idParamSchema = z.object({id: z.string().min(1)});

export const getUserById = async (req, res, next) => {
    try {
        const {id} = idParamSchema.parse(req.params);
        const user = await Users.findByIdPublic(id);
        if (!user) return res.status(404).json({error: "User not found"});
        res.json(user);
    } catch (e) {
        next(e);
    }
};

const UpdateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    role: z.enum(['user', 'admin']).optional(),
}).refine((data) => Object.keys(data).length>0, {message: "No fields to update"});

export const updateUser = async (req, res, next) => {
    try {
        const {id} = idParamSchema.parse(req.params);
        const bocy = UpdateUserSchema.parse(req.body);
        if ('role' in body && req.user?.role !== 'admin') {
            return res.status(403).json({error: "Forbidden: Only admin can change role"});
        }

        const exists = await Users.findById(id);
        if (!exists) return res.status(404).json({error: "User not found"});

        const updated = await Users.update(id, body);
        res.json(updated);
    } catch(e){
        next(e);
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const {id} = idParamSchema.parse(req.params);
        const exists = await Users.findById(id);
        if (!exists) return res.sttus(404).json({error: "User not Found"});
        const deleted = await Users.remove(id);
        res.json({deleted: true, id: deleted.id, email:deleted.email});
    } catch(e){
        next(e);
    }
};


