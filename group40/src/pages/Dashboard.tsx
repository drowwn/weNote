import React, { useState, useRef, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Category } from "../components/NoteList";
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    withCredentials: "include",
  }
});

const Dashboard: React.FC = () => {
  // State Variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([{
    "id": 0,
    "name": "All",
    "description": null
  }]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    "id": 0,
    "name": "All",
    "description": null
  });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [onlineCollaborators, setOnlineCollaborators] = useState<string[]>([]);
  const navigate = useNavigate();

  // Responsive State Variables
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isWindowMaximized, setIsWindowMaximized] = useState(
    window.outerWidth >= screen.availWidth * 0.98 &&
    window.outerHeight >= screen.availHeight * 0.98
  );

  // Define Breakpoints
  const isBigScreen = isWindowMaximized; // Big screen (maximized)
  const isSmallScreen = !isWindowMaximized && windowWidth >= 720; // Small screen
  const isVerySmallScreen = windowWidth < 720; // Very small screen

  // Handlers for Sidebar and Profile Menu
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  // Handlers for Notes
  const handleNoteClick = (note: any) => {
    socket.emit('OpenNote', note.id, username);
    setSelectedNote(note);
  };

  const handleNoteSave = (note: any) => {
    setSelectedNote(note);
    refreshList();
  };

  const handleNoteDelete = () => {
    setSelectedNote(null);
    refreshList();
  };

  const refreshList = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  // Handler for Category Updates
  const handleCategoryUpdate = useCallback(
    (updatedCategories: Category[]) => {
      setCategories([{
        id: 0,
        name: "All",
        description: null as string | null
      }].concat(updatedCategories) as Category[]);
    },
    []
  );
  
  const handleCategoryClick = (selectedCategory: Category) => {
    setSelectedCategory(selectedCategory);
    console.log(selectedCategory);
  }

  const handleContentChange = (note: any) => {
    socket.emit("ContentChange", note);
  };

  // Effect to Fetch User Profile and Setup Socket Listeners
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const { user } = await response.json();
          setAvatar(user.avatar); // Set avatar state with the user's avatar URL
          setUsername(user.username);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } 
    };

    fetchProfile();

    // Socket Listener for Online Collaborators
    socket.on('Online', (onlineCollaborators: string[]) =>{
      setOnlineCollaborators(onlineCollaborators);
    })

    // Click Outside Handler for Profile Menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off('Online'); // Clean up socket listener
    };
  }, []);

  // Handler for Sign Out
  const handleSignOut = async () => {
    socket.emit('logout');
    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        console.error("Sign-out failed");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  // Effect to Track Window Width and Maximization
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsWindowMaximized(
        window.outerWidth >= screen.availWidth * 0.98 &&
        window.outerHeight >= screen.availHeight * 0.98
      );
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine Visibility Based on Breakpoints
  const showSidebarInLayout = isBigScreen;
  const showNoteList = !isVerySmallScreen;
  const showSidebarOverlay = isSidebarOpen && !isBigScreen;

  return (
    <Layout>
      {/* Toast Container for Notifications */}
      <ToastContainer />

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-950/70 shadow-md flex items-center justify-between px-4 z-50">
        {/* Sidebar Toggle Button */}
        {!isBigScreen && (
          <button
            className="mr-4 rounded-md focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}

        {/* Application Title */}
        <h1 className="text-3xl text-[#5953e0] font-semibold mx-auto">weNote</h1>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            onClick={toggleProfileMenu}
            aria-label="User Profile"
          >
            {avatar ? (
              <img
                src={`http://localhost:3001${avatar}`}
                alt="Avatar"
                className="absolute inset-0 w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-700 font-medium">
                U
              </span>
            )}
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-2xl shadow-lg z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-gray-800/40 rounded-2xl"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Edit Profile
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-800/40 rounded-2xl"
                onClick={() => {
                  handleSignOut();
                  setIsProfileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-screen pt-16 flex-1">
        {/* Sidebar in Layout */}
        {showSidebarInLayout && (
          <div className="p-4 bg-transparent w-64 lg:w-72 flex-shrink-0 transition-all duration-300 ease-in-out">
            <Sidebar 
              categories={categories} 
              onItemClick={handleCategoryClick} 
              onNewNote={refreshList}
            />
          </div>
        )}

        {/* NoteList and NoteEditor */}
        <div className={`flex-1 flex overflow-hidden ${isSidebarOpen ? 'w-[85vw]' : 'w-[85vw]'}`}>
          {/* NoteList */}
          {showNoteList && (
            <div className="w-64 md:w-72 lg:w-80 p-4 overflow-y-auto transition-all duration-300 ease-in-out">
              <NoteList 
                onNoteClick={handleNoteClick} 
                onCategoriesUpdate={handleCategoryUpdate} 
                refreshList={refreshList} 
                refreshtrigger={refreshTrigger} 
                selectedCategory={selectedCategory}
              />
            </div>
          )}

          {/* NoteEditor */}
          <div className="flex-1 p-4 overflow-hidden">
            {selectedNote ? (
              <NoteEditor 
                note={selectedNote} 
                onChange={handleContentChange} 
                onSave={handleNoteSave} 
                onDelete={handleNoteDelete} 
                onlineCollaberators={onlineCollaborators} 
                socket={socket}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center h-full text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m2 0a2 2 0 100-4 2 2 0 100 4zM7 12a2 2 0 100-4 2 2 0 100 4zm10 4H7m10 0a2 2 0 100 4 2 2 0 100-4zM7 16a2 2 0 100 4 2 2 0 100-4z"
                  />
                </svg>
                <p className="text-lg text-gray-400 font-semibold">
                  Select a note to start editing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Small Screens */}
      {showSidebarOverlay && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay Background */}
          <div 
            className="fixed inset-0 bg-black opacity-30"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          ></div>

          {/* Sidebar Content */}
            <div className="relative mt-16 gap-4 flex-1 flex flex-nowrap bg-gray-800/40 p-4 transition-transform transform translate-x-0 backdrop-blur-sm">
            <Sidebar 
              categories={categories} 
              onItemClick={handleCategoryClick} 
              onNewNote={refreshList}
            />
            {/* Only show NoteList in overlay if very small screen */}
            {isVerySmallScreen && (
              <NoteList 
              onNoteClick={handleNoteClick} 
              onCategoriesUpdate={handleCategoryUpdate} 
              refreshList={refreshList} 
              refreshtrigger={refreshTrigger} 
              selectedCategory={selectedCategory}
              />
            )}
            </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
