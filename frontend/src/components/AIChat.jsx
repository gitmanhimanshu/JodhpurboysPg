import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function AIChat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your PG assistant. Ask me anything about Jodhpur Boys PG & Tiffin Center - location, amenities, rules, pricing, or anything else!',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat/`, {
        question: input
      })

      const botMessage = {
        type: 'bot',
        text: res.data.answer,
        timestamp: new Date(),
        hasLocation: res.data.answer.toLowerCase().includes('location') || 
                     res.data.answer.toLowerCase().includes('address') ||
                     res.data.answer.toLowerCase().includes('map')
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const openMap = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=26.84636,75.7694464', '_blank')
  }

  return (
    <>
      {/* Floating Chat Button - Mobile Optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 hover:scale-110 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window - Fully Mobile Responsive */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:bottom-24 sm:right-6 sm:left-auto sm:inset-x-auto w-auto sm:w-full sm:max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col h-[calc(100vh-5rem)] sm:h-[600px] sm:max-h-[80vh]">
          {/* Header - Mobile Optimized */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 sm:p-4 rounded-t-2xl flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg truncate">PG Assistant</h3>
              <p className="text-xs text-white/80 truncate">Ask me anything!</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden p-1 hover:bg-white/20 rounded-full transition"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages - Mobile Optimized Scrolling */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 min-h-0">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200'
                } rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.hasLocation && (
                    <button
                      onClick={openMap}
                      className="mt-2 sm:mt-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition w-full justify-center touch-manipulation"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Map
                    </button>
                  )}
                  <p className="text-xs mt-1 sm:mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                  <div className="flex gap-1 sm:gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Mobile Optimized */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 rounded-b-2xl shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-sm touch-manipulation"
                disabled={loading}
                autoComplete="off"
                autoCapitalize="sentences"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat
