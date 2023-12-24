import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { deleteImage } from '../helper/deleteImageHelper'
import { Products } from '../models/productSchema'
import {
  createProduct,
  findAllProducts,
  findProductBySlug,
  removeProductBySlug,
} from '../services/productServices'
import { createHttpError } from '../util/createHTTPError'

// export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let page = Number(req.query.page) || 1
//     const limit = Number(req.query.limit) || 3
//     let minPrice = Number(req.query.minPrice) || 0
//     let maxPrice = Number(req.query.maxPrice) || 50000
//     let search = req.query.search as string

//     const result = await AllProducts(page, limit, minPrice, maxPrice, search)

//     res.status(200).json({
//       message: 'All products are returned',
//       payload: {
//         products: result.products,
//         currentPage: result.currentPage,
//         totalPages: result.totalPages,
//       },
//     })
    
//   } catch (error) {
//     next(error)
//   }
// }
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const search = req.query.search as string
    const { products, totalPage, currentPage } = await findAllProducts(page, limit, search)
    res.send({
      message: 'return all products',
      payload: {
        products,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProductsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await findProductBySlug(req.params.slug)

    res.status(200).json({ message: 'Return a single product', payload: products })
  } catch (error) {
    next(error)
  }
}

export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProduct(req, res, next)
    res.status(201).json({
      message: 'Single product created',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await removeProductBySlug(req.params.slug)
    if (product && product.image) {
      await deleteImage(String(product.image))
    }
    res.status(200).json({
      message: 'Deleted single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const product = await Products.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    })
    if (!product) {
      const error = createHttpError(404, 'Product not found with this slug')
      throw error
    }
    res.status(200).json({
      message: 'Update a single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
