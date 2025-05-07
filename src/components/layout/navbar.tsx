
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ButtonLink } from '@/components/ui/button-link';
import { Mic, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const Navbar = ({ isAuthenticated }: NavbarProps = {}) => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use the prop if provided, otherwise use the currentUser from context
  const isLoggedIn = isAuthenticated !== undefined ? isAuthenticated : !!currentUser;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-interview-primary" />
          <span className="text-xl font-bold text-interview-primary">InterviewAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-interview-primary transition-colors">
            Home
          </Link>
          
          {isLoggedIn ? (
            <>
              <ButtonLink href="/dashboard" variant="outline">
                Dashboard
              </ButtonLink>
              <Button onClick={logout} variant="ghost">
                Logout
              </Button>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{currentUser?.email?.split('@')[0]}</span>
              </div>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="outline">
                Login
              </ButtonLink>
              <ButtonLink href="/signup" variant="default">
                Sign Up
              </ButtonLink>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-interview-primary transition-colors">
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-interview-primary transition-colors">
                  Dashboard
                </Link>
                <Button onClick={logout} variant="ghost" className="justify-start px-0">
                  Logout
                </Button>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentUser?.email?.split('@')[0]}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <ButtonLink href="/login" variant="outline">
                  Login
                </ButtonLink>
                <ButtonLink href="/signup" variant="default">
                  Sign Up
                </ButtonLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
