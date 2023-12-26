import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { dev } from '../config'
import { handleSendEmail } from '../helper/sendEmail'
import { Users } from '../models/userSchema'
import { IUser, EmailDataType } from '../types/userTypes'
import { createHttpError } from '../util/createHTTPError'
import { generateJwtToken, verifyJwtToken } from '../util/jwtToken'

export const sendToken = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, userName, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const isUserExists = await Users.exists({ email: email })

  if (isUserExists) {
    const error = createHttpError(404, 'This User is already exists')
    throw error
  }

  const tokenPayload = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hashedPassword,
  }

  const token = jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, { expiresIn: '24h' })

  const emailData = {
    email: email,
    subject: 'Activate Your Account',
    html: `<h1>Hello ${firstName}</h1><p>Please activate your account by : <a href="http://localhost:3000/users/activate/${token}">click the following link</a></p>`
  }
  await handleSendEmail(emailData)

  return token
}

export const userActivate = async (req: Request, res: Response, next: NextFunction) => {
 
  const token = req.body.token
  if (!token) {
    const error = createHttpError(404, 'please Provide a token link')
    throw error
  }

  const decoded = jwt.verify(token, dev.app.jwtUserActivationKey)

  if (!decoded) {
    const error = createHttpError(404, 'The Token link is Invalid ')
    throw error
  }
  await Users.create(decoded)
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const isUserExists = await Users.exists({ email: req.body.email })
  if (isUserExists) {
    const error = createHttpError(404, `User already exist with this email ${req.body.email}`)
    throw error
  }
  const userName = req.params.userName
  const user = await Users.find({ userName: userName })
  if (!user) {
    const error = createHttpError(404, `user not found with this user name ${userName}`)
    throw error
  }
  return user
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file
  const image = file?.path
  const { firstName, lastName, userName, email, password } = req.body
  const user = {
    firstName,
    lastName,
    userName,
    email,
    password,
    image,
  }
  await new Users(user).save()
}

export const findAllUsers = async (page = 1, limit = 10, search = '') => {
  const count = await Users.countDocuments()
  const totalPage = Math.ceil(count / limit)

  let filter = {}
  if (search) {
    const searchRegExp = new RegExp('.*' + search + '.*', 'i')

    filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    }
  }
  const options = { password: 0, __v: 0 }

  if (page > totalPage) {
    page = totalPage
  }

  const skip = (page - 1) * limit
  const users: IUser[] = await Users.find(filter, options)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1, name: 1 })
  return { users, totalPage, currentPage: page }
}

export const updateBanStatusByUserName = async (
  userName: string,
  isBanned: boolean
): Promise<IUser | null> => {
  const update = { isBanned: !isBanned }
  const user = await Users.findOneAndUpdate({ userName: userName }, update, { new: true })

  if (!user) {
    const error = createHttpError(404, 'The User not found')
    throw error
  }
  return user
}

export const forgetPasswordAction = async (email: string): Promise<string> => {
  const user = await Users.findOne({ email })
  if (!user) {
    const error = createHttpError(404, 'User not found')
    throw error
  }
  const token = generateJwtToken({ email: email }, dev.app.jwtResetPasswordKey, '10m')
  const emailData = {
    email: email,
    subject: 'Rest Password Email',
    html: `<h1>Hello ${user.firstName}</h1>
      <p>Please Click here to  : <a href="http://localhost:3000/users/rest-password/${token}"> rest  your password</a></p>`,
  }
  await handleSendEmail(emailData)
  return token
}

export const resstPasswordAction = async (token: '', password: string) => {
  const decoded = verifyJwtToken(token, dev.app.jwtResetPasswordKey) as JwtPayload

  const hashedPassword = await bcrypt.hash(password, 10)

  if (!token) {
    throw createHttpError(401, 'Plase Enter Valid Token ')
  }  
  if (!decoded) {
    throw createHttpError(401, 'Token is Invalid ')
  }
  const user = await Users.findOneAndUpdate(
    { email: decoded.email },
    { $set: { password: hashedPassword } },
    { new: true }
  )
  if (!user) {
    throw createHttpError(401, 'The password reset was unsuccessfully  ')
  }
  return user
}