import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, Send, User, ChevronDown, Mic, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const MoveFlowAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi! I am MoveFlow AI. How can I help with your ride today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Temporary mock response if backend isn't ready, but attempting to hit actual backend
      const res = await apiClient.post('/agent/chat', { message: text });
      
      const aiMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: res.data.message || 'I processed your request!', 
        timestamp: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      console.error(e);
      // Fallback response for hackathon demo if backend fails
      const fallbackMessage = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "I couldn't reach the AI brain right now. Please try again in a moment.", 
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = user?.role === 'driver' 
    ? ['Where should I go?', 'Find passengers', 'Optimize route', 'Demand forecast']
    : ['Find a ride', 'Explain match', 'Check demand'];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 bg-gray-900 text-white p-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform flex items-center gap-2 group"
        >
          <div className="bg-brand/20 p-1.5 rounded-full group-hover:bg-brand transition-colors">
            <BrainCircuit className="w-5 h-5 text-brand group-hover:text-gray-900" />
          </div>
          <span className="font-bold text-sm pr-2 overflow-hidden w-0 group-hover:w-auto transition-all">MoveFlow AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-4 z-50 sm:w-96 sm:h-[600px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:border sm:border-gray-200">
          
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <BrainCircuit className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <div className="font-black text-lg">MoveFlow AI</div>
                <div className="text-xs text-brand font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Intelligent Assistant
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div className="text-center text-xs text-gray-400 font-bold uppercase mb-4">Today</div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-brand uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> MoveFlow
                    </div>
                  )}
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-brand animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-brand animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-100 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-1">
              {quickActions.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(action)}
                  className="shrink-0 text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="relative flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors border border-gray-100 shrink-0">
                <Mic className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask MoveFlow AI..."
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand rounded-full py-2.5 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-gray-900 hover:bg-brand-dark transition-colors shrink-0 disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default MoveFlowAssistant;
