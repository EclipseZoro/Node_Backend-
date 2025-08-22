import {prisma} from './db.js';

export const Users = {
    create: (data) => prisma.user.create({data}),
    findByEmail: (email) => prisma.user.findUnique({where: {email}}),
    findById: (id) => prisma.user.findUnique({where: {id}}),
    list: (skip = 0, take = 20) =>
        prisma.user.findMany({
            skip,
            take,
            orderBy: {createdAt: 'desc'},
            select: {id: true, email: true, name: true, role: true, createdAt: true}

        })
};
