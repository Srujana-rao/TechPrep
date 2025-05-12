
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Define types for our auth context
interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  emailConfirmationRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session and set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        // Handle email confirmation event
        if (event === 'USER_UPDATED' && session) {
          // Check if this was an email confirmation
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('type') === 'email_confirmation') {
            toast({
              title: 'Email confirmed',
              description: 'Your email has been successfully confirmed. You are now logged in.',
            });
            
            // Remove the query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Navigate to dashboard
            navigate('/dashboard');
          }
        }
        
        // If user signs out, clear any user-specific data from localStorage
        if (event === 'SIGNED_OUT') {
          try {
            // We don't delete the data, just ensure we don't display it when logged out
            console.log('User signed out, data preserved for next login');
          } catch (error) {
            console.error('Error handling sign out:', error);
          }
        }
        
        // Fetch any additional user data if needed
        if (session?.user) {
          setTimeout(() => {
            console.log('User authenticated:', session.user.id);
            
            // Upon login, ensure all interviews in local storage are properly assigned to this user
            try {
              const storedInterviews = localStorage.getItem('interviewResults');
              if (storedInterviews) {
                const parsedInterviews = JSON.parse(storedInterviews);
                
                if (Array.isArray(parsedInterviews)) {
                  // Find any interviews that may belong to this user but don't have user_id set
                  const hasUnassignedInterviews = parsedInterviews.some(
                    (interview: any) => !interview.user_id
                  );
                  
                  if (hasUnassignedInterviews) {
                    // Update unassigned interviews with this user's ID
                    const updatedInterviews = parsedInterviews.map((interview: any) => 
                      interview.user_id ? interview : { ...interview, user_id: session.user.id }
                    );
                    
                    localStorage.setItem('interviewResults', JSON.stringify(updatedInterviews));
                    console.log('Updated unassigned interviews with user ID');
                  }
                }
              }
            } catch (error) {
              console.error('Error updating interviews on login:', error);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Handle direct email confirmation links
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      if (type === 'recovery' || type === 'email_confirmation') {
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          try {
            // Set the session from the URL parameters
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) throw error;
            
            if (data.session) {
              setSession(data.session);
              setCurrentUser(data.session.user);
              
              toast({
                title: type === 'recovery' ? 'Password Reset Successful' : 'Email Confirmed',
                description: type === 'recovery' 
                  ? 'Your password has been reset successfully.' 
                  : 'Your email has been confirmed successfully.',
              });
              
              // Navigate to dashboard and clean up URL
              window.history.replaceState({}, document.title, '/dashboard');
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Error handling email confirmation:', error);
            toast({
              title: 'Authentication Error',
              description: 'There was a problem processing your request. Please try logging in manually.',
              variant: 'destructive',
            });
            navigate('/login');
          }
        }
      }
    };

    handleEmailConfirmation();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Login function using Supabase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Check specifically for email confirmation error
        if (error.message.includes('Email not confirmed')) {
          setEmailConfirmationRequired(true);
          toast({
            title: 'Email confirmation required',
            description: 'Please check your inbox and confirm your email before logging in.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        // Success message
        toast({
          title: 'Login successful',
          description: `Welcome back!`,
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function using Supabase
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setEmailConfirmationRequired(false);
    
    try {
      // Enable email confirmation in the signup options
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      });
      
      if (error) {
        throw error;
      }

      // Check if email confirmation is required by checking if session is not returned
      if (!data.session) {
        setEmailConfirmationRequired(true);
        toast({
          title: 'Verification email sent',
          description: `Please check your inbox at ${email} and confirm your email before logging in.`,
        });
      } else {
        // Success message - user is auto-confirmed
        toast({
          title: 'Account created',
          description: `Welcome to InterviewAI, ${name}!`,
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function using Supabase
  const logout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Success message
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Clear user state
      setCurrentUser(null);
      setSession(null);
      
      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    session,
    isLoading,
    emailConfirmationRequired,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
