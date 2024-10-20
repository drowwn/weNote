import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const noteRepository = {

  /**
   * Fetch all notes for a specific user by userId.
   * 
   * @async
   * @function getNotesForUser
   * @param {string} userId - The ID of the user to fetch notes for.
   * @returns {Promise<Object[]>} Returns a promise that resolves with an array of notes.
   * @throws {Error} Throws an error if fetching notes fails.
   */
  async getNotesForUser(userId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .contains('user_ids', [userId]); // Check if userId exists in user_ids array

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create a new note for a user.
   * 
   * @async
   * @function createNote
   * @param {Object} note - The note data.
   * @param {string} note.userId - The ID of the user creating the note.
   * @param {string} note.title - The title of the note.
   * @param {string} note.content - The content of the note.
   * @param {string} note.category - The category of the note.
   * @returns {Promise<Object>} Returns a promise that resolves with the created note.
   * @throws {Error} Throws an error if creating the note fails.
   */
  async createNote({ userId, title, content, category }) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, category, user_ids: [userId] }])
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing note by its ID.
   * 
   * @async
   * @function updateNote
   * @param {string} noteId - The ID of the note to update.
   * @param {Object} note - The updated note data.
   * @param {string} note.title - The updated title of the note.
   * @param {string} note.content - The updated content of the note.
   * @param {string} note.category - The updated category of the note.
   * @returns {Promise<Object>} Returns a promise that resolves with the updated note.
   * @throws {Error} Throws an error if updating the note fails.
   */
  async updateNote(noteId, { title, content, category }) {
    const edited_at = new Date();
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, category, edited_at })
      .eq('id', noteId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Remove a user from a note's user_ids by note ID and user ID.
   * 
   * @async
   * @function removeUser
   * @param {string} noteId - The ID of the note to remove the user from.
   * @param {string} userId - The ID of the user to be removed.
   */
  async removeUser(noteId, userId) {
    // Implementation logic here
  },

  /**
   * Delete a note by its ID and user ID.
   * 
   * @async
   * @function deleteNoteById
   * @param {string} noteId - The ID of the note to delete.
   * @param {string} userId - The ID of the user attempting to delete the note.
   * @returns {Promise<Object>} Returns the deleted note data or updates the note's user_ids if the note is shared.
   * @throws {Error} Throws an error if deleting the note fails.
   */
  async deleteNoteById(noteId, userId) {
    const userdata = await this.getNoteById(noteId);
    const userArray = userdata.user_ids;

    const index = userArray.indexOf(userId);
    if (index !== -1) {
      userArray.splice(index, 1);
    }

    if (userArray.length === 0) {
      const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const editedAt = new Date();
      const { data, error } = await supabase
        .from('notes')
        .update({ user_ids: userArray, edited_at: editedAt })
        .eq('id', noteId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
  },

  /**
   * Fetch a note by its ID.
   * 
   * @async
   * @function getNoteById
   * @param {string} noteId - The ID of the note to fetch.
   * @returns {Promise<Object>} Returns a promise that resolves with the note data.
   * @throws {Error} Throws an error if fetching the note fails.
   */
  async getNoteById(noteId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update the user_ids of a note.
   * 
   * @async
   * @function updateNoteUserIds
   * @param {string} noteId - The ID of the note to update.
   * @param {string[]} userIds - Array of user IDs to assign to the note.
   * @returns {Promise<Object>} Returns a promise that resolves with the updated note.
   * @throws {Error} Throws an error if updating the note fails.
   */
  async updateNoteUserIds(noteId, userIds) {
    const { data, error } = await supabase
      .from('notes')
      .update({ user_ids: userIds })
      .eq('id', noteId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

export default noteRepository;
