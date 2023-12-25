import bcrybt from 'bcrypt'
import { Schema, model } from 'mongoose'

import { dev } from '../config'
import { IUser } from '../types/userTypes'

const usersSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'First name must be at least 3 characters'],
      maxlength: [30, 'First name must be at most 30 characters'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Last name must be at least 3 characters'],
      maxlength: [30, 'Last name must be at most 30 characters'],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: dev.app.defaultUserImagePath,
      required: false
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
      },
    },
    password: {
      type: String,
      required: [true, 'Please give the password'],
      unique: true,
      trim: true,
      minlength: [6, 'Last name must be at least 6 characters'],
      // set: (password: string) => bcrybt.hashSync(password, 10),
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: 'Orders',
      default: [],
    },
  },
  { timestamps: true }
)

export const Users = model<IUser>('Users', usersSchema)
