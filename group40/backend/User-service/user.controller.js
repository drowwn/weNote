import userRepository from "./user.respository.js";

/**
 * Controller for user-related operations.
 */
const userController = {

  /**
   * Retrieves a user by their ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.userId - The ID of the user to retrieve.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the user data or an error message.
   */
  async getUserById(req, res) {
    try {
      const user = await userRepository.getUserById(req.params.userId);
      res.status(200).json({ user });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  /**
   * Updates a user by their ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.userId - The ID of the user to update.
   * @param {Object} req.body - The data to update the user with.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the updated user data or an error message.
   */
  async updateUser(req, res) {
    try {
      const user = await userRepository.updateUser(req.params.userId, req.body);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Deletes a user by their ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.userId - The ID of the user to delete.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with no content on success or an error message.
   */
  async deleteUser(req, res) {
    try {
      const user = await userRepository.deleteUser(req.params.userId);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Retrieves a user by their email.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.email - The email of the user to retrieve.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the user data or an error message.
   */
  async getUserByEmail(req, res) {
    const { email } = req.params;
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default userController;
