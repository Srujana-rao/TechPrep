
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
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        // Fetch any additional user data if needed
        if (session?.user) {
          setTimeout(() => {
            // This could fetch additional user data from profiles table if needed
            console.log('User authenticated:', session.user.id);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Check if email confirmation is required
      if (!data.session) {
        setEmailConfirmationRequired(true);
        toast({
          title: 'Verification email sent',
          description: `Please check your inbox and confirm your email before logging in.`,
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
