import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Composant pour l'effet d'écriture animée
const TypingText = ({ text, speed = 12 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

const RASA_API_URL = "http://192.168.0.107:5006/webhooks/rest/webhook";



  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    const welcomeMessage = {
      id: generateId(),
      text: "Bonjour 😀, je suis le chatbot de la FSG !",
      sender: "bot",
      timestamp: new Date(),
      buttons: [],
    };
    setMessages([welcomeMessage]);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: generateId(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(RASA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: "user",
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const botMessages = data.map((msg) => ({
          id: generateId(),
          text: msg.text || "Désolé, je n'ai pas compris.",
          buttons: msg.buttons || [],
          sender: "bot",
          timestamp: new Date(),
        }));
        setMessages((prev) => [...prev, ...botMessages]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            text: "Désolé, je n'ai pas pu traiter votre demande.",
            sender: "bot",
            timestamp: new Date(),
            buttons: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur:", error);

      let errorMessage = "Une erreur est survenue lors de la communication avec le serveur.";

      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Impossible de se connecter au serveur Rasa. Veuillez vérifier qu'il est bien démarré.";
      } else if (error.message.includes("HTTP error")) {
        errorMessage = "Erreur côté serveur Rasa. Veuillez réessayer plus tard.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
          buttons: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      sendMessage(input);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4>CHATBOT FSG</h4>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="avatar">{message.sender === "user" ? "U" : "🤖"}</div>
            <div className="message-content">
              {message.sender === "bot" ? (
                <TypingText text={message.text} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: message.text }} />
              )}

              {message.buttons && message.buttons.length > 0 && (
                <div className="chat-buttons">
                  {message.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="chat-button"
                      onClick={() => sendMessage(button.payload)}
                    >
                      {button.title}
                    </button>
                  ))}
                </div>
              )}
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="avatar">🤖</div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="message-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
