import multer from 'multer'

// Stockage en mémoire - on enverra ensuite à Cloudinary
const storage = multer.memoryStorage()

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const typesAutorises = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (typesAutorises.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Format non supporté. Utilisez JPG, PNG ou WebP.'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})
