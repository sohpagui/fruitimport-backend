import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dded2qk4f',
  api_key: process.env.CLOUDINARY_API_KEY || '571565212462442',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'pq2UieH94wdOcaLAUR-ZUcxrRHM',
})

export default cloudinary
