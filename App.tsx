import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { ChatWindow } from './components/ChatWindow';
import { TextInput } from './components/TextInput';
import { ImageInput } from './components/ImageInput';
import { VoiceInput } from './components/VoiceInput';
import { ChatHistory } from './components/ChatHistory';
import { Message, InputMode, Language, Role, Conversation } from './types';
import { PROMPT_EXPLAIN_IMAGE, PROMPT_INITIAL_MESSAGE } from './constants';
import { getAiStreamResponse } from './services/geminiService';

const createNewConversation = (): Conversation => ({
  id: Date.now().toString(),
  title: 'New Conversation',
  messages: [
    {
      id: Date.now(),
      role: Role.AI,
      text: PROMPT_INITIAL_MESSAGE,
    },
  ],
});

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [inputMode, setInputMode] = useState<InputMode>(InputMode.Text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(Language.English);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('ilm-companion-conversations');
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed);
            setActiveConversationId(parsed[0].id);
            return;
        }
      }
    } catch (error) {
        console.error("Failed to load conversations from localStorage", error);
    }
    // If nothing loaded, start a new chat
    const newConvo = createNewConversation();
    setConversations([newConvo]);
    setActiveConversationId(newConvo.id);
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
        localStorage.setItem('ilm-companion-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);
  
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId);
  }, [conversations, activeConversationId]);

  const updateConversation = useCallback((convoId: string, updateFn: (convo: Conversation) => Conversation) => {
      setConversations(prev => prev.map(c => c.id === convoId ? updateFn(c) : c));
  }, []);
  
  const handleSend = useCallback(async (text: string, imageUrl?: string) => {
    if (!activeConversationId || !activeConversation) return;

    // Check for internet connection before sending
    if (!navigator.onLine) {
        updateConversation(activeConversationId, convo => ({
            ...convo,
            messages: [...convo.messages, { id: Date.now(), role: Role.AI, text: "You appear to be offline. Please check your internet connection to chat with the AI." }],
        }));
        return;
    }

    if (!text && !imageUrl) return;

    setIsLoading(true);

    const userMessageText = text || (imageUrl ? PROMPT_EXPLAIN_IMAGE[language] : '');
    const userMessage: Message = { id: Date.now(), role: Role.User, text: userMessageText, imageUrl };

    // This history will be sent to the API
    const historyForApi = [...activeConversation.messages, userMessage];

    // Update conversation with user message and potentially a new title
    updateConversation(activeConversationId, (convo) => {
        const isFirstUserMessage = convo.messages.length === 1;
        const newTitle = isFirstUserMessage 
            ? userMessageText.substring(0, 40) + (userMessageText.length > 40 ? '...' : '') 
            : convo.title;
        return {
            ...convo,
            title: newTitle,
            messages: [...convo.messages, userMessage],
        };
    });
    
    try {
      const stream = await getAiStreamResponse(historyForApi, language);
      
      let aiResponse = '';
      const aiMessageId = Date.now();
      
      // Add a placeholder for the AI's response
       updateConversation(activeConversationId, convo => ({
          ...convo,
          messages: [...convo.messages, { id: aiMessageId, role: Role.AI, text: '' }],
      }));
      
      for await (const chunk of stream) {
        aiResponse += chunk.text;
        // Update the streaming AI message in place
        updateConversation(activeConversationId, convo => ({
            ...convo,
            messages: convo.messages.map(msg => msg.id === aiMessageId ? { ...msg, text: aiResponse } : msg),
        }));
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessageId = Date.now();
       updateConversation(activeConversationId, convo => ({
        ...convo,
        messages: [...convo.messages, { id: errorMessageId, role: Role.AI, text: "Sorry, I encountered an error. Please try again." }],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, language, conversations, activeConversation, updateConversation]);

  const handleNewConversation = () => {
    const newConvo = createNewConversation();
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    setInputMode(InputMode.Text);
  };
  
  const handleDeleteConversation = (idToDelete: string) => {
    const remaining = conversations.filter(c => c.id !== idToDelete);
    
    if (remaining.length === 0) {
        const newConvo = createNewConversation();
        setConversations([newConvo]);
        setActiveConversationId(newConvo.id);
    } else {
        setConversations(remaining);
        if (activeConversationId === idToDelete) {
            setActiveConversationId(remaining[0].id);
        }
    }
  };

  const renderInputComponent = () => {
    switch (inputMode) {
      case InputMode.Image:
        return <ImageInput onSend={handleSend} isLoading={isLoading} language={language} />;
      case InputMode.Voice:
        return <VoiceInput onSend={handleSend} isLoading={isLoading} language={language} />;
      case InputMode.Text:
      default:
        return <TextInput onSend={handleSend} isLoading={isLoading} />;
    }
  };
  
  return (
    <div className="flex h-screen w-screen bg-slate-200 font-sans text-slate-800">
        <ChatHistory 
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
        />
       <div className="flex-1 flex flex-col h-screen bg-white shadow-lg overflow-hidden">
            <Header language={language} setLanguage={setLanguage} />
            <div className="text-center p-2 text-sm bg-yellow-100 text-yellow-800 border-b border-yellow-200">
                <strong>Prototype Notice:</strong> This app uses an online API. Offline mode allows you to view history.
            </div>
            {activeConversation ? (
                <>
                    <ChatWindow messages={activeConversation.messages} isLoading={isLoading} />
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <ModeSelector selectedMode={inputMode} onSelectMode={setInputMode} />
                        <div className="mt-4">
                            {renderInputComponent()}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-50">
                    <p className="text-slate-500 text-lg">Select a conversation or start a new one.</p>
                </div>
            )}
      </div>
    </div>
  );
};

export default App;