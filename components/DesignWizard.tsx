
import React, { useState } from 'react';
import { DesignData, Evaluation } from '../types';
import { evaluateDesign } from '../services/geminiService';
import Spinner from './Spinner';

interface DesignWizardProps {
  onComplete: (designData: DesignData, evaluation: Evaluation) => void;
  onCancel: () => void;
}

const STEPS = [
  {
    id: 1,
    title: 'Problem Definition',
    placeholder: 'e.g., "Design a scalable chat application"',
    key: 'problem' as keyof DesignData,
  },
  {
    id: 2,
    title: 'Requirements & Constraints',
    placeholder: 'e.g., "Real-time messaging, 1M concurrent users, low latency"',
    key: 'requirements' as keyof DesignData,
  },
  {
    id: 3,
    title: 'Architecture Sketch',
    placeholder: 'e.g., "Frontend: React; Backend: Node/Express; DB: MongoDB; Cache: Redis; Message Queue: RabbitMQ; Deployment: AWS"',
    key: 'architecture' as keyof DesignData,
  },
  {
    id: 4,
    title: 'Design Decisions & Trade-offs',
    placeholder: 'e.g., "Used WebSockets for real-time updates, chose MongoDB for schema flexibility, and Redis for message caching to reduce DB load."',
    key: 'decisions' as keyof DesignData,
  },
];

const DesignWizard: React.FC<DesignWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [designData, setDesignData] = useState<DesignData>({
    problem: '',
    requirements: '',
    architecture: '',
    decisions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentStepKey = STEPS[currentStep - 1].key;
    setDesignData({ ...designData, [currentStepKey]: e.target.value });
  };
  
  const isCurrentStepDataValid = () => {
      const currentStepKey = STEPS[currentStep - 1].key;
      return designData[currentStepKey].trim() !== '';
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const evaluation = await evaluateDesign(designData);
      onComplete(designData, evaluation);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeStep = STEPS[currentStep - 1];
  
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="bg-base-200 p-8 rounded-lg shadow-2xl">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-brand-secondary">Step {currentStep} of {STEPS.length}</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2.5">
            <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${(currentStep / STEPS.length) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-base-content mb-4">{activeStep.title}</h2>
          <textarea
            value={designData[activeStep.key]}
            onChange={handleChange}
            placeholder={activeStep.placeholder}
            rows={10}
            className="w-full p-4 bg-base-100 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition-shadow"
          />
        </div>

        {error && <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}

        <div className="mt-8 flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <button onClick={handleBack} className="px-6 py-2 text-sm font-semibold text-gray-300 bg-base-300 hover:bg-gray-600 rounded-md transition-colors">
                Back
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className="text-sm text-gray-400 hover:text-white">Cancel</button>
            {currentStep < STEPS.length ? (
              <button onClick={handleNext} disabled={!isCurrentStepDataValid()} className="px-6 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading || !isCurrentStepDataValid()} className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors w-48 disabled:bg-gray-500 disabled:cursor-wait">
                {isLoading ? <Spinner /> : 'Get AI Evaluation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignWizard;
