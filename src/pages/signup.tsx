
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { login, signup, currentUser, isLoading } = useAuth();
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
            <h1 className="text-2xl font-bold">Join InterviewAI</h1>
            <p className="text-gray-500 mt-2">Create an account to start practicing</p>
          </div>
          <AuthForm 
            onLogin={handleLogin} 
            onSignup={handleSignup} 
            isLoading={isLoading}
            defaultTab="signup"
          />
        </div>
      </main>
    </div>
  );
};

export default Signup;
