
import React, { useState, useEffect } from 'react';
import { User, Design, View, DesignData, Evaluation } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import DesignWizard from './components/DesignWizard';
import Header from './components/Header';
import DesignDetails from './components/DesignDetails';

// Mock Data
const MOCK_DESIGNS: Design[] = [
  {
    id: 'design_1',
    title: 'Scalable Chat Application',
    problem: 'Design a scalable chat application.',
    requirements: 'Real-time messaging, 1M concurrent users, low latency, message history.',
    architecture: 'Frontend: React, Backend: Node.js with Socket.IO, DB: Cassandra for messages, Redis for presence.',
    decisions: 'Used Cassandra for its write performance and scalability. WebSockets for real-time communication.',
    evaluation: {
      score: 8.5,
      feedback: 'Good scalability approach with Cassandra. Fault tolerance could be improved by adding redundancy to the backend services. Consider a message queue for decoupling services.'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'design_2',
    title: 'Photo Sharing Service',
    problem: 'Design a photo sharing service like Instagram.',
    requirements: 'Users can upload photos, follow other users, see a feed. High availability.',
    architecture: 'Microservices architecture. Services for user auth, photo upload, feed generation. CDN for images. PostgreSQL for user data. Object storage (S3) for photos.',
    decisions: 'Microservices for independent scaling. CDN is crucial for low-latency image delivery.',
    evaluation: {
      score: 9.0,
      feedback: 'Excellent choice of microservices and using a CDN. The feed generation logic could be complex; consider a pre-computed feed using a worker service for better performance.'
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  }
];


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.AUTH);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  
  // Check for active session on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const loggedInUser: User = JSON.parse(storedUser);
        setUser(loggedInUser);
        setDesigns(MOCK_DESIGNS); // Load designs for the logged-in user
        setCurrentView(View.DASHBOARD);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
  }, []);


  const handleLogin = (loggedInUser: User) => {
    const userToStore = { ...loggedInUser };
    delete userToStore.password; // Do not store password in session
    
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    setUser(loggedInUser);
    setDesigns(MOCK_DESIGNS); // Load mock designs for demo
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setDesigns([]);
    setCurrentView(View.AUTH);
  };

  const handleNewDesign = () => {
    setCurrentView(View.WIZARD);
  };
  
  const handleCancelWizard = () => {
    setCurrentView(View.DASHBOARD);
  };

  const handleWizardComplete = (designData: DesignData, evaluation: Evaluation) => {
    const newDesign: Design = {
      id: `design_${Date.now()}`,
      title: designData.problem.length > 50 ? designData.problem.substring(0, 47) + '...' : designData.problem,
      ...designData,
      evaluation,
      createdAt: new Date().toISOString(),
    };
    setDesigns([newDesign, ...designs]);
    setCurrentView(View.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.AUTH:
        return <Auth onLogin={handleLogin} />;
      case View.DASHBOARD:
        return <Dashboard designs={designs} onNewDesign={handleNewDesign} onViewDesign={setSelectedDesign} />;
      case View.WIZARD:
        return <DesignWizard onComplete={handleWizardComplete} onCancel={handleCancelWizard} />;
      default:
        return <Auth onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      {currentView !== View.AUTH && <Header user={user} onLogout={handleLogout} />}
      <main>
        {renderContent()}
      </main>
      {selectedDesign && (
        <DesignDetails design={selectedDesign} onClose={() => setSelectedDesign(null)} />
      )}
    </div>
  );
};

export default App;
