import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorBioProps {
  bio: string | null;
}

const TutorBio: React.FC<TutorBioProps> = ({ bio }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line">{bio || 'No bio available.'}</p>
      </CardContent>
    </Card>
  );
};

export default TutorBio;
