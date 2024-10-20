import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registers a new user by adding their details to the database.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} The success message and created user data or error message.
 */
export async function registerUser(email, password, username) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email,
        username,
        password: hashedPassword
      }])
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'User created successfully', user: newUser };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Authenticates a user by checking their credentials and returning a JWT token.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} rememberMe - Whether the user opted to stay logged in.
 * @returns {Promise<Object>} The success message and JWT token or error message.
 */
export async function loginUser(email, password, rememberMe) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { success: false, message: 'Invalid login credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid login credentials' };
    }

    const expiresIn = rememberMe ? '30d' : '2h';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn });

    return { success: true, token, message: 'Login successful' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Logs out a user by clearing their authentication cookie.
 *
 * @param {Object} res - The Express response object.
 * @returns {Object} A success message indicating logout.
 */
export function logoutUser(res) {
  res.clearCookie('access_token', {
    httpOnly: true,
  });
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Middleware to verify a JWT token from cookies and authorize the user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 */
export function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No access token found.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}
