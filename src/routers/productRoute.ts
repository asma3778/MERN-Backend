import { Router } from 'express'

import {
  createSingleProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductsBySlug,
  updateProductBySlug,
} from '../controllers/productController'
import { uploadProduct } from '../middlewares/uploadFile'
// import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { runValidation } from '../validation'

const router = Router()

router.get('/', getAllProducts)

router.get('/:slug', getProductsBySlug)

router.post(
  '/',
  //   validateCreateProduct,
  // isLoggedIn,
  // isAdmin,
  // runValidation,
  uploadProduct.single('image'),
  createSingleProduct
)

router.delete('/:slug', 
// isLoggedIn, isAdmin, 
deleteProductBySlug)

router.put(
  '/:slug',
  // validateUpdateProduct,
  // isLoggedIn,
  // isAdmin,
  // runValidation,
  updateProductBySlug
)

export default router
