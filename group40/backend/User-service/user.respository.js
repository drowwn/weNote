import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Repository for user-related database operations.
 */
const userRepository = {
  
  /**
   * Retrieves a user by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Object>} The user data (id, username, email, created_at).
   * @throws {Error} Throws if there is an error during the database operation.
   */
  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', id);

    if (error) throw error;
    return data[0];
  },

  /**
   * Updates a user's information.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Object} user - The user object containing updated data.
   * @param {string} user.username - The updated username.
   * @param {string} user.email - The updated email.
   * @returns {Promise<Object[]>} The updated user data.
   * @throws {Error} Throws if there is an error during the database operation.
   */
  async updateUser(id, user) {
    const { data, error } = await supabase
      .from('users')
      .update([{username: user.username, email: user.email }])
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a user by their ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<Object[]>} The result of the deletion.
   * @throws {Error} Throws if there is an error during the database operation.
   */
  async deleteUser(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves a user by their email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<Object>} The user data (id, email).
   * @throws {Error} Throws if there is an error during the database operation.
   */
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Retrieves multiple users by their IDs.
   *
   * @param {string[]} userIds - The array of user IDs to retrieve.
   * @returns {Promise<Object[]>} An array of user data (id, username).
   * @throws {Error} Throws if there is an error during the database operation.
   */
  async getUsersByIds(userIds) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username') // Only select the id and username
      .in('id', userIds);

    if (error) throw new Error(error.message);
    return data;
  },
};

export default userRepository;
