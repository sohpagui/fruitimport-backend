"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dossierUploads = path_1.default.join(__dirname, '../../uploads/fruits');
if (!fs_1.default.existsSync(dossierUploads)) {
    fs_1.default.mkdirSync(dossierUploads, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, dossierUploads),
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `fruit_${req.params.id}_${Date.now()}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    const typesAutorises = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (typesAutorises.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'));
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});
//# sourceMappingURL=upload.middleware.js.map