import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !username)) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Register API Call
        const res = await axios.post('/api/auth/register', {
          username,
          email,
          password,
          avatar: 'avatar-1', // Default cyberpunk avatar
        });
        onLogin(res.data.token, res.data);
      } else {
        // Login API Call
        const res = await axios.post('/api/auth/login', {
          email,
          password,
        });
        onLogin(res.data.token, res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile relative bg-[#050505] overflow-hidden">
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#d8b9ff]/5 blur-[120px] pointer-events-none"></div>
      
      {/* Login Box */}
      <div className="w-full max-w-md bg-[#121212]/80 backdrop-blur-xl border border-outline-variant/30 rounded-lg p-8 system-glow scanline relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary-container to-secondary opacity-50"></div>
        
        {/* Cyberpunk Header */}
        <div className="text-center mb-8">
          <div className="font-label-mono text-label-mono text-primary flex items-center justify-center gap-2 mb-2 tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            SYSTEM INITIALIZATION
          </div>
          <h1 className="font-headline-md text-headline-md text-white tracking-widest uppercase mb-1">
            SOLANA <span className="text-primary-container">HUNTER</span>
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            {isRegister ? 'Register your hunter parameters to awaken' : 'Connect neural key to load progress'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded mb-6 font-body-md text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">report</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1.5">Hunter Callsign (Username)</label>
              <div className="relative mana-pulse rounded border border-outline-variant/50">
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SOL-01"
                  className="w-full bg-surface-container-lowest border-0 rounded p-3 text-on-surface font-body-md text-[14px] focus:outline-none focus:ring-0 placeholder-on-surface-variant/40"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1.5">Email Node</label>
            <div className="relative mana-pulse rounded border border-outline-variant/50">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@system.io"
                className="w-full bg-surface-container-lowest border-0 rounded p-3 text-on-surface font-body-md text-[14px] focus:outline-none focus:ring-0 placeholder-on-surface-variant/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1.5">Access Password</label>
            <div className="relative mana-pulse rounded border border-outline-variant/50">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-lowest border-0 rounded p-3 text-on-surface font-body-md text-[14px] focus:outline-none focus:ring-0 placeholder-on-surface-variant/40"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-primary-container text-[#050505] font-label-mono text-[12px] rounded hover:bg-primary-fixed hover:shadow-[0_0_15px_rgba(20,241,149,0.5)] transition-all duration-300 uppercase tracking-widest font-bold mt-2"
          >
            {loading ? 'SYNCHRONIZING...' : isRegister ? 'AWAKEN HUNTER' : 'CONNECT TO SYSTEM'}
          </button>
        </form>

        {/* Toggle Form Type */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="font-label-mono text-[11px] text-[#d8b9ff] hover:text-[#eddcff] underline transition-colors uppercase tracking-wider"
          >
            {isRegister ? 'Already registered? Login here' : 'New Hunter? Create System ID'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
