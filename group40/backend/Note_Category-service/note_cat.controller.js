import noteCategoryRepository from "./note_cat.repository.js";

const noteCategoryController = {
  
  /**
   * Creates a new note category.
   * 
   * @async
   * @function createNoteCategory
   * @memberof module:controllers/noteCategoryController
   * @param {Object} req - Express request object containing note category data in the body.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with the created note category or error message.
   */
  async createNoteCategory(req, res) {
    try {
      const noteCategory = await noteCategoryRepository.createNoteCategory(req.body);
      res.status(201).json({ noteCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Fetches all note categories for a specific note by note ID.
   * 
   * @async
   * @function getNoteCategoriesByNoteId
   * @memberof module:controllers/noteCategoryController
   * @param {Object} req - Express request object containing the noteId in the parameters.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with an array of note categories or error message.
   */
  async getNoteCategoriesByNoteId(req, res) {
    try {
      const noteCategories = await noteCategoryRepository.getNoteCategoriesByNoteId(req.params.noteId);
      res.status(200).json({ noteCategories });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  
  /**
   * Fetches a note category by note ID and category ID.
   * 
   * @async
   * @function getNoteCategoryByNoteIdAndCategoryId
   * @memberof module:controllers/noteCategoryController
   * @param {Object} req - Express request object containing noteId and categoryId in the parameters.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with the found note category or error message.
   */
  async getNoteCategoryByNoteIdAndCategoryId(req, res) {
    try {
      const { noteId, categoryId } = req.params;
      const noteCategory = await noteCategoryRepository.getNoteCategoryByNoteIdAndCategoryId(noteId, categoryId);
      if (!noteCategory) {
        res.status(404).json({ error: 'No note category found' });
      } else {
        res.status(200).json({ noteCategory });
      }
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  /**
   * Fetches all note categories by category ID.
   * 
   * @async
   * @function getNoteCategoriesByCategoryId
   * @memberof module:controllers/noteCategoryController
   * @param {Object} req - Express request object containing the categoryId in the parameters.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with an array of note categories or error message.
   */
  async getNoteCategoriesByCategoryId(req, res) {
    try {
      const noteCategories = await noteCategoryRepository.getNoteCategoriesByCategoryId(req.params.categoryId);
      res.status(200).json({ noteCategories });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  /**
   * Deletes a note category by its ID.
   * 
   * @async
   * @function deleteNoteCategory
   * @memberof module:controllers/noteCategoryController
   * @param {Object} req - Express request object containing the note category ID in the parameters.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with a success message or error message.
   */
  async deleteNoteCategory(req, res) {
    try {
      await noteCategoryRepository.deleteNoteCategory(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default noteCategoryController;
