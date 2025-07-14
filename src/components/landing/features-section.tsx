
import React from 'react';
import { Mic, MessageSquare, BarChart, Calendar, Settings } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="h-10 w-10 text-interview-primary" />,
      title: 'AI-Powered Voice Interviews',
      description: 'Experience realistic interviews with our advanced AI voice agent that asks tailored questions and responds naturally.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-interview-primary" />,
      title: 'Role-Specific Questions',
      description: 'Practice with questions customized to your specific role, seniority level, and interview type.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-interview-primary" />,
      title: 'Comprehensive Feedback',
      description: 'Receive detailed feedback on your performance across communication, technical knowledge, problem-solving, and more.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-interview-primary" />,
      title: 'Track Your Progress',
      description: 'Monitor your improvement over time with a detailed history of your practice interviews.'
    },
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose TechPrep?</h2>
          <p className="text-gray-500 max-w-3xl mx-auto">
            Our platform offers everything you need to prepare for your next job interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
