import express from 'express';
import noteCategoryController from './note_cat.controller.js';

const noteCategoryRouter = express.Router();

/**
 * @route POST /note-categories
 * @desc Create a new note category
 * @access Private
 * @memberof module:routers/noteCategoryRouter
 * @param {string} path - Express route path.
 * @param {function} middleware - Middleware function to handle the request.
 */
noteCategoryRouter.post('/', noteCategoryController.createNoteCategory);

/**
 * @route GET /note-categories/note/:noteId/category/:categoryId
 * @desc Get a note category by note ID and category ID
 * @access Private
 * @memberof module:routers/noteCategoryRouter
 * @param {string} path - Express route path.
 * @param {function} middleware - Middleware function to handle the request.
 */
noteCategoryRouter.get('/note/:noteId/category/:categoryId', noteCategoryController.getNoteCategoryByNoteIdAndCategoryId);

/**
 * @route GET /note-categories/note/:noteId
 * @desc Get all categories associated with a specific note ID
 * @access Private
 * @memberof module:routers/noteCategoryRouter
 * @param {string} path - Express route path.
 * @param {function} middleware - Middleware function to handle the request.
 */
noteCategoryRouter.get('/note/:noteId', noteCategoryController.getNoteCategoriesByNoteId);

/**
 * @route GET /note-categories/category/:categoryId
 * @desc Get all note categories associated with a specific category ID
 * @access Private
 * @memberof module:routers/noteCategoryRouter
 * @param {string} path - Express route path.
 * @param {function} middleware - Middleware function to handle the request.
 */
noteCategoryRouter.get('/category/:categoryId', noteCategoryController.getNoteCategoriesByCategoryId);

/**
 * @route DELETE /note-categories/:id
 * @desc Delete a note category by its ID
 * @access Private
 * @memberof module:routers/noteCategoryRouter
 * @param {string} path - Express route path.
 * @param {function} middleware - Middleware function to handle the request.
 */
noteCategoryRouter.delete('/:id', noteCategoryController.deleteNoteCategory);

export default noteCategoryRouter;
