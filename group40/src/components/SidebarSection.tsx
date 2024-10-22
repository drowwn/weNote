import React, { useState } from "react";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";

interface SidebarSectionProps {
  title: string;
  items: SidebarItemProps[];
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items }) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false); 
  const [newFolderName, setNewFolderName] = useState<string>(''); 
  const [newFolderDescription, setNewFolderDescription] = useState<string>(''); 

  const toggleSearch = () => {
    if (isAddingFolder) {
      setIsAddingFolder(false); 
      setNewFolderName('');
      setNewFolderDescription('');
    }
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleAddFolder = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchTerm('');
    }
    setIsAddingFolder((prev) => !prev);
    if (isAddingFolder) {
      setNewFolderName('');
      setNewFolderDescription('');
    }
  };

  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleNewFolderDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewFolderDescription(e.target.value);
  };

  const handleAddFolder = async () => {
    let trimmedFolderName = newFolderName.trim();
    if (trimmedFolderName.length > 50) {
      trimmedFolderName = trimmedFolderName.substring(0, 50);
    }

    if (trimmedFolderName !== "") {
      try {
        const response = await fetch('http://25.22.155.245:3001/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: trimmedFolderName,
            description: newFolderDescription.trim(),
          }),
        });
        const data = await response.json();
        setNewFolderName('');
        setNewFolderDescription('');
        setIsAddingFolder(false);
        console.log('New Folder Added:', data);
      } catch (error) {
        console.error('Error adding folder:', error);
      }
    } else {
      console.log("Folder name empty");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col mt-8 w-full transition-all duration-300">
      <div className="flex gap-2 justify-between items-center px-5 w-full text-sm">
        <h2 className="text-white">{title}</h2>
        {title === "Folders" && (
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="p-1 rounded hover:bg-neutral-700 focus:outline-none transition-colors duration-200"
              aria-label="Toggle Search"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>

            {/* Add Folder Icon */}
            <button
              onClick={toggleAddFolder}
              className="p-1 rounded hover:bg-neutral-700 focus:outline-none transition-colors duration-200"
              aria-label="Add Folder"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {/* Search Input */}
        <div
          className={`px-5 py-2 overflow-hidden transition-all duration-300 ${
            isSearchOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength={100}
            placeholder="Search folders..."
            className="w-full px-3 py-2 bg-gray-800/40 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5953e0] transition-opacity duration-300"
          />
        </div>

        {/* Add Folder Input */}
        <div
          className={`px-5 py-2 overflow-hidden transition-all duration-300 ${
            isAddingFolder ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          } flex flex-col items-start`}
        >
          <input
            type="text"
            value={newFolderName}
            onChange={handleNewFolderNameChange}
            maxLength={100}
            placeholder="Folder name"
            className="w-full px-3 py-2 bg-gray-800/40 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5953e0] transition-opacity duration-300"
          />
          <textarea
            value={newFolderDescription}
            onChange={handleNewFolderDescriptionChange}
            maxLength={200}
            placeholder="Add description (optional)"
            className="w-full px-3 py-2 mt-3 bg-gray-800/40 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5953e0] transition-opacity duration-300 resize-none h-24"
          />
          <button
            onClick={handleAddFolder}
            className={`mt-2 p-1 rounded hover:bg-gray-800 focus:outline-none transition-colors duration-200 ${
              newFolderName.trim() === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            disabled={newFolderName.trim() === ""}
            aria-label="Confirm Add Folder"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 w-full text-base">
        {filteredItems.map((item, index) => (
          <SidebarItem
            key={index}
            name={item.name}
            icon={item.icon}
            isSelected={item.isSelected}
            onClick={item.onClick}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default SidebarSection;
