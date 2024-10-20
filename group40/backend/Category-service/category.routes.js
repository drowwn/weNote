import express from 'express';
import categoryController from './category.controller.js';

const categoryRouter = express.Router();

/**
 * Route to get all categories.
 * @name GET /
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
categoryRouter.get('/', categoryController.getAllCategories);

/**
 * Route to get a category by its ID.
 * @name GET /:categoryId
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
categoryRouter.get('/:categoryId', categoryController.getCategoryById);

/**
 * Route to create a new category.
 * @name POST /
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
categoryRouter.post('/', categoryController.createCategory);

/**
 * Route to update an existing category by its ID.
 * @name PUT /:categoryId
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
categoryRouter.put('/:categoryId', categoryController.updateCategory);

/**
 * Route to delete a category by its ID.
 * @name DELETE /:categoryId
 * @function
 * @memberof module:categoryRouter
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
categoryRouter.delete('/:categoryId', categoryController.deleteCategory);

export default categoryRouter;
