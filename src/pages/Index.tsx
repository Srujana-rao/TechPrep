
import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />

        {/* How It Works Section */}
        <section className="py-16 bg-interview-light">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-500 max-w-3xl mx-auto">
                Start preparing for your next interview in just a few simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-interview-primary text-white font-bold flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-500">Sign up for free and set up your profile with your experience and target roles.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-interview-primary text-white font-bold flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Interview Type</h3>
                <p className="text-gray-500">Select from behavioral, technical, or mixed formats tailored to your specific role.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-interview-primary text-white font-bold flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Instant Feedback</h3>
                <p className="text-gray-500">Receive detailed analysis and actionable insights to improve your interview performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-interview-primary text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who have improved their interview skills with our AI-powered platform.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="/signup">Get Started Now</a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-12 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">InterviewAI</h3>
                <p className="text-gray-500">
                  AI-powered mock interviews to help you land your dream job.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="/features" className="text-gray-500 hover:text-interview-primary">Features</a></li>
                  <li><a href="/pricing" className="text-gray-500 hover:text-interview-primary">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="/blog" className="text-gray-500 hover:text-interview-primary">Blog</a></li>
                  <li><a href="/help" className="text-gray-500 hover:text-interview-primary">Help Center</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-500 hover:text-interview-primary">About Us</a></li>
                  <li><a href="/contact" className="text-gray-500 hover:text-interview-primary">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-12 pt-6 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
