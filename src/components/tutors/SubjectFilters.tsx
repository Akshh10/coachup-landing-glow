
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SubjectFiltersProps {
  subjects: string[];
  onSelectSubject: (subject: string) => void;
}

const SubjectFilters: React.FC<SubjectFiltersProps> = ({ subjects, onSelectSubject }) => {
  if (subjects.length === 0) return null;
  
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-700 mr-2 self-center">Your subjects:</span>
      {subjects.map((subject) => (
        <Badge 
          key={subject}
          variant="outline" 
          className="bg-white cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onSelectSubject(subject)}
        >
          {subject}
        </Badge>
      ))}
    </div>
  );
};

export default SubjectFilters;
