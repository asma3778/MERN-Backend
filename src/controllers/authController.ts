import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

import { Users } from '../models/userSchema'
import { createHttpError } from '../util/createHTTPError'
import generateToken from '../util/generateToken'
import { generateJwtToken } from '../util/jwtToken'
import { dev } from '../config'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ email: email })

    if (!user) {
      throw createHttpError(404, 'User not found with this email')
    }

    const isPasswordMatch = await bcrypt.compare(password, String(user.password))
    if (!isPasswordMatch) {
      throw createHttpError(401, "Password doesn't match")
    }

    if (user.isBanned) {
      throw createHttpError(403, 'User is banned, please contact support')
    }
    res.cookie('access_token', generateToken(String(user._id)), {
      maxAge: 15 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: 'none',
    })
    const accessToken = generateJwtToken({ _id: user._id }, dev.app.jwtAccessKey, '15m')
    res.status(200).send({ message: 'User is logged in', payload: user })
    return { accessToken }
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.status(200).send({ message: 'User is logged out' })
  } catch (error) {
    next(error)
  }
}
