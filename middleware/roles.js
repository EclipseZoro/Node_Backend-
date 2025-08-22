export const requireRole = (role) => (req, res, next) => {
    if (!req.user?.role) return res.atatus(401).josn({error: "Unauthorized"});
    if (req.user.role !== role) return res.status(403).json({error: "Forbidden"});
    next();
};

export const allowSelforAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({erro: "Unauthorized"});
    const isSelf = req.user.sub === req.params.id;
    const isAdmin = req.user.role == 'admin';
    if (!isSelf && !isAdmin) return res.status(403).json({error: "forbidden"});
    next();

};
