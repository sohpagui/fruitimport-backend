import multer from 'multer'
import path from 'path'
import fs from 'fs'

const dossierUploads = path.join(__dirname, '../../uploads/fruits')
if (!fs.existsSync(dossierUploads)) {
  fs.mkdirSync(dossierUploads, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dossierUploads),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `fruit_${req.params.id}_${Date.now()}${ext}`)
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const typesAutorises = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (typesAutorises.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})
