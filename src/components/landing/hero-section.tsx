
import React from 'react';
import { ButtonLink } from '@/components/ui/button-link';

export const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-interview-light to-white py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Master Your Next Interview with AI
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Practice with realistic AI-powered mock interviews tailored to your industry and role. Receive instant feedback to improve your skills.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
              <ButtonLink href="/signup" className="bg-interview-primary hover:bg-interview-primary/90">
                Get Started
              </ButtonLink>
              <ButtonLink href="/features" variant="outline">
                Learn More
              </ButtonLink>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border shadow-lg">
              <div className="absolute inset-0 bg-interview-primary/10 flex items-center justify-center">
                <div className="bg-white/95 p-6 rounded-lg shadow-lg max-w-[80%]">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-interview-primary flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">AI Interviewer</p>
                      <p className="text-sm text-gray-600">Tell me about a challenging project you worked on and how you overcame obstacles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
