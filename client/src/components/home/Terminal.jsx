import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send, CornerDownLeft } from 'lucide-react';

const initialHistory = [
  {
    type: 'output',
    text: 'Mohamed Alaa Portfolio Terminal v2.6.0\nType "help" or click one of the quick commands below to inspect profile.',
  },
  {
    type: 'command',
    command: 'whoami',
  },
  {
    type: 'output',
    text: 'Mohamed Alaa - Frontend & Full-Stack Developer\nComputer & System Engineering graduate | 600+ ICPC Problems Solved',
  },
];

const Terminal = ({ onNavigate }) => {
  const [history, setHistory] = useState(initialHistory);
  const [inputVal, setInputVal] = useState('');

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim().toLowerCase();
    const newEntry = { type: 'command', command: cmdStr };

    let outputText = '';
    let action = null;

    switch (trimmed) {
      case 'help':
        outputText =
          'Available commands:\n  • whoami     - Display summary bio\n  • skills     - Print core tech stack\n  • projects   - View flagship portfolio projects\n  • icpc       - View competitive programming achievements\n  • contact    - Get email & phone details\n  • hire       - Trigger hire inquiry\n  • clear      - Clear terminal screen';
        break;
      case 'whoami':
        outputText =
          'Mohamed Alaa | Full-Stack & Frontend Developer\nEducation: B.Sc. Computer & System Engineering (Minya University, 2019-2024)\nExperience: Frontend Developer at InstaTech (08/2023 - Present)';
        break;
      case 'skills':
        outputText =
          'Frontend:  React JS, Next JS, TypeScript, JavaScript, Tailwind CSS, Bootstrap\nBackend:   Node.js, Express, REST APIs, MongoDB\nCore:      C++, Problem Solving, Data Structures & Algorithms, OOP\nTools:     Git, GitHub, Agile, VS Code';
        break;
      case 'projects':
        outputText =
          '1. Education Platform Website (Full-Stack - Quizzes & Assignments)\n2. Restaurant Website (Frontend - Realtime Menu & Shopping Cart)\n3. ERP System Website (Enterprise - Role Management & Operations)\n4. Al-Zahraa Website (eCommerce - Product Catalog & Ordering)';
        action = () => onNavigate && onNavigate('#projects');
        break;
      case 'icpc':
      case 'competitive':
        outputText =
          '🏆 Competitive Programming Highlights:\n  • 600+ Algorithmic Problems solved in ICPC Community\n  • ECPC Contest 2022 Official Contestant\n  • IEEE Autonomous Robotics Participant';
        break;
      case 'contact':
        outputText =
          '📧 Email: mohamedalaaelnasharedu@gmail.com\n📱 Phone: 01063977292\n📍 Location: Egypt\n🔗 LinkedIn & GitHub available on page';
        action = () => onNavigate && onNavigate('#contact');
        break;
      case 'hire':
      case 'sudo hire':
        outputText =
          '🎉 Status: Open for exciting opportunities! Scrolling you directly to the contact form...';
        action = () => onNavigate && onNavigate('#contact');
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        return;
      default:
        outputText = `zsh: command not found: "${trimmed}". Type "help" for a list of available commands.`;
        break;
    }

    setHistory((prev) => [...prev, newEntry, { type: 'output', text: outputText }]);
    setInputVal('');

    if (action) {
      setTimeout(action, 600);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal) return;
    executeCommand(inputVal);
  };

  const scrollContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const quickCommands = ['skills', 'projects', 'icpc', 'contact', 'hire'];

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl glass-card overflow-hidden shadow-2xl border border-slate-700/60 font-mono text-xs sm:text-sm">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-[11px] text-slate-400 font-sans ml-2 flex items-center gap-1.5 font-medium">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            mohamed@developer: ~
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive</span>
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div
        ref={scrollContainerRef}
        className="p-4 sm:p-5 h-64 sm:h-72 overflow-y-auto bg-dark-950/80 text-slate-300 space-y-3 font-mono"
      >
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === 'command' ? (
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-emerald-400">➜</span>
                <span className="text-indigo-400">~</span>
                <span className="text-slate-100 font-semibold">{item.command}</span>
              </div>
            ) : (
              <div className="text-slate-400 whitespace-pre-line pl-4 border-l border-slate-800/80 my-1 font-light">
                {item.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Input Line */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-bold shrink-0">➜</span>
        <span className="text-indigo-400 font-bold shrink-0">~</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'help' or command..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs sm:text-sm font-mono"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          title="Send command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-dark-900/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-slate-500 font-sans shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Quick:
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-0.5 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
