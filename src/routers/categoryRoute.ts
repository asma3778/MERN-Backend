import { Router } from 'express'

import {
  createCategories,
  deleteCategories,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from '../controllers/categoryController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { runValidation } from '../validation'
import { validateCreateCategory } from '../validation/categoryValidation'

const router = Router()

router.get('/', getCategories)

router.post('/',
//  validateCreateCategory, runValidation, 
// isLoggedIn,
//   isAdmin,
   createCategories)

router.put('/:slug', 
// isLoggedIn, isAdmin, 
updateCategory)

router.delete('/:slug', 
// isLoggedIn, isAdmin,
 deleteCategories)

router.get('/:slug', getCategoryBySlug)

export default router
