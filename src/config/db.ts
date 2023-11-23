import mongoose from 'mongoose'

import { dev } from '.'

export const connectDB = async () => {
  try {
    await mongoose.connect(dev.db.url)
    console.log('DB connected')
  } catch (error) {
    console.error(error)
  }
}
