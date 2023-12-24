import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const ProductStorage = multer.diskStorage({
  // destination: function (req: Request, file: Express.Multer.File, cb) {
  //   cb(null, 'public/images/products')
  // },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const userStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('File is not image'))
  }
  if (!allowTypes.includes(file.mimetype)) {
    return cb(new Error('Image type is not allowed'))
  }
  cb(null, true)
}

export const uploadProduct = multer({ storage: ProductStorage })

export const uploadUser = multer({
  storage: userStorage,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: fileFilter,
})
