import bcrypt from 'bcrypt'
import { Users } from '../models/userSchema'
import { createHttpError } from '../util/createHTTPError'
import { IUser } from '../types/userTypes'


export const findUserByEmail = async (email: string) => {
  const user = await Users.findOne({ email })
  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }
  return user
}

export const isPasswordMatch = async (user: IUser, password: string) => {
  const isPasswordMatch = await bcrypt.compare(password, String(user.password))
  if (!isPasswordMatch) {
    throw createHttpError(401, `Password doesn't match with this email ${user.email}`)
  }
}

export const isEmailMatch = async (inputEmail: string) => {
  const user = await Users.findOne({ email: inputEmail })
  if (!user) {
    throw createHttpError(404, 'Their is no match with this email adress')
  }
  return user
}

export const isUserBanned = (user: IUser) => {
  if (user.isBanned) {
    throw createHttpError(
      403,
      `User is banned with this email ${user.email}. Please contact the admin`
    )
  }
}