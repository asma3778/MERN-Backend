import { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  getUserOrders,
  placeNewOrder,
  updateOrderStatusById,
} from '../controllers/orderController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { runValidation } from '../validation'
import { validatePlaceOrder } from '../validation/orderValidation'

const ordersRouter = Router()

ordersRouter.get('/', 
// isLoggedIn, isAdmin, 
getAllOrders)

ordersRouter.get('/:id([0-9a-fA-F]{24})',
//  isLoggedIn, isAdmin,
  getSingleOrderById)

ordersRouter.get('/user', 
// isLoggedIn, 
getUserOrders)

ordersRouter.delete('/:id([0-9a-fA-F]{24})', 
// isLoggedIn, isAdmin,
 deleteOrderById)

ordersRouter.post('/',
// validatePlaceOrder, runValidation, 
isLoggedIn,
placeNewOrder
)

ordersRouter.put('/:id([0-9a-fA-F]{24})',
//  isLoggedIn, isAdmin,
  updateOrderStatusById)

export default ordersRouter
