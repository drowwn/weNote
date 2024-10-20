Collaborative Note-Taking App
=============================

Description
-----------

This project is a collaborative note-taking platform developed for CS 343 by Group 40. The platform allows users to create, organize, share, and collaboratively edit notes in real-time. It provides an interface with Markdown support, allowing users to format their notes efficiently. The backend ensures secure authentication using bcrypt and JSON Web Tokens (JWT), while the database is managed by Supabase, a PostgreSQL-based service.

Table of Contents
-----------------

1.  Features
2.  Tech Stack
3.  Installation
4.  Environment Variables
5.  Usage
6.  API Endpoints

* * * * *

Features
--------

-   **User Authentication**: Secure login, registration, and session management using bcrypt and JWT.
-   **Real-Time Collaboration**: Multiple users can edit notes in real-time.
-   **Markdown Support**: Users can format notes using Markdown.
-   **Note Organization**: Users can categorize and share notes.
-   **Responsive Design**: Fully responsive UI built with React and Tailwind CSS.

Tech Stack
----------

-   **Frontend**: React, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: bcrypt for password hashing, JWT for session management
-   **Real-Time Communication**: Socket.io
-   **Other Dependencies**:
    -   dotenv for environment variables
    -   zod for validation
    -   multer for file handling
    -   react-toastify for notifications

Installation
------------

### Prerequisites

-   **Node.js**: Ensure that Node.js is installed on your system.

-   **pnpm**: This project uses `pnpm` as the package manager. Install `pnpm` globally using:

    npm install -g pnpm

### Steps

1.  **Install dependencies**:

    pnpm install

2.  **Create and configure environment variables**:

    Create a `.env` file in the backend directory and populate it with the required environment variables (see below).

3.  **Run the development server**:

    pnpm run dev
    node server.js --> for the backend from /backend

4.  **Build the project**:

    For production:

    pnpm run build

    For serving the production build locally:

    pnpm run dev

Environment Variables
---------------------

You need to configure the following environment variables in a `.env` file in the root directory of the project:

`VITE_SUPABASE_URL=<Your Supabase URL>
VITE_SUPABASE_ANON_KEY=<Your Supabase Anon Key>
JWT_SECRET=<Your JWT Secret Key>`

Usage
-----

### Development

To run the project in development mode with hot-reloading:

pnpm run dev

### Production

To create a production build:

pnpm run build

To serve the production build locally:

pnpm run start

API Endpoints
-------------

### **Authentication**

-   **POST** `/register`: Registers a new user.
-   **POST** `/login`: Authenticates a user and returns a JWT token.
-   **POST** `/logout`: Logs the user out by clearing the token cookie.

### **Notes**

-   **GET** `/notes`: Fetch all notes for the authenticated user.
-   **POST** `/notes`: Create a new note.
-   **PUT** `/notes/:noteId`: Update a specific note.
-   **DELETE** `/notes/:noteId`: Delete a specific note.
-   **POST** `/notes/:noteId/share`: Share a note with another user.

### **Categories**

-   **GET** `/categories`: Fetch all categories.
-   **POST** `/categories`: Create a new category.
-   **PUT** `/categories/:categoryId`: Update a category.
-   **DELETE** `/categories/:categoryId`: Delete a category.

### **Collaborators**

-   **GET** `/notes/:noteId/collaborators`: Fetch all collaborators for a specific note.
-   **POST** `/notes/:noteId/share`: Share a note with a collaborator.

* * * * *

Contributors
------------

-   **RS Bertschinger**
-   **A du Plessis**
-   **JE Oosthuizen**
-   **GF Bosman**
-   **LM de Vos**