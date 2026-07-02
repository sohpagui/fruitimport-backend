"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Singleton PrismaClient — une seule connexion partagée
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['error'],
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map