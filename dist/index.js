"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const logger_1 = __importDefault(require("./utils/logger"));
const logger_middleware_1 = require("./middlewares/logger.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const stock_routes_1 = __importDefault(require("./routes/stock.routes"));
const commande_routes_1 = __importDefault(require("./routes/commande.routes"));
const livraison_routes_1 = __importDefault(require("./routes/livraison.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const transfert_routes_1 = __importDefault(require("./routes/transfert.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const agence_routes_1 = __importDefault(require("./routes/agence.routes"));
const fruit_routes_1 = __importDefault(require("./routes/fruit.routes"));
const retour_routes_1 = __importDefault(require("./routes/retour.routes"));
const parametres_routes_1 = __importDefault(require("./routes/parametres.routes"));
const cron_service_1 = require("./services/cron.service");
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Créer les dossiers nécessaires
const dossiers = ['logs', 'uploads'];
dossiers.forEach(d => {
    if (!fs_1.default.existsSync(d))
        fs_1.default.mkdirSync(d, { recursive: true });
});
// Middlewares globaux
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_middleware_1.loggerMiddleware);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/admin/users', user_routes_1.default);
app.use('/stock', stock_routes_1.default);
app.use('/commandes', commande_routes_1.default);
app.use('/livraisons', livraison_routes_1.default);
app.use('/clients', client_routes_1.default);
app.use('/transferts', transfert_routes_1.default);
app.use('/dashboard', dashboard_routes_1.default);
app.use('/agences', agence_routes_1.default);
app.use('/fruits', fruit_routes_1.default);
app.use('/retours', retour_routes_1.default);
app.use('/parametres', parametres_routes_1.default);
(0, cron_service_1.demarrerCron)();
app.use('/chat', chat_routes_1.default);
app.get('/health', (req, res) => res.json({ status: "ok", timestamp: new Date() }));
// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'OK', version: '1.0.0', timestamp: new Date().toISOString() });
});
// Route inexistante
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} introuvable.`,
    });
});
app.listen(Number(PORT), "0.0.0.0", () => {
    logger_1.default.info(`Serveur FruitImport demarre sur http://localhost:${PORT}`);
    logger_1.default.info(`Environnement : ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map