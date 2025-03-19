"use client";

import React, { useState, useEffect } from "react";
import ChatInterface from "./App.jsx";
import "./toggle.css";

const ChatBotToggle = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Close the chat with the Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isChatOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button" // Explicitly set the button type
        className="chatbot-toggle-button"
        onClick={handleToggleChat}
        aria-label={isChatOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isChatOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Container with Animation */}
      <div
        className={`chatbot-container ${
          isChatOpen ? "chatbot-container--open" : "chatbot-container--closed"
        }`}
      >
        {/* Render ChatInterface only when chat is open */}
        {isChatOpen && <ChatInterface />}
      </div>
    </>
  );
};

export default ChatBotToggle;