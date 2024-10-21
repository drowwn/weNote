import { z } from 'zod';
/**
 * Validation schema for user registration.
 * 
 * @typedef {Object} RegisterValidation
 * @property {string} email - The user's email address, must be a valid email format and between 1 and 50 characters.
 * @property {string} password - The user's password, must be between 8 and 50 characters.
 * @property {string} username - The user's username, must be between 1 and 50 characters.
 */
export const registerValidation = z.object({
  email: z.string().email().min(1).max(50),
  password: z.string().min(8).max(50),
  username: z.string().min(1).max(50),
});

/**
 * Validation schema for user login.
 * 
 * @typedef {Object} LoginValidation
 * @property {string} email - The user's email address, must be a valid email format and between 1 and 50 characters.
 * @property {string} password - The user's password, must be between 8 and 50 characters.
 * @property {boolean} [rememberMe] - Optional flag for remembering the user session.
 */
export const loginValidation = z.object({
  email: z.string().email().min(1).max(50),
  password: z.string().min(8).max(50),
  rememberMe: z.boolean().optional(),
});
