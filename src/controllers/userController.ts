import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import mongoose from 'mongoose'

import { deleteImage } from '../helper/deleteImageHelper'
import { Users } from '../models/userSchema'
import {
  createUser,
  findAllUsers,
  forgetPasswordAction,
  getUser,
  resstPasswordAction,
  sendToken,
  updateBanStatusByUserName,
  userActivate,
} from '../services/userServices'
import { UserInput } from '../types/userTypes'
import { createHttpError } from '../util/createHTTPError'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const register = await sendToken(req, res, next)

    res.status(200).json({
      message: 'check your Email to activate your account',
      token: register,
    })
  } catch (error) {
    next(error)
  }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userActivate(req, res, next)

    res.status(201).json({
      message: 'User registration successful',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage = error instanceof TokenExpiredError ? 'expired token' : 'Invalid token'
      next(Error(errorMessage))
    } else {
      next(error)
    }
  }
}

export const updateBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await Users.findOne({ userName: userName })
    if (!user) {
      const error = createHttpError(404, `user not found with this user name ${userName}`)
      throw error
    }
    await updateBanStatusByUserName(userName, user.isBanned)

    res.status(200).send({
      message: 'User status is updated',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const search = req.query.search as string

    const { users, totalPage, currentPage } = await findAllUsers(page, limit, search)
    res.status(200).send({
      message: 'return all users',
      payload: { users, totalPage, currentPage },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req, res, next)
    const userName = req.params.userName
    res.status(200).json({
      message: `get single user with user name ${userName}`,
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

export const createSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await createUser(req, res, next)
    res.status(201).json({
      message: 'user is added',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await Users.findOneAndDelete({ userName: userName })
    if (!user) {
      const error = createHttpError(404, `User not found with this user name ${userName}`)
      throw error
    }
    if (user && user.image) {
      await deleteImage(user.image)
    }
    res.status(200).json({
      message: `delete user with user name ${userName}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const updateSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const userUpdated: UserInput = req.body
    const user = await Users.findOneAndUpdate({ userName: userName }, userUpdated, {
      new: true,
    })
    if (!user) {
      const error = createHttpError(404, `User not found with this user name ${userName}`)
      throw error
    }
    res.status(200).json({
      message: `update user with user name ${userName}`,
      payload: user,
    })
    return
  } catch (error) {
    next(error)
  }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const token = await forgetPasswordAction(email)
    res.status(200).json({
      message: 'Check your email to rest your pawword',
      token,
    })
  } catch (error) {
    next(error)
  }
}
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    const password = req.body.password

    const user = await resstPasswordAction(token, password)

    res.status(200).json({
      message: 'The password has been reset successfully',   
    }) 
  } catch (error) {
    next(error)
  }
}
