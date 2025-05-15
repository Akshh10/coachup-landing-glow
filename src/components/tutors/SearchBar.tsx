
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search for subjects or tutors..." 
}) => {
  return (
    <div className="mb-8 relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
