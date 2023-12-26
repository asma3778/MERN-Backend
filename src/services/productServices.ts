import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Products } from '../models/productSchema'
import { IProduct } from '../types/productTypes'
import { createHttpError } from '../util/createHTTPError'
import { uploadToCloudinary } from '../helper/cloudinaryHelper'

export const findProductBySlug = async (slug: string): Promise<IProduct> => {
  const products = await Products.findOne({ slug: slug })
  if (!products) {
    const error = createHttpError(404, 'Product not found with this slug')
    throw error
  }
  return products
}

export const removeProductBySlug = async (slug: string) => {
  const product = await Products.findOneAndDelete({ slug: slug })
  if (!product) {
    const error = createHttpError(404, 'Product not found with this slug')
    throw error
  }
  return product
}

export const findAllProducts = async (page = 1, limit = 10, search = '') => {
  const count = await Products.countDocuments()
  const totalPage = Math.ceil(count / limit)
  const searchRegExp = new RegExp('.*' + search + '.*', 'i')
  let filter = {}
  if (search) {
    const searchRegExp = new RegExp('.*' + search + '.*', 'i')

    filter = {
    $or: [{ title: { $regex: searchRegExp } }, { description: { $regex: searchRegExp } }],
    $and: [{ price: { $gt: 2000 } }, { price: { $lt: 3000 } }],
  }
}
  if (page > totalPage) {
    page = totalPage
  }

  const skip = (page - 1) * limit
  const products: IProduct[] = await Products.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort({ price: 1 })
  return { products, totalPage, currentPage: page }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  
  const img = req.file?.path
  const { title, price, description, category, quantity, sold, shipping } = req.body

  const productExsist = await Products.exists({ title: title })
  if (productExsist) {
    const error = createHttpError(404, 'Product is exist with this title')
    throw error
  }
  const product: IProduct = new Products({
    title: title,
    price: price,
    image: img,
    slug: slugify(title),
    description: description,
    quantity: quantity,
    category: category,
    sold: sold,
    shipping: shipping,
  })
   // to upload an image to Cloudinary and get the Cloudinary URL
   const cloudinaryUrl = await uploadToCloudinary(
    product.image,
    'sda-ecommerce/products'
  );

 // adding the cloudinary url to
  product.image = cloudinaryUrl;
 // storing the user in the database
  await product.save()
  console.log(product)
  return product
}
