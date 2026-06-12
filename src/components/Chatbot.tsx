import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function Chatbot() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hello! I am Cassandra, your Made-in-US virtual assistant. I'm here to help you find the perfect American car. What are you looking for today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (isAdminPage) return null;



  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-16 h-16 bg-[#0A2E1F] text-[#60E677] rounded-full shadow-2xl flex items-center justify-center z-[60] border-2 border-[#60E677]/40 focus:outline-none animate-glow-green"
      >
        <Bot className="w-8 h-8 drop-shadow-[0_0_8px_rgba(96,230,119,0.8)]" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[400px] h-[600px] max-h-[calc(100vh-48px)] sm:max-h-[calc(100vh-120px)] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-[60] border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#0A2E1F] p-5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a4a35] flex items-center justify-center border border-[#60E677]/30 shadow-inner">
                  <Bot className="w-7 h-7 text-[#60E677] drop-shadow-[0_0_5px_rgba(96,230,119,0.5)]" />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight">Cassandra</h3>
                  <p className="text-[#60E677] text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#60E677] inline-block animate-pulse shadow-[0_0_8px_#60E677]"></span>
                    AI Assistant
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn(
                    "flex max-w-[85%] gap-3",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                    msg.role === 'user' ? "bg-white border border-gray-100" : "bg-[#0A2E1F] border border-[#60E677]/20"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Bot className="w-5 h-5 text-[#60E677] drop-shadow-[0_0_3px_rgba(96,230,119,0.4)]" />
                    )}
                  </div>
                  <div className={cn(
                    "px-5 py-3.5 rounded-[22px] text-sm leading-relaxed font-medium",
                    msg.role === 'user' 
                      ? "bg-[#0A2E1F] text-white rounded-tr-none shadow-lg shadow-black/5" 
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex max-w-[85%] gap-3 mr-auto"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0A2E1F] border border-[#60E677]/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-[#60E677] animate-pulse" />
                  </div>
                  <div className="px-5 py-4 rounded-[22px] bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#60E677]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#60E677]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#60E677] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white border-t border-gray-100 shrink-0">
              <div className="relative flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Cassandra anything..."
                  className="pr-12 h-12 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/10 transition-all font-medium text-sm"
                />
                <Button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute right-1 w-10 h-10 rounded-xl bg-[#0A2E1F] hover:bg-[#1a4a35] text-white shadow-lg shadow-[#0A2E1F]/10 disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest opacity-50">Powered by Cassandra AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
