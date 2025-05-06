
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const CreateInterviewCard = () => {
  return (
    <Card className="h-full flex flex-col border-dashed border-2 bg-gray-50/50 hover:bg-gray-50/80 transition-colors">
      <CardHeader>
        <CardTitle>Create New Interview</CardTitle>
        <CardDescription>
          Start a new AI-powered mock interview session
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-interview-muted flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-interview-primary" />
          </div>
          <p className="text-sm text-gray-500">
            Choose from behavioral, technical, or mixed interview formats
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-interview-primary hover:bg-interview-primary/90">
          <Link to="/interview/new">
            Start New Interview
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
