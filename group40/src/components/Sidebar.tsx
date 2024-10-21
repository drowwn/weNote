import React, { useState, useEffect } from "react";
import SidebarSection from "./SidebarSection";
import { FolderItem } from "./SidebarItem";
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaFolder, FaFolderOpen, FaPlus } from 'react-icons/fa'; 

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface SidebarProps {
  categories: Category[];
  onItemClick: (category: Category) => void;
  onNewNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories = [], onItemClick, onNewNote }) => {
  const [selectedItem, setSelectedItem] = useState<string>(categories.length > 0 ? categories[0].name : '');
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length > 0 && !categories.some(category => category.name === selectedItem)) {
      setSelectedItem(categories[0].name);
    }
  }, [categories]);

  const handleItemClick = (category: Category, name: string) => {
    setSelectedItem(name);
    onItemClick(category);
   
  };

  const customToastOptions: ToastOptions = {
    className: 'bg-gray-900 text-white',
    bodyClassName: 'text-sm font-medium',
    progressClassName: 'bg-purple-600',
    position: 'top-center',
    autoClose: 3000, 
    style: { display: 'none' }, 
  };

  // Generate folder items from categories
  const folderItems: FolderItem[] = categories.length > 0
    ? categories.map(category => ({
        name: category.name,
        icon: selectedItem === category.name 
          ? <FaFolderOpen className="text-white w-6 h-6" /> 
          : <FaFolder className="text-white w-6 h-6 opacity-50" />, 
        isSelected: selectedItem === category.name,
        onClick: () => handleItemClick(category, category.name),
        description: category.description, 
      }))
    : [{
        name: 'No folders found',
        icon: <FaFolder className="text-white w-6 h-6 opacity-50" />, 
        isSelected: true,
        onClick: () => {},
        description: null, 
      }];

  const createNewNote = async () => {
    try {
      const response = await fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          title: 'Untitled Note',
          content: '',
          category: 'Personal', 
        }),
      });

      if (response.ok) {
        const { note } = await response.json();
        toast.success('New note has been created!', customToastOptions);
        onNewNote();
      } else {
        toast.error('Failed to create note.', customToastOptions);
      }
    } catch (error) {
      toast.error('Failed to create note.', customToastOptions);
    }
  };

  return (
    <aside className="flex flex-col bg-gray-950/60 rounded-2xl max-w-[280px] h-full flex-grow backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between rounded-t-2xl items-center px-5 py-4 bg-gray-950/80">
        <div className="text-2xl font-bold text-white">Folders</div>
      </div>
      
      {/* New Note Button */}
      <div className="flex flex-col mt-6 px-5 items-center">
        <button
          className="flex items-center p-3 rounded-2xl bg-[#5953e0]/90 hover:bg-[#5953e0] transition-colors duration-300 w-full"
          onClick={createNewNote}
        >
          <FaPlus className="w-6 h-6 text-white" /> 
          <span className="ml-3 text-white">New Note</span>
        </button>
      </div>

      {/* Folders Section */}
      <SidebarSection title="Folders" items={folderItems} />

    </aside>
  );
};

export default Sidebar;