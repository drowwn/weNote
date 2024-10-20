import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { registerUser, loginUser, logoutUser, verifyToken } from './auth.js';
import userRouter from './User-service/user.routes.js';
import noteRouter from './Note-service/note.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRouter from './Category-service/category.routes.js';
import noteCategoryRouter from './Note_Category-service/note_cat.routes.js';
import { registerValidation, loginValidation } from './validation.js';
import { Server } from 'socket.io';
import { createServer } from "http";
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true, // Allows cookies to be sent to/from the front-end
  },
});

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const rooms = new Map();
const users = new Map();

/**
 * Handles the disconnection of a user from a socket room.
 *
 * @param {Socket} socket - The socket instance.
 * @param {string} username - The username of the user to disconnect.
 */
const disconnectUser = (socket, username) => {
  for (const room of socket.rooms) {
    if (rooms.has(room)) {
      let inRoom = rooms.get(room);
      let remainingInRoom = inRoom.filter(user => user !== username);
      rooms.set(room, remainingInRoom);
      io.in(room).emit('Online', remainingInRoom);
      socket.leave(room);
    }
  }
};

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("OpenNote", (noteId, username) => {
    if (!users.has(socket.id)) {
      users.set(socket.id, username);
    }

    if (!socket.rooms.has(noteId)) {
      if (rooms.has(noteId)) {
        let inRoom = rooms.get(noteId);
        if (!inRoom.includes(username)) {
          inRoom.push(username);
          rooms.set(noteId, inRoom);
        }
      } else {
        rooms.set(noteId, [username]);
      }

      disconnectUser(socket, username);

      socket.join(noteId);
      io.in(noteId).emit('Online', rooms.get(noteId));
    }
  });

  socket.on("ContentChange", (note) => {
    socket.in(note.id).emit("ContentChange", note);
  });

  socket.on('disconnect', () => {
    disconnectUser(socket, users.get(socket.id));
  });

  socket.on('logout', () => {
    disconnectUser(socket, users.get(socket.id));
  });
});

/**
 * Health check API route.
 * 
 * @route GET /
 * @returns {string} Confirmation that the backend is running.
 */
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

/**
 * User registration route.
 * 
 * @route POST /signup
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/signup', async (req, res) => {
  try {
    const validatedData = registerValidation.parse(req.body);
    const { email, password, username } = validatedData;
    const result = await registerUser(email, password, username);
    if (result.success) {
      res.status(201).json({ message: result.message, user: result.user });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
});

/**
 * User login route.
 * 
 * @route POST /login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/login', async (req, res) => {
  try {
    const validatedData = loginValidation.parse(req.body);
    const { email, password, rememberMe } = validatedData;
    const result = await loginUser(email, password, rememberMe);
    if (result.success) {
      if (rememberMe) {
        res.cookie('access_token', result.token, { maxAge: 60 * 60 * 24 * 30 * 1000, httpOnly: true });
      } else {
        res.cookie('access_token', result.token, { httpOnly: true });
      }
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
});

/**
 * User logout route.
 * 
 * @route POST /logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/logout', (req, res) => {
  const result = logoutUser(res);
  res.status(200).json({ message: result.message });
});

/**
 * Protected route for uploading files.
 * 
 * @route POST /api/upload
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const { default: multer } = await import('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', verifyToken, upload.single('avatar'), async (req, res) => {
  const { userId } = req.user;
  const filePath = `/uploads/${req.file.filename}`;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ avatar: filePath })
      .eq('id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Attach note-related routes.
 */
app.use('/notes', verifyToken, noteRouter);

/**
 * Attach category-related routes.
 */
app.use('/categories', verifyToken, categoryRouter);

/**
 * Attach note-category-related routes.
 */
app.use('/notecat', verifyToken, noteCategoryRouter);

/**
 * Fetch authenticated user's profile.
 * 
 * @route GET /users/me
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/users/me', verifyToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, avatar')
      .eq('id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ user: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Attach user-related routes.
 */
app.use('/users', verifyToken, userRouter);

/**
 * Refresh token route.
 * 
 * @route POST /refresh
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/refresh', async (req, res) => {
  try {
    const { session, error } = await supabase.auth.refreshSession();
    if (error) return res.status(400).json({ error: error.message });

    res.cookie('access_token', session.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
    });

    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete user profile route.
 * 
 * @route DELETE /users/:id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete('/users/:id', verifyToken, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  if (userId !== id) {
    return res.status(403).json({ error: 'Unauthorized action' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.clearCookie('access_token');
    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
