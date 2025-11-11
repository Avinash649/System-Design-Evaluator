
import React from 'react';
import { Design } from '../types';

interface DesignDetailsProps {
  design: Design;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);


const DesignDetails: React.FC<DesignDetailsProps> = ({ design, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const { problem, requirements, architecture, decisions, evaluation } = design;

  const createMarkdown = () => {
    return `
# System Design: ${design.title}

## 1. Problem Definition
${problem}

## 2. Requirements & Constraints
${requirements}

## 3. Architecture Sketch
${architecture}

## 4. Design Decisions & Trade-offs
${decisions}

---

# AI Evaluation

**Score:** ${evaluation?.score.toFixed(1) || 'N/A'} / 10.0

**Feedback:**
${evaluation?.feedback || 'No feedback available.'}
    `;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createMarkdown().trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-base-200 rounded-lg shadow-2xl w-full max-w-4xl my-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-base-content">{design.title}</h2>
              <p className="text-sm text-gray-400">Created: {new Date(design.createdAt).toLocaleString()}</p>
            </div>
            <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-base-300 hover:bg-gray-600 focus:outline-none"
            >
                <CopyIcon />
                {copied ? 'Copied!' : 'Copy as Markdown'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Submission */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-brand-secondary border-b border-base-300 pb-2">Your Submission</h3>
              <div>
                <h4 className="font-bold">Problem Definition</h4>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{problem}</p>
              </div>
              <div>
                <h4 className="font-bold">Requirements & Constraints</h4>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{requirements}</p>
              </div>
              <div>
                <h4 className="font-bold">Architecture Sketch</h4>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{architecture}</p>
              </div>
              <div>
                <h4 className="font-bold">Design Decisions</h4>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{decisions}</p>
              </div>
            </div>

            {/* AI Evaluation */}
            <div className="space-y-6 bg-base-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-secondary border-b border-base-300 pb-2">AI Evaluation</h3>
              {evaluation ? (
                <>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Overall Score</p>
                    <p className="text-5xl font-bold text-green-400">{evaluation.score.toFixed(1)}<span className="text-2xl text-gray-400">/10</span></p>
                  </div>
                  <div>
                    <h4 className="font-bold">Feedback</h4>
                    <div className="prose prose-invert prose-sm text-gray-300 mt-2 max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: evaluation.feedback.replace(/\n/g, '<br />') }} />
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">Evaluation is pending or was not successful.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;
