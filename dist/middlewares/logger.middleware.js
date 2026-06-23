"use strict";
// ============================================================
// FICHIER : src/middlewares/logger.middleware.ts
// Rôle : Journalise chaque requête HTTP reçue par le serveur.
//        Utile pour déboguer et surveiller l'activité.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
const logger_1 = __importDefault(require("../utils/logger"));
function loggerMiddleware(req, res, next) {
    const debut = Date.now();
    res.on('finish', () => {
        const duree = Date.now() - debut;
        logger_1.default.info(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duree}ms)`);
    });
    next();
}
//# sourceMappingURL=logger.middleware.js.map