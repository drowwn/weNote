export interface NoteListItemProps {
  id: string;
  title: string;
  created_at: string;
  edited_at: string;
  content: string;
  isSelected?: boolean; 
  onClick: () => void;
}

import React, { useRef, useEffect, useState } from 'react';

const NoteListItem: React.FC<NoteListItemProps> = ({
  title,
  created_at,
  edited_at,
  content,
  isSelected,
  onClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedContent, setDisplayedContent] = useState<string[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      const divWidth = contentRef.current.offsetWidth;
      const charsPerLine = Math.floor(divWidth / 8); // Approximate character width
      const lines = content.match(new RegExp(`.{1,${charsPerLine}}`, 'g')) || [];
      const truncatedLines = lines.slice(0, 3).map((line, index) => {
        if (index === 2 && lines.length > 3) {
          return `${line.substring(0, charsPerLine - 3)}...`;
        }
        return line;
      });
      setDisplayedContent(truncatedLines);
    }
  }, [contentRef.current?.offsetWidth, content]);

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
      <h2
        className="text-lg font-bold leading-loose text-white overflow-hidden"
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        {title}
      </h2>
      <div className="flex items-start w-full text-base">
        <div ref={contentRef} className="flex-1 shrink basis-0 text-white text-opacity-60 overflow-hidden max-h-20">
          {displayedContent.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteListItem;