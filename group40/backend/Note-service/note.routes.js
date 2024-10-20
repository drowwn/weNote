import express from 'express';
import noteController from './note.controller.js';

const noteRouter = express.Router();

/**
 * Route to fetch all notes for the authenticated user.
 * 
 * @name GET /
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with user information.
 * @param {Response} res - Express response object with the notes data.
 */
noteRouter.get('/', noteController.getNotesForUser);

/**
 * Route to create a new note for the authenticated user.
 * 
 * @name POST /
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with the new note data.
 * @param {Response} res - Express response object with the created note.
 */
noteRouter.post('/', noteController.createNote);

/**
 * Route to update an existing note by its ID.
 * 
 * @name PUT /:noteId
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with the updated note data.
 * @param {Response} res - Express response object with the updated note.
 */
noteRouter.put('/:noteId', noteController.updateNote);

/**
 * Route to share a note with another user.
 * 
 * @name POST /:noteId/share
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with the noteId and the new user's ID.
 * @param {Response} res - Express response object with the updated note data.
 */
noteRouter.post('/:noteId/share', noteController.shareNoteWithUser);

/**
 * Route to get the collaborators (users) of a note.
 * 
 * @name GET /:noteId/collaborators
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with the noteId.
 * @param {Response} res - Express response object with the collaborators of the note.
 */
noteRouter.get('/:noteId/collaborators', noteController.getCollaborators);

/**
 * Route to delete a note by its ID.
 * 
 * @name DELETE /:noteId
 * @function
 * @memberof module:routers/noteRouter
 * @param {Request} req - Express request object with the noteId.
 * @param {Response} res - Express response object with the success message or error.
 */
noteRouter.delete('/:noteId', noteController.deleteNote);

export default noteRouter;
