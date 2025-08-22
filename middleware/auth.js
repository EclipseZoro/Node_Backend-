import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) return res.status(401).json({error: "Unauthorized"});
    const token = h.slice(7);
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({error: "Unauthorized"});
    }
};
