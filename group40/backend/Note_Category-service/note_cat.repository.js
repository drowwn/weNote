import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const noteCategoryRepository = {
  
  /**
   * Creates a new note category by associating a note and category.
   * 
   * @async
   * @function createNoteCategory
   * @memberof module:repositories/noteCategoryRepository
   * @param {Object} noteCategoryData - The note and category data.
   * @param {number} noteCategoryData.noteId - The ID of the note.
   * @param {number} noteCategoryData.categoryId - The ID of the category.
   * @returns {Promise<Object>} The created note category data.
   * @throws {Error} If an error occurs during the creation process.
   */
  async createNoteCategory({ noteId, categoryId }) {
    const { data, error } = await supabase
      .from('note_categories')
      .insert([{ note_id: noteId, category_id: categoryId }])
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Retrieves all note categories associated with a specific note ID.
   * 
   * @async
   * @function getNoteCategoriesByNoteId
   * @memberof module:repositories/noteCategoryRepository
   * @param {number} noteId - The ID of the note.
   * @returns {Promise<Array>} An array of note categories associated with the note ID.
   * @throws {Error} If an error occurs while retrieving the note categories.
   */
  async getNoteCategoriesByNoteId(noteId) {
    const { data, error } = await supabase
      .from('note_categories')
      .select('id, note_id, category_id')
      .eq('note_id', noteId);

    if (error) throw error;
    return data;
  },
  
  /**
   * Retrieves a note category by note ID and category ID.
   * 
   * @async
   * @function getNoteCategoryByNoteIdAndCategoryId
   * @memberof module:repositories/noteCategoryRepository
   * @param {number} noteId - The ID of the note.
   * @param {number} categoryId - The ID of the category.
   * @returns {Promise<Object|null>} The note category data or null if not found.
   * @throws {Error} If an error occurs while retrieving the note category.
   */
  async getNoteCategoryByNoteIdAndCategoryId(noteId, categoryId) {
    const { data, error } = await supabase
      .from('note_categories')
      .select('id, note_id, category_id')
      .eq('note_id', noteId)
      .eq('category_id', categoryId)
      .maybeSingle();
  
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Retrieves all note categories associated with a specific category ID.
   * 
   * @async
   * @function getNoteCategoriesByCategoryId
   * @memberof module:repositories/noteCategoryRepository
   * @param {number} categoryId - The ID of the category.
   * @returns {Promise<Array>} An array of note categories associated with the category ID.
   * @throws {Error} If an error occurs while retrieving the note categories.
   */
  async getNoteCategoriesByCategoryId(categoryId) {
    const { data, error } = await supabase
      .from('note_categories')
      .select('id, note_id, category_id')
      .eq('category_id', categoryId);

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a note category by its ID.
   * 
   * @async
   * @function deleteNoteCategory
   * @memberof module:repositories/noteCategoryRepository
   * @param {number} id - The ID of the note category to delete.
   * @returns {Promise<Object>} The deleted note category data.
   * @throws {Error} If an error occurs during deletion.
   */
  async deleteNoteCategory(id) {
    const { data, error } = await supabase
      .from('note_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  },
};

export default noteCategoryRepository;
