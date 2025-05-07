
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

// Create form schema
const formSchema = z.object({
  position: z.string().min(2, 'Position is required'),
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  skills: z.string().min(2, 'Please list your key skills'),
  jobDescription: z.string().optional(),
  interviewType: z.string().min(1, 'Please select an interview type'),
  additionalInfo: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof formSchema>;

const NewInterviewPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: '',
      experienceLevel: '',
      skills: '',
      jobDescription: '',
      interviewType: '',
      additionalInfo: '',
    },
  });

  const onSubmit = async (values: InterviewFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Mock interview generation (in a real app, we would save this to a database)
      console.log('Form values:', values);
      
      // Create a mock interview ID (in a real app, this would come from the backend)
      const interviewId = Math.random().toString(36).substring(2, 11);
      
      toast({
        title: "Interview Created",
        description: "Your interview is ready to begin!",
        duration: 3000,
      });
      
      // Navigate to the interview page with the new ID
      setTimeout(() => {
        navigate(`/interview/${interviewId}`);
      }, 1000);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Interview</h1>
          <p className="text-gray-500">Fill in the details below to customize your interview experience</p>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
            <CardDescription>
              Provide information about the position and your skills to get a tailored interview experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the job title you're interviewing for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior (6+ years)</SelectItem>
                          <SelectItem value="lead">Lead/Management</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps tailor questions to your experience level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React, TypeScript, Node.js" {...field} />
                      </FormControl>
                      <FormDescription>
                        List your primary technical skills, separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste job description here if available" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        If you have a job description, paste it here for more targeted questions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interviewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interview type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technical">Technical Interview</SelectItem>
                          <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                          <SelectItem value="mixed">Mixed (Technical & Behavioral)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of interview you want to practice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific areas you want to focus on or improve?" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Share any additional context that will help customize your interview
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="bg-interview-primary hover:bg-interview-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Start Interview'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewInterviewPage;
