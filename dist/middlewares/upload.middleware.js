"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Stockage en mémoire - on enverra ensuite à Cloudinary
const storage = multer_1.default.memoryStorage();
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
    limits: { fileSize: 5 * 1024 * 1024 }
});
//# sourceMappingURL=upload.middleware.js.map