import express from 'express';
import userController from './user.controller.js';

const userRouter = express.Router();

/**
 * Route to get a user by their ID.
 * 
 * @name GET /:userId
 * @function
 * @memberof module:routers/userRouter
 * @param {string} userId - The ID of the user.
 * @returns {Object} User data as JSON.
 */
userRouter.get('/:userId', userController.getUserById);

/**
 * Route to update a user's information.
 * 
 * @name PUT /:userId
 * @function
 * @memberof module:routers/userRouter
 * @param {string} userId - The ID of the user.
 * @returns {Object} Updated user data as JSON.
 */
userRouter.put('/:userId', userController.updateUser);

/**
 * Route to delete a user by their ID.
 * 
 * @name DELETE /:userId
 * @function
 * @memberof module:routers/userRouter
 * @param {string} userId - The ID of the user.
 * @returns {void} Empty response on successful deletion.
 */
userRouter.delete('/:userId', userController.deleteUser);

/**
 * Route to get a user by their email.
 * 
 * @name GET /email/:email
 * @function
 * @memberof module:routers/userRouter
 * @param {string} email - The email of the user.
 * @returns {Object} User data as JSON.
 */
userRouter.get('/email/:email', userController.getUserByEmail);

export default userRouter;
