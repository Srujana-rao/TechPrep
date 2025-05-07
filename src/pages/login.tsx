
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Login = () => {
  const { login, signup, currentUser, isLoading, emailConfirmationRequired } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    await signup(email, password, name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome to InterviewAI</h1>
            <p className="text-gray-500 mt-2">Sign in or create an account to continue</p>
          </div>
          
          {emailConfirmationRequired && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Email verification needed</AlertTitle>
              <AlertDescription className="text-amber-700">
                Please check your inbox and confirm your email address before logging in.
              </AlertDescription>
            </Alert>
          )}
          
          <AuthForm 
            onLogin={handleLogin} 
            onSignup={handleSignup} 
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Login;
