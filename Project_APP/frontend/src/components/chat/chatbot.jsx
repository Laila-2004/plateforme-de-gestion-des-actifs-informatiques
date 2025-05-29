import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Bot, X, Building, Wrench, HelpCircle } from 'lucide-react';

const ChatBot = ({ userId = 1 }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      setMessages([{
        id: 1,
        content: "👋 Bonjour ! Je suis votre **Assistant IT**.\n\nJe peux vous aider avec :\n\n🏢 **Informations entreprise** - Départements et services\n🎫 **Création de tickets** - Guide étape par étape\n🔧 **Solutions techniques** - Aide pour vos problèmes\n❓ **Questions générales** - Assistance générale\n\n💬 Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: userId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          content: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Erreur de communication');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: `❌ Désolé, une erreur s'est produite : ${error.message}\n\n🔄 Veuillez réessayer dans quelques instants.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: "Départements", icon: Building, message: "Quels sont les départements de l'entreprise ?" },
    { label: "Créer ticket", icon: HelpCircle, message: "Comment créer un ticket ?" },
    { label: "Problème PC", icon: Wrench, message: "Mon ordinateur ne fonctionne pas bien" }
  ];

  const sendQuickMessage = (message) => {
    setInputMessage(message);
    setTimeout(() => sendMessage(), 100);
  };

  const formatMessage = (content) => {
    // Formatage simple pour le markdown
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton d'ouverture du chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border w-96 h-[500px] flex flex-col overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">Assistant IT</h3>
                <p className="text-xs opacity-90">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors w-9 bg-red-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Actions rapides */}
          {messages.length <= 1 && (
            <div className="p-3 bg-gray-50 border-b">
              <p className="text-xs text-gray-600 mb-2">Actions rapides :</p>
              <div className="flex gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendQuickMessage(action.message)}
                    className="flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs border shadow-sm hover:shadow transition-all"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[280px] px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <Bot size={16} className="mt-1 text-blue-600 flex-shrink-0" />
                    )}
                    {message.isUser && (
                      <User size={16} className="mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed">
                      {message.isUser ? message.content : formatMessage(message.content)}
                    </div>
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} className="text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">En train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed w-10"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBot;