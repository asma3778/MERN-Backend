import cookieParser from 'cookie-parser'
import express, { Application, Request, Response } from 'express'

import { dev } from '../src/config'
import { connectDB } from '../src/config/db'
import { errorHandler } from '../src/middlewares/errorHandler'
import authRoute from '../src/routers/authRoute'
import categoriesRouter from '../src/routers/categoryRoute'
import ordersRouter from '../src/routers/orderRoute'
import productRoute from '../src/routers/productRoute'
import usersRouter from '../src/routers/userRoute'
import { createHttpError } from '../src/util/createHTTPError'

const app: Application = express()

const port: number = dev.app.port || 3003

connectDB()
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
  

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Health checkup' })
})

app.use('/products', productRoute)
app.use('/orders', ordersRouter)
app.use('/categories', categoriesRouter)
app.use('/users', usersRouter)
app.use('/auth', authRoute)

app.use((req, res, next) => {
  next(createHttpError(404, 'Route Not Found'))
})
app.use(errorHandler)
