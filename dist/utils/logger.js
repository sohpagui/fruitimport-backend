"use strict";
// ============================================================
// FICHIER : src/utils/logger.ts
// Rôle : Journalise les événements du serveur.
//        Winston écrit les logs dans la console ET dans
//        des fichiers (logs/error.log, logs/combined.log)
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        // Affiche dans la console en développement
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        // Fichier pour les erreurs seulement
        new winston_1.default.transports.File({
            filename: path_1.default.join('logs', 'error.log'),
            level: 'error',
        }),
        // Fichier pour tous les logs
        new winston_1.default.transports.File({
            filename: path_1.default.join('logs', 'combined.log'),
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map