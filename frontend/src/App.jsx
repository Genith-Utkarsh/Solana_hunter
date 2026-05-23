import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component imports
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileNav from './components/MobileNav';
import AIChatModal from './components/AIChatModal';

// View imports
import Login from './views/Login';
import Roadmap from './views/Roadmap';
import Inventory from './views/Inventory';
import CustomQuests from './views/CustomQuests';
import Rankings from './views/Rankings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('roadmap'); // 'roadmap', 'inventory', 'custom-quests', 'rankings'
  const [quests, setQuests] = useState([]);
  const [loadingQuests, setLoadingQuests] = useState(false);
  const [activeQuestForAI, setActiveQuestForAI] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Set auth header helper
  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user profile if token exists
  useEffect(() => {
    if (token) {
      setAuthHeader(token);
      axios.get('/api/auth/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('Failed to load user profile, logging out', err);
          logout();
        });
    }
  }, [token]);

  // Load quests once user is logged in
  useEffect(() => {
    if (user) {
      fetchQuests();
    }
  }, [user]);

  const fetchQuests = async () => {
    setLoadingQuests(true);
    try {
      const res = await axios.get('/api/quests');
      setQuests(res.data);
    } catch (err) {
      console.error('Error fetching quests', err);
    } finally {
      setLoadingQuests(false);
    }
  };

  const login = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    setAuthHeader(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    setCurrentView('roadmap');
  };

  const toggleQuest = async (questId) => {
    try {
      const res = await axios.post(`/api/quests/${questId}/toggle`);
      
      // Update quests list completion status locally
      setQuests(prev => prev.map(q => {
        if (q.questId === questId) {
          return { ...q, isCompleted: res.data.isCompleted };
        }
        return q;
      }));

      // Update user stats and level
      if (user) {
        setUser(prev => ({
          ...prev,
          ...res.data.user
        }));
      }
    } catch (err) {
      console.error('Error toggling quest completion', err);
    }
  };

  const openAIChat = (quest) => {
    setActiveQuestForAI(quest);
    setAiModalOpen(true);
  };

  if (!token || !user) {
    return <Login onLogin={login} />;
  }

  // Determine current active phase for rank tag
  const getRankName = (level) => {
    if (level < 17) return 'F-RANK';
    if (level < 40) return 'E-RANK';
    if (level < 55) return 'D-RANK';
    if (level < 75) return 'C-RANK';
    if (level < 90) return 'B-RANK';
    if (level < 100) return 'A-RANK';
    return 'S-RANK';
  };

  return (
    <div className="antialiased min-h-screen flex flex-col md:flex-row bg-[#050505] text-[#e5e2e1]">
      {/* Mobile Top App Bar */}
      <MobileHeader 
        user={user} 
        rank={getRankName(user.level)} 
        onLogout={logout} 
      />

      {/* Desktop Sidebar Navigation */}
      <Sidebar 
        user={user} 
        rank={getRankName(user.level)} 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={logout} 
        onQuestCreated={fetchQuests}
      />

      {/* Main Content Area */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen relative overflow-hidden">
        {/* Decorative Background Glowing Orbs */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-container-max mx-auto relative z-10">
          {currentView === 'roadmap' && (
            <Roadmap 
              user={user} 
              quests={quests} 
              loading={loadingQuests} 
              onToggleQuest={toggleQuest} 
              onAskAI={openAIChat} 
              rank={getRankName(user.level)}
            />
          )}

          {currentView === 'inventory' && (
            <Inventory user={user} />
          )}

          {currentView === 'custom-quests' && (
            <CustomQuests 
              quests={quests} 
              onQuestCreated={fetchQuests}
              onToggleQuest={toggleQuest}
              onAskAI={openAIChat}
            />
          )}

          {currentView === 'rankings' && (
            <Rankings user={user} />
          )}
        </div>
      </main>

      {/* Mobile Bottom Sticky Navigation */}
      <MobileNav currentView={currentView} setView={setCurrentView} />

      {/* AI Chat Assistant Terminal Drawer */}
      <AIChatModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        quest={activeQuestForAI}
      />
    </div>
  );
}

export default App;
