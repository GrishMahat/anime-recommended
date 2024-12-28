/** @format */

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { ChatMessage } from "../types/chat";
import {
  generateChatResponse,
  getAnimeRecommendations,
} from "../services/ai/geminiService";
import { AnimeCard } from "./AnimeCard";
import { searchAnime } from "../services/animeAPI";
import { AnimeResult } from "../types/anime";
import { Sparkles, MessageCircle, Bot, Send, ChevronDown, Loader2 } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [animeResults, setAnimeResults] = useState<
    (AnimeResult & { reason: string })[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      Math.abs(
        e.currentTarget.scrollHeight -
          e.currentTarget.scrollTop -
          e.currentTarget.clientHeight
      ) < 1;
    setIsAtBottom(bottom);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsAtBottom(true);

    try {
      if (
        input.toLowerCase().includes("recommend") ||
        input.toLowerCase().includes("anime")
      ) {
        const recommendations = await getAnimeRecommendations(input);
        const detailedResults = await Promise.all(
          recommendations.map(async (rec) => {
            try {
              const animeDetails = await searchAnime(rec.title);
              return { ...animeDetails, reason: rec.reason };
            } catch (error) {
              console.error(`Failed to fetch details for ${rec.title}:`, error);
              return null;
            }
          })
        );
        const validResults = detailedResults.filter(
          (result): result is AnimeResult & { reason: string } =>
            result !== null
        );
        setAnimeResults(validResults);
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: "Here are some great anime recommendations based on your preferences:",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const response = await generateChatResponse([...messages, userMessage]);
        const aiMessage: ChatMessage = { role: "assistant", content: response };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or rephrase your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatMessage = (content: string) => {
    content = content.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="text-purple-400 font-semibold">$1</span>'
    );
    content = content.replace(
      /\* (.*?)(?=(\n|$))/g,
      '<div class="flex gap-2 items-start"><span class="text-purple-400">•</span><span>$1</span></div>'
    );
    return content
      .split("\n")
      .filter(Boolean)
      .map((p) => `<div class="mb-2">${p}</div>`)
      .join("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Your Anime Guide
          </h1>
        </div>
      </header>
      <div className="flex-1 overflow-hidden relative">
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className="space-y-4 max-w-md">
              <Bot className="w-12 h-12 mx-auto text-purple-400" />
              <h2 className="text-xl font-semibold text-purple-400">Welcome to Your Anime Guide!</h2>
              <p className="text-gray-400">
                Ask me anything about anime or get personalized recommendations based on your preferences.
              </p>
            </div>
          </div>
        )}
        <div
          className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
          onScroll={handleScroll}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}>
              <div
                className={`max-w-[80%] rounded-xl p-4 backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-500/20"
                    : "bg-gray-800/90 text-gray-100 shadow-lg"
                } transform transition-all duration-200 hover:scale-[1.02]`}>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700/50">
                  <div
                    className={`p-1.5 rounded-full ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}>
                    {message.role === "user" ? (
                      <MessageCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {message.role === "user" ? "You" : "AI Guide"}
                  </div>
                </div>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                />
              </div>
            </div>
          ))}

          {animeResults.length > 0 && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[95%] w-full bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="text-sm font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2 pb-3 border-b border-gray-700/50">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Here's what I found for you</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {animeResults.map((result) => (
                    <AnimeCard
                      key={result.id}
                      anime={result}
                      reason={result.reason}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 max-w-[80%] shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2 shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      )}
      <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 p-4 sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about any anime or get personalized recommendations..."
              className="flex-1 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-600/50 placeholder-gray-400 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
