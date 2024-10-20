import noteRepository from './note.repository.js';
import userRepository from '../User-service/user.respository.js';

const noteController = {

  /**
   * Fetch all notes for the authenticated user.
   * 
   * @async
   * @function getNotesForUser
   * @param {Object} req - The request object, containing the authenticated user's ID in `req.user`.
   * @param {Object} res - The response object.
   * @returns {void} Responds with the user's notes in JSON format.
   */
  async getNotesForUser(req, res) {
    const { userId } = req.user;
    try {
      const notes = await noteRepository.getNotesForUser(userId);
      res.status(200).json({ notes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Create a new note for the authenticated user.
   * 
   * @async
   * @function createNote
   * @param {Object} req - The request object containing `title`, `content`, and `category` in the body.
   * @param {Object} res - The response object.
   * @returns {void} Responds with the created note in JSON format.
   */
  async createNote(req, res) {
    const { userId } = req.user;
    const { title, content, category } = req.body;
    try {
      const note = await noteRepository.createNote({ userId, title, content, category });
      res.status(201).json({ note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Update an existing note by its ID.
   * 
   * @async
   * @function updateNote
   * @param {Object} req - The request object, containing `noteId` in the params and `title`, `content`, and `category` in the body.
   * @param {Object} res - The response object.
   * @returns {void} Responds with the updated note in JSON format.
   */
  async updateNote(req, res) {
    const { noteId } = req.params;
    const { title, content, category } = req.body;
    try {
      const note = await noteRepository.updateNote(noteId, { title, content, category });
      res.status(200).json({ note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Delete a note by its ID.
   * 
   * @async
   * @function deleteNote
   * @param {Object} req - The request object containing `noteId` in the params and `userId` in `req.user`.
   * @param {Object} res - The response object.
   * @returns {void} Responds with a success message or an error if the note is not found.
   */
  async deleteNote(req, res) {
    const { userId } = req.user;
    const { noteId } = req.params;
    try {
      const deletedNote = await noteRepository.deleteNoteById(noteId, userId);
      if (!deletedNote) {
        res.status(404).json({ error: 'Note not found' });
      } else {
        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }, 

  /**
   * Share a note with another user.
   * 
   * @async
   * @function shareNoteWithUser
   * @param {Object} req - The request object, containing `noteId` in the params and `newUserId` in the body.
   * @param {Object} res - The response object.
   * @returns {void} Responds with the updated note or an error if the user already has access.
   */
  async shareNoteWithUser(req, res) {
    const { noteId } = req.params;
    const { newUserId } = req.body;
    try {
      const note = await noteRepository.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      if (!note.user_ids.includes(newUserId)) {
        note.user_ids.push(newUserId);
        const updatedNote = await noteRepository.updateNoteUserIds(noteId, note.user_ids);
        res.status(200).json({ note: updatedNote });
      } else {
        res.status(400).json({ error: 'User already has access to this note' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get collaborators for a note by its ID.
   * 
   * @async
   * @function getCollaborators
   * @param {Object} req - The request object, containing `noteId` in the params.
   * @param {Object} res - The response object.
   * @returns {void} Responds with the collaborators of the note in JSON format.
   */
  async getCollaborators(req, res) {
    const { noteId } = req.params;
    try {
      const note = await noteRepository.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      // Fetch all users by their IDs in the user_ids array
      const { user_ids } = note;
      const collaborators = await userRepository.getUsersByIds(user_ids);

      res.status(200).json({ collaborators });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

};

export default noteController;
