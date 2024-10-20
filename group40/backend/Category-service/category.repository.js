import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categoryRepository = {
  /**
   * Create a new category.
   * @param {Object} category - The category data.
   * @param {string} category.name - The name of the category.
   * @param {string} category.description - The description of the category.
   * @returns {Promise<Object>} The created category.
   * @throws {Error} If an error occurs during the operation.
   */
  async createCategory({ name, description }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, description }])
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get a category by its ID.
   * @param {string} id - The ID of the category.
   * @returns {Promise<Object>} The category with the specified ID.
   * @throws {Error} If an error occurs during the operation.
   */
  async getCategoryById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, created_at')
      .eq('id', id);

    if (error) throw error;
    return data[0];
  },

  /**
   * Get all categories.
   * @returns {Promise<Array<Object>>} An array of all categories.
   * @throws {Error} If an error occurs during the operation.
   */
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, created_at');
  
    if (error) throw error;
    return data;
  },

  /**
   * Update a category by its ID.
   * @param {string} id - The ID of the category.
   * @param {Object} category - The updated category data.
   * @param {string} category.name - The updated name of the category.
   * @param {string} category.description - The updated description of the category.
   * @returns {Promise<Object>} The updated category.
   * @throws {Error} If an error occurs during the operation.
   */
  async updateCategory(id, category) {
    const { data, error } = await supabase
      .from('categories')
      .update([{ name: category.name, description: category.description }])
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  /**
   * Delete a category by its ID.
   * @param {string} id - The ID of the category to delete.
   * @returns {Promise<Object>} The deleted category data.
   * @throws {Error} If an error occurs during the operation.
   */
  async deleteCategory(id) {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  },
};

export default categoryRepository;
