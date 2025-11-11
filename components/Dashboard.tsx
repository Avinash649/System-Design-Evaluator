
import React from 'react';
import { Design } from '../types';

interface DashboardProps {
  designs: Design[];
  onNewDesign: () => void;
  onViewDesign: (design: Design) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);


const ScoreBadge: React.FC<{ score: number | null }> = ({ score }) => {
  if (score === null) {
    return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-900 text-yellow-300">Pending</span>;
  }

  const getColor = () => {
    if (score >= 8) return 'bg-green-900 text-green-300';
    if (score >= 5) return 'bg-blue-900 text-blue-300';
    return 'bg-red-900 text-red-300';
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getColor()}`}>
      Score: {score.toFixed(1)}
    </span>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ designs, onNewDesign, onViewDesign }) => {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-base-content">My Designs</h1>
        <button onClick={onNewDesign} className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-md transition-colors duration-200 shadow-lg">
          <PlusIcon />
          Create New Design
        </button>
      </div>

      {designs.length === 0 ? (
        <div className="text-center py-16 px-6 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
            <h3 className="text-lg font-medium text-base-content">No designs yet</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by creating your first system design.</p>
            <div className="mt-6">
                <button onClick={onNewDesign} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary">
                    <PlusIcon />
                    Create New Design
                </button>
            </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <div key={design.id} className="bg-base-200 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-base-content mb-2 pr-2">{design.title}</h2>
                  <ScoreBadge score={design.evaluation?.score ?? null} />
                </div>
                <p className="text-sm text-gray-400">
                  Created on: {new Date(design.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-6 bg-base-300/50 rounded-b-lg">
                <button
                  onClick={() => onViewDesign(design)}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-brand-secondary hover:bg-brand-primary rounded-md transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
