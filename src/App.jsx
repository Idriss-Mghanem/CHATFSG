"use client"
import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import "./app.css"

// Moved outside component to prevent recreation on each render
const generateId = () => Math.random().toString(36).substr(2, 9)

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // URL de l'API Rasa avec options de configuration
  const RASA_API_URL = "http://localhost:5006/webhooks/rest/webhook"

  // Scroll to bottom using useCallback to memoize the function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Effect for scrolling - now depends on messages length
  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  // Welcome message - now runs only once
  useEffect(() => {
    const welcomeMessage = {
      id: generateId(),
      text: "bonjour,je suis chatbot fsg ",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, []) // Empty dependency array means this runs once on mount

  // Format time function
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Send message function with improved error handling
  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = {
      id: generateId(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

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
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle bot response
      if (data && data.length > 0) {
        const botMessages = data.map((msg) => ({
          id: generateId(),
          text: msg.text|| "Désolé, je n'ai pas compris.",
          sender: "bot",
          timestamp: new Date(),
        }))

        setMessages((prev) => [...prev, ...botMessages])
      } else {
        const botMessage = {
          id: generateId(),
          text: "Désolé, je n'ai pas pu traiter votre demande.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("Erreur:", error)

      // More specific error messages based on the error type
      let errorMessage = "Désolé, une erreur est survenue lors de la communication avec le serveur."

      if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Impossible de se connecter au serveur Rasa. Veuillez vérifier que le serveur est en cours d'exécution."
      } else if (error.message.includes("HTTP error")) {
        errorMessage = "Le serveur Rasa a rencontré une erreur. Veuillez réessayer plus tard."
      }

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLoading && input.trim()) {
      sendMessage(input)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        
        <h4>CHATBOT FSG</h4>
        
        
        
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            
            <div className="avatar">{message.sender === "user" ? "U" : ""}</div>
            <div className="message-content">
              
              <div dangerouslySetInnerHTML={{ __html: message.text }} />
              
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="avatar">a</div>
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
            send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface

