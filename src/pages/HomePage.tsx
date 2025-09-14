import React, { useState, useRef, useEffect } from "react";

// Mock AI responses for different finance topics
const mockAIResponses = {
    budget: [
        "I'd be happy to help you with budget analysis! To get started, could you tell me your monthly income and main expense categories? I can help you create a 50/30/20 budget plan.",
        "Budget analysis is crucial for financial health. Let's break down your spending into needs, wants, and savings. What's your current monthly take-home income?",
    ],
    investment: [
        "Great question about investments! For beginners, I usually recommend starting with index funds or ETFs. What's your risk tolerance and investment timeline?",
        "Investment strategy depends on your goals. Are you looking for short-term gains or long-term wealth building? I can suggest diversified portfolio options.",
    ],
    expense: [
        "Expense tracking is the foundation of financial wellness! I recommend the envelope method or using apps to categorize spending. What expenses are you most concerned about?",
        "Let's identify your biggest expense categories. Typically, housing, food, and transportation take up 60-70% of most budgets. Where do you think you're overspending?",
    ],
    savings: [
        "Savings goals are essential! I recommend starting with an emergency fund of 3-6 months expenses. What's your current savings rate and target goal?",
        "Smart thinking about savings! The key is automation - set up automatic transfers. What specific goal are you saving for? Emergency fund, vacation, or home down payment?",
    ],
    default: [
        "I'm here to help with all your financial questions! I can assist with budgeting, investments, expense tracking, debt management, and savings strategies. What would you like to focus on?",
        "Welcome to Pocket Profit! I'm your AI finance assistant. I can help you create budgets, analyze expenses, plan investments, and achieve your financial goals. How can I assist you today?",
        "Hello! I'm equipped to help with personal finance topics like creating emergency funds, retirement planning, debt reduction, and investment strategies. What's your main financial priority right now?",
    ]
};

const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('budget')) {
        return mockAIResponses.budget[Math.floor(Math.random() * mockAIResponses.budget.length)];
    } else if (lowerMessage.includes('invest')) {
        return mockAIResponses.investment[Math.floor(Math.random() * mockAIResponses.investment.length)];
    } else if (lowerMessage.includes('expense') || lowerMessage.includes('track')) {
        return mockAIResponses.expense[Math.floor(Math.random() * mockAIResponses.expense.length)];
    } else if (lowerMessage.includes('saving') || lowerMessage.includes('save')) {
        return mockAIResponses.savings[Math.floor(Math.random() * mockAIResponses.savings.length)];
    }

    return mockAIResponses.default[Math.floor(Math.random() * mockAIResponses.default.length)];
};

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const HomePage: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Create ref for the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    };

    // Effect to handle auto-scroll when messages change
    useEffect(() => {
        if (showChat && messages.length > 0) {
            // Small delay to ensure the DOM has updated
            setTimeout(scrollToBottom, 100);
        }
    }, [messages, showChat, isLoading]);

    // Mock API call simulation
    const mockAPICall = async (message: string): Promise<string> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        return getAIResponse(message);
    };

    // Function to handle sending the message
    const handleSend = async () => {
        if (inputValue.trim()) {
            const userMessage: Message = {
                id: Date.now().toString(),
                text: inputValue.trim(),
                isUser: true,
                timestamp: new Date()
            };

            // Add user message and show chat
            setMessages(prev => [...prev, userMessage]);
            setShowChat(true);
            setIsLoading(true);

            const currentInput = inputValue.trim();
            setInputValue("");

            try {
                // Simulate API call
                const aiResponse = await mockAPICall(currentInput);

                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: aiResponse,
                    isUser: false,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiMessage]);
            } catch (error) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Sorry, I'm having trouble connecting right now. Please try again!",
                    isUser: false,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setShowChat(false);
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            {/* Chat Messages Overlay */}
            {showChat && (
                <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 ${
                    isFullscreen
                        ? 'bg-white dark:bg-gray-900 p-0'
                        : 'bg-white/10 dark:bg-black/20 backdrop-blur-sm p-4'
                }`}>
                    <div className={`bg-white dark:bg-gray-800 shadow-2xl flex flex-col transition-all duration-300 ${
                        isFullscreen
                            ? 'w-full h-full rounded-none'
                            : 'w-full max-w-6xl h-[80vh] rounded-2xl'
                    }`}>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Pocket Profit AI</h3>
                                    <p className="text-sm text-gray-500">Your Finance Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* Fullscreen Toggle Button */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isFullscreen ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    )}
                                </button>
                                {/* Close Button */}
                                <button
                                    onClick={clearChat}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    title="Close Chat"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={messagesContainerRef}
                            className={`flex-1 overflow-y-auto pr-4 pl-4 pt-4 space-y-4 ${
                                isFullscreen ? 'pb-4' : 'pb-20'
                            }`}
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${
                                            message.isUser
                                                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* This div acts as an anchor point for auto-scroll */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area for Fullscreen Mode */}
                        {isFullscreen && (
                            <div className="border-t dark:border-gray-700 p-4">
                                <div className="relative">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        rows={1}
                                        disabled={isLoading}
                                        className={`py-3 px-4 pr-16 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-base
                                            placeholder-gray-400 dark:placeholder-gray-500 
                                            dark:text-gray-200 text-gray-700
                                            outline-none transition-all duration-300 resize-none overflow-hidden
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                        placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
                                        style={{
                                            minHeight: '48px',
                                            maxHeight: '120px',
                                            lineHeight: '1.5'
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            const scrollHeight = target.scrollHeight;
                                            const maxHeight = 120;
                                            target.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                                        }}
                                    />

                                    <button
                                        onClick={handleSend}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 transform
                                            ${inputValue.trim() && !isLoading
                                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white scale-100 shadow-lg hover:scale-110'
                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 scale-75'
                                        } ${isLoading ? 'animate-pulse' : ''}`}
                                        disabled={!inputValue.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Center text */}
            <div className={`text-center z-10 transition-all duration-500 ${showChat ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="mb-4">
                    <p className="text-4xl md:text-5xl text-gray-700 dark:text-gray-200 transition-all duration-500">
                        Meet <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 animate-pulse">Pocket Profit</span>
                    </p>
                    <p className="text-4xl md:text-5xl text-gray-700 dark:text-gray-200 mt-2 transition-all duration-500">
                        your personal Finance AI assistant
                    </p>
                </div>

                {/* Floating AI icon */}
                <div className="mt-8 mb-16">
                    <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg animate-bounce">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Input at bottom center - Only show when not in fullscreen mode */}
            {!isFullscreen && (
                <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl z-30">
                    <div className="relative">
                        {/* Glow effect background */}
                        <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-blue-400/20 to-green-400/20 blur-md scale-105'
                                : 'bg-gray-200/10 blur-sm'
                        }`}></div>

                        {/* Main input container */}
                        <div className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl transition-all duration-300 transform ${
                            isActive ? 'scale-105 shadow-blue-200/50' : 'hover:scale-102'
                        }`}>
                            {/* Input field - textarea for multiline with max 3 lines */}
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => setIsActive(true)}
                                onBlur={() => setIsActive(false)}
                                onKeyPress={handleKeyPress}
                                rows={1}
                                disabled={isLoading}
                                className={`py-4 sm:py-5 px-6 pr-16 block w-full bg-transparent border-2 rounded-3xl text-lg sm:text-xl
                                    placeholder-gray-400 dark:placeholder-gray-500 
                                    dark:text-gray-200 text-gray-700
                                    outline-none transition-all duration-300 resize-none overflow-hidden
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${isActive
                                    ? "border-transparent shadow-none"
                                    : "border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500"
                                }`}
                                placeholder={isLoading ? "AI is thinking..." : isActive ? "Ask me anything about your finances..." : "How can I help you today?"}
                                style={{
                                    minHeight: '60px',
                                    maxHeight: '120px',
                                    lineHeight: '1.5'
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    const scrollHeight = target.scrollHeight;
                                    const maxHeight = 120;
                                    target.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                                }}
                            />

                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 transform
                                    ${inputValue.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white scale-100 shadow-lg hover:scale-110 hover:shadow-xl'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 scale-75'
                                } ${isLoading ? 'animate-pulse' : ''}`}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Bottom suggestion chips */}
                        <div className={`flex flex-wrap justify-center gap-2 mt-4 transition-all duration-500 ${
                            isActive && !showChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {['Budget analysis', 'Investment tips', 'Expense tracking', 'Savings goals'].map((chip, index) => (
                                <button
                                    key={chip}
                                    className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                    style={{animationDelay: `${index * 0.1}s`}}
                                    onClick={() => setInputValue(chip)}
                                    disabled={isLoading}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating help indicator */}
            <div className={`absolute bottom-4 right-4 transition-all duration-300 ${isActive || showChat ? 'opacity-0' : 'opacity-70'}`}>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI Assistant ready</span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
