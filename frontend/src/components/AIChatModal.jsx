import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AIChatModal({ isOpen, onClose, quest }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusLogs, setStatusLogs] = useState([]);
  const logsIntervalRef = useRef(null);

  const logs = [
    'CONNECTING TO HUNTER NEURAL NET...',
    'QUERYING CHRONOS ARCHIVES...',
    'SEEKING COGNITIVE DATA ENVELOPES...',
    'PARSING LEVEL REQUIREMENTS...',
    'DECRYPTING INSTRUCTIONAL SCHEMAS...',
    'GENERATING CODING PROTOCOLS...',
    'SYSTEM GUIDANCE INITIALIZED.'
  ];

  useEffect(() => {
    if (isOpen && quest) {
      fetchExplanation();
    } else {
      // Reset state on close
      setContent('');
      setError('');
      setStatusLogs([]);
      if (logsIntervalRef.current) clearInterval(logsIntervalRef.current);
    }
  }, [isOpen, quest]);

  const fetchExplanation = async () => {
    setLoading(true);
    setError('');
    setContent('');
    setStatusLogs([logs[0]]);

    // Animate status logs
    let index = 1;
    logsIntervalRef.current = setInterval(() => {
      if (index < logs.length) {
        setStatusLogs(prev => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(logsIntervalRef.current);
      }
    }, 450);

    try {
      const res = await axios.post('/api/ai/explain', { questId: quest.questId });
      setContent(res.data.text);
    } catch (err) {
      console.error(err);
      setError('System Error: Failed to establish neural link with Gemini Core.');
    } finally {
      setLoading(false);
      if (logsIntervalRef.current) clearInterval(logsIntervalRef.current);
    }
  };

  if (!isOpen || !quest) return null;

  // Simple custom parser for markdown to render beautiful cyberpunk HTML
  const renderMarkdown = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = '';

    return lines.map((line, idx) => {
      // Code Block Detection
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const joinedCode = codeContent.join('\n');
          codeContent = [];
          
          return (
            <div key={idx} className="my-4 border border-outline-variant/40 rounded bg-surface-container-lowest overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-[#0e0e0e] border-b border-outline-variant/30">
                <span className="font-label-mono text-[10px] text-primary uppercase">{codeLanguage || 'code'}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(joinedCode)}
                  className="font-label-mono text-[10px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">content_copy</span> COPY
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-label-mono text-[12px] text-[#bbffd1] leading-relaxed">
                <code>{joinedCode}</code>
              </pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="font-headline-md text-headline-md text-[#d8b9ff] border-b border-[#d8b9ff]/20 pb-2 mt-6 mb-3 uppercase tracking-wider">
            {line.substring(2)}
          </h2>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-headline-md text-[18px] text-primary mt-4 mb-2 uppercase tracking-wide">
            {line.substring(3)}
          </h3>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-label-mono text-[13px] text-secondary-fixed mt-4 mb-1 uppercase tracking-widest">
            {line.substring(4)}
          </h4>
        );
      }

      // Blockquotes / Alerts
      if (line.startsWith('> ')) {
        const quoteText = line.substring(2);
        return (
          <blockquote key={idx} className="border-l-2 border-primary bg-primary/5 px-4 py-2 my-3 rounded-r text-[13px] text-on-surface-variant font-body-md italic">
            {quoteText.replace('[!NOTE]', 'SYSTEM ALERT:').replace('[!IMPORTANT]', 'CRITICAL MANUAL:')}
          </blockquote>
        );
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="flex items-start gap-2 text-[14px] text-on-surface font-body-md ml-4 my-1">
            <span className="text-primary mt-1">▸</span>
            <span>{itemText}</span>
          </li>
        );
      }

      if (line.trim().match(/^\d+\.\s/)) {
        const itemText = line.trim().replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="flex items-start gap-2 text-[14px] text-on-surface font-body-md ml-4 my-1">
            <span className="text-secondary mt-1 font-label-mono">{line.match(/^\d+/)[0]}.</span>
            <span>{itemText}</span>
          </li>
        );
      }

      // Empty Lines
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }

      // Bold text processing (quick markdown bold replacement)
      const parts = [];
      let temp = line;
      let boldMatch;
      while ((boldMatch = temp.match(/\*\*(.*?)\*\*/))) {
        const before = temp.substring(0, boldMatch.index);
        const boldText = boldMatch[1];
        parts.push(before);
        parts.push(<strong key={boldText} className="text-primary font-bold">{boldText}</strong>);
        temp = temp.substring(boldMatch.index + boldMatch[0].length);
      }
      parts.push(temp);

      // Normal text
      return (
        <p key={idx} className="text-[14px] text-on-surface-variant font-body-md leading-relaxed my-1">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in-active">
      {/* Click Outside overlay to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Side Drawer */}
      <div className="relative w-full max-w-2xl bg-[#0b0b0b] border-l border-outline-variant/30 h-full flex flex-col shadow-[0_0_50px_rgba(20,241,149,0.15)] scanline z-10">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30 bg-[#0e0e0e] z-20">
          <div>
            <div className="font-label-mono text-[10px] text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SYSTEM ARCHIVES // LVL {quest.questId}
            </div>
            <h2 className="font-headline-md text-[18px] text-white tracking-wide uppercase mt-0.5 truncate max-w-[400px]" title={quest.title}>
              {quest.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-1 font-label-mono text-[11px] border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary px-3 py-1.5 rounded transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">close</span> ESC
          </button>
        </div>

        {/* Terminal Screen Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          
          {/* Loading logs screen */}
          {loading && (
            <div className="flex flex-col justify-center min-h-[300px] font-label-mono text-[13px] text-primary space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined animate-spin">sync</span>
                <span>DECRYPTING NEURAL PROTOCOLS...</span>
              </div>
              <div className="bg-[#080a09] border border-primary/20 rounded p-4 space-y-1 opacity-80">
                {statusLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#d8b9ff] select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
              <span className="material-symbols-outlined text-[64px] text-error">warning_amber</span>
              <p className="font-label-mono text-error uppercase tracking-widest">{error}</p>
              <button 
                onClick={fetchExplanation}
                className="px-4 py-2 border border-error text-error hover:bg-error/10 font-label-mono text-[12px] rounded transition-all"
              >
                RE-ESTABLISH LINK
              </button>
            </div>
          )}

          {/* Rendered Guide content */}
          {!loading && !error && content && (
            <div className="space-y-4 text-left pb-10">
              {renderMarkdown(content)}
            </div>
          )}
        </div>

        {/* Footer info line */}
        <div className="px-6 py-3 border-t border-outline-variant/30 bg-[#0c0c0c] text-center font-label-mono text-[10px] text-on-surface-variant/40 tracking-wider">
          SOLANA HUNTER COGNITIVE ENVELOPE SEED. SECURE INTERACTION LOGGED.
        </div>
      </div>
    </div>
  );
}

export default AIChatModal;
