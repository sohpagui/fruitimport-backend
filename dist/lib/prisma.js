"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL + '?connection_limit=3&pool_timeout=10',
        },
    },
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map