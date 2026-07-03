import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dded2qk4f',
  api_key: process.env.CLOUDINARY_API_KEY || '477372919553638',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7tBmaxp4cuTk7ILaNs9uqXQHvRQ',
  secure: true,
})

export default cloudinary
