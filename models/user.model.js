import {prisma} from './db.js';

export const Users = {
    create: (data) => prisma.user.create({data}),
    findByEmail: (email) => prisma.user.findUnique({where: {email}}),
    findById: (id) => prisma.user.findUnique({where: {id}}),
    // the findByIdPublic will only be returning the fields that are safe to be shown to public not everything.
    findByIdPublic: (id) => prisma.user.findUnique({
        where: {id},
        select: {id: true, email: true, name: true, role: true, createdAt: true}
    }),
    update: (id, data) => prisma.user.update({
        where: {id},data,
        select: {id: true, email: true, name: true, role: true, createdAt: true}
    }),
    remove: (id) => prisma.user.delete({
        where: {id},
        select: {id:true, email:true}
    }),
    list: (skip = 0, take = 20) =>
        prisma.user.findMany({
            skip,
            take,
            orderBy: {createdAt: 'desc'},
            select: {id: true, email: true, name: true, role: true, createdAt: true}

        }),
};
