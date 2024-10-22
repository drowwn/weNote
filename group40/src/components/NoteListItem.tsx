import React from 'react';

export interface NoteListItemProps {
  id: string;
  title: string;
  created_at: string;
  edited_at: string;
  content: string;
  isSelected?: boolean; 
  onClick: () => void;
}

const NoteListItem: React.FC<NoteListItemProps> = ({
  title,
  created_at,
  edited_at,
  content,
  isSelected,
  onClick,
}) => {

  const baseClass = 'bg-gray-950/60'; 
  const hoverClass = 'hover:bg-gray-500/20';
  const selectedClass = isSelected ? 'bg-[#5953e0]/50' : '';

  return (
    <div
      className={`flex flex-col p-5 mt-4 w-full rounded-2xl cursor-pointer ${baseClass} ${hoverClass} ${selectedClass} transition-colors duration-300`}
      onClick={onClick}
      tabIndex={0} 
      style={{ outline: isSelected ? '3px solid #5953e0' : 'none' }} 
    >
      <h2 className="text-lg font-bold leading-loose text-white overflow-hidden">
        {title.length > 25 ? `${title.substring(0, 23)}...` : title}
      </h2>
      <div className="flex items-start w-full text-base">
        <div className="flex-1 shrink basis-0 text-white text-opacity-60 overflow-hidden max-h-20">
          {content.match(/.{1,28}/g)?.map((line, index) => (
            <React.Fragment key={index}>
              {index < 2 ? line : index === 2 ? `${line.substring(0, 28)}...` : null}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteListItem;