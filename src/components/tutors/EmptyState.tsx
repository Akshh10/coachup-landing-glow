
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  searchTerm: string;
  hasSubjects: boolean;
  onClearSearch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, hasSubjects, onClearSearch }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-700 mb-2">No tutors found</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm 
          ? `No tutors found matching "${searchTerm}"`
          : hasSubjects
            ? "No tutors match your preferred subjects yet"
            : "Please update your profile with preferred subjects to find matching tutors"
        }
      </p>
      {searchTerm && (
        <Button onClick={onClearSearch}>
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
