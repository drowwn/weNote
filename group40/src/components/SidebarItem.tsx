import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";  


export interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  description?: string | null; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  icon,
  isSelected = false,
  onClick,
  description,
}) => {
  const baseClass = 'bg-transparent';
  const hoverClass = 'hover:bg-gray-500/20 rounded-md';
  const selectedClass = isSelected ? 'bg-gray-500/20' : '';

  return (
    <div
      className={`relative flex gap-4 items-center px-5 py-2.5 w-full cursor-pointer ${baseClass} ${hoverClass} ${selectedClass} transition-colors duration-300`}
      onClick={onClick}
      data-tooltip-content={description && description.length > 40 ? `${description.slice(0, 40)}...` : description || 'No description'}
      data-tooltip-id={`tooltip-${name}`}
      style={{ width: '100%' }}
    >
      {icon}
      <div className="text-white flex-1">
      {name.length > 16 ? `${name.slice(0, 16)}...` : name}
      </div>
      {/* Tooltip Component */}
      <ReactTooltip 
      id={`tooltip-${name}`} 
      place="right" 
      className="custom-tooltip"
      />
    </div>
  );
};

export default SidebarItem;
export type FolderItem = SidebarItemProps;
export type MoreItem = SidebarItemProps;
