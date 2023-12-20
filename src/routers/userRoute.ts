import { Router } from 'express'

import {
  activateUser,
  createSingleUser,
  deleteSingleUser,
  forgetPassword,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  resetPassword,
  updateBan,
  updateSingleUser,
} from '../controllers/userController'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'
import { uploadUser } from '../middlewares/uploadFile'
import { runValidation } from '../validation'
import { validateCreateUser } from '../validation/userValidation'

const router = Router()

router.post(
  '/process-register',
  // validateCreateUser,
  // uploadUser.single('image'),
  isLoggedOut,
  processRegisterUser
)

router.get('/',
  getAllUsers)

router.get('/:userName', 
isLoggedIn, 
getSingleUser)

router.post('/', 
// validateCreateUser, 
// runValidation, 
// uploadUser.single('image'), 
createSingleUser)

router.delete('/:userName', 
// isLoggedIn,
//  isAdmin, 
deleteSingleUser)

router.put('/:userName', updateSingleUser)

router.post('/activate', 
isLoggedOut,
 activateUser)

router.put('/updateBan/:userName', updateBan)

router.post('/forget-password', 
// isLoggedOut,
 forgetPassword)

router.post('/reset-password',
//  isLoggedOut, 
 resetPassword)

export default router
