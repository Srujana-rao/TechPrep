
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define types for our auth context
interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage in this mock version)
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call Firebase auth
      // For now, we'll just mock a successful login
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser = {
        uid: 'mock-user-1',
        email,
        displayName: email.split('@')[0],
      };
      
      // Save to localStorage to persist the session
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Update state
      setCurrentUser(mockUser);
      
      // Show success message
      toast({
        title: 'Login successful',
        description: `Welcome back, ${mockUser.displayName}!`,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call Firebase auth
      // For now, we'll just mock a successful signup
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser = {
        uid: 'mock-user-' + Date.now(),
        email,
        displayName: name,
      };
      
      // Save to localStorage to persist the session
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Update state
      setCurrentUser(mockUser);
      
      // Show success message
      toast({
        title: 'Account created',
        description: `Welcome to InterviewAI, ${name}!`,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'An error occurred during signup.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call Firebase auth
      // For now, we'll just remove from localStorage
      
      // Remove from localStorage
      localStorage.removeItem('mockUser');
      
      // Update state
      setCurrentUser(null);
      
      // Show success message
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
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
