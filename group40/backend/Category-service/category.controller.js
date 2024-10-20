import categoryRepository from "./category.repository.js";

const categoryController = {

  /**
   * Get a category by its ID.
   * @param {Object} req - Express request object, containing the categoryId in req.params.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @memberof module:controllers/categoryController
   */
  async getCategoryById(req, res) {
    try {
      const category = await categoryRepository.getCategoryById(req.params.categoryId);
      res.status(200).json({ category });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  /**
   * Get all categories.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @memberof module:controllers/categoryController
   */
  async getAllCategories(req, res) {
    try {
      const categories = await categoryRepository.getAllCategories();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Create a new category.
   * @param {Object} req - Express request object, containing category data in req.body.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @memberof module:controllers/categoryController
   */
  async createCategory(req, res) {
    try {
      const category = await categoryRepository.createCategory(req.body);
      res.status(201).json({ category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Update an existing category by its ID.
   * @param {Object} req - Express request object, containing categoryId in req.params and category data in req.body.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @memberof module:controllers/categoryController
   */
  async updateCategory(req, res) {
    try {
      const category = await categoryRepository.updateCategory(req.params.categoryId, req.body);
      res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Delete a category by its ID.
   * @param {Object} req - Express request object, containing the categoryId in req.params.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @memberof module:controllers/categoryController
   */
  async deleteCategory(req, res) {
    try {
      await categoryRepository.deleteCategory(req.params.categoryId);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default categoryController;
