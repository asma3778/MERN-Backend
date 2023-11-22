import { Request, Response, NextFunction } from "express";
import slugify from 'slugify';

import { IProduct, Products } from "../models/productSchema";
import { createHttpError } from "../util/createHTTPError";
import { findProductBySlug, removeProductBySlug } from "../services/productServices";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //limit and page number
        const products = await Products.find();
        res.json({ message: 'all products are returned', payload: products });
    } catch (error) {
        next(error);
    }
};

/*export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const product = await Products.findById({ _id: id });
        if (!product) {
            throw new Error("Product is not found with this id");
        }
        res.json({
            message: 'return single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};*/

export const getProductsBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await findProductBySlug(req.params.slug);

        res.json({ message: 'return a single product', payload: products })
    } catch (error) {
        next(error);
    }
}

export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, title, price, description, category, quantity, sold, shipping } = req.body;

        const productExsist = await Products.exists({ title: title });
        if (productExsist) {
            throw new Error("Product is not exist with this title");
        };
        const product: IProduct = new Products({
            _id: id,
            title: title,
            price: price,
            slug: slugify(title),
            description: description,
            quantity: quantity,
            category: category,
            sold: sold,
            shipping: shipping
        });
        await product.save();
        res.status(201).json({
            message: 'single product created',
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await removeProductBySlug(req.params.slug);
        res.json({
            message: 'deleted single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const product = await Products.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
        if (!product) {
            const error = createHttpError(404, 'Product not found with this slug');
            throw error;
        }
        res.json({
            message: 'update a single product',
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};