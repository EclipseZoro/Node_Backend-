import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from 'zod';
import {Users} from "../models/user.model.js";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const login = async (req, res, next) => {
    try {
        const {email, password} = LoginSchema.parse(req.body);
        const user = await Users.findByEmail(email);
        if (!user) return res.status(401).json({error: "User not registered"});

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.atatus(401).json({error: "Invalid Password"});

        const token = jwt.sign({sub: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    } catch (e) {
        next(e);
    }
};
