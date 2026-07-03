"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dded2qk4f',
    api_key: process.env.CLOUDINARY_API_KEY || '477372919553638',
    api_secret: process.env.CLOUDINARY_API_SECRET || '7tBmaxp4cuTk7ILaNs9uqXQHvRQ',
    secure: true,
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map