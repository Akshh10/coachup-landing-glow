
import React, { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder,
  className = "" 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option]);
    }
    setInputValue('');
    setIsOpen(false); // Close dropdown after selection
  };
  
  const handleRemove = (option: string) => {
    onChange(value.filter(item => item !== option));
  };
  
  const filteredOptions = options.filter(option => 
    !value.includes(option) && 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px]">
        {value.map(item => (
          <div key={item} className="flex items-center bg-[#E6EFFF] text-[#3E64FF] rounded-full px-3 py-1 text-sm">
            {item}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-2 text-[#3E64FF] hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.trim() !== '') {
              setIsOpen(true);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Don't close immediately to allow for click on option
            setTimeout(() => {
              if (document.activeElement !== e.target) {
                setIsOpen(false);
              }
            }, 150);
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-grow border-none outline-none bg-transparent p-1 text-sm"
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map(option => (
            <div
              key={option}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleSelect(option);
              }}
              className="p-2 hover:bg-[#F0F4FF] cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
