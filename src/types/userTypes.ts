import { Document } from 'mongoose'

import { IOrder } from './orderTypes'

export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  image?: string
  isAdmin: boolean
  isBanned: boolean
  orders: IOrder['_id'][]
  createdAt?: Date
  updatedAt?: Date
}

export type EmailDataType = {
  email: string
  subject: string
  html: string
}

export type UserInput = Omit<IUser, 'userName'>
