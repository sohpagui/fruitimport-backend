"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demarrerCron = demarrerCron;
const node_cron_1 = __importDefault(require("node-cron"));
const rapport_service_1 = require("./rapport.service");
function demarrerCron() {
    // Chaque jour a 22h00
    node_cron_1.default.schedule('0 22 * * *', async () => {
        console.log('Generation du rapport journalier...');
        try {
            const url = await (0, rapport_service_1.genererRapportJournalier)();
            console.log('Rapport genere:', url);
        }
        catch (e) {
            console.error('Erreur rapport:', e);
        }
    }, { timezone: 'Africa/Douala' });
    console.log('Cron planifie: rapport journalier a 22h00');
}
//# sourceMappingURL=cron.service.js.map