import React, { useState, useRef, useEffect } from 'react';
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0A2E1F] text-[#60E677] rounded-full shadow-2xl flex items-center justify-center z-50 border-2 border-[#1a4a35] focus:outline-none"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#0A2E1F] p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a4a35] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#60E677]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Cassandra</h3>
                  <p className="text-[#60E677] text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60E677] inline-block animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn(
                    "flex max-w-[85%] gap-2",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === 'user' ? "bg-gray-200" : "bg-[#0A2E1F]"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-[#60E677]" />
                    )}
                  </div>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-[#0A2E1F] text-white rounded-tr-sm" 
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex max-w-[85%] gap-2 mr-auto"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0A2E1F] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-[#60E677]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="pr-12 h-11 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#60E677] focus:ring-1 focus:ring-[#60E677]/50"
                />
                <Button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute right-1 w-9 h-9 rounded-lg bg-[#0A2E1F] hover:bg-[#1a4a35] text-white disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
