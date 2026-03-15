import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function AIChat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your PG assistant. Ask me anything about Marvar Boys PG & Tiffin Center - location, amenities, rules, pricing, or anything else!',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipText, setTooltipText] = useState('')
  const messagesEndRef = useRef(null)

  // Function to clean markdown formatting from text
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
      .replace(/#{1,6}\s/g, '')       // Remove headers
      .replace(/`(.*?)`/g, '$1')      // Remove code blocks
      .trim()
  }

  // Tooltip messages that rotate
  const tooltipMessages = [
    "💬 Ask me anything!",
    "🏠 Need PG info?",
    "📍 Want location?",
    "💰 Check pricing?",
    "📋 Know the rules?",
    "🍽️ Food timings?",
    "📞 Need help?"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Tooltip animation effect
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        const randomMessage = tooltipMessages[Math.floor(Math.random() * tooltipMessages.length)]
        setTooltipText(randomMessage)
        setShowTooltip(true)
        
        setTimeout(() => {
          setShowTooltip(false)
        }, 3000) // Show for 3 seconds
      }, 6000) // Every 6 seconds

      return () => clearInterval(interval)
    }
  }, [isOpen])

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
        text: cleanMarkdown(res.data.answer),
        timestamp: new Date(),
        hasLocation: res.data.answer.toLowerCase().includes('location') || 
                     res.data.answer.toLowerCase().includes('address') ||
                     res.data.answer.toLowerCase().includes('map'),
        hasContact: res.data.answer.toLowerCase().includes('contact') || 
                    res.data.answer.toLowerCase().includes('phone') ||
                    res.data.answer.toLowerCase().includes('call') ||
                    res.data.answer.toLowerCase().includes('81078 42564')
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

  const makeCall = () => {
    window.open('tel:+918107842564', '_self')
  }

  const sendWhatsApp = () => {
    window.open('https://wa.me/918107842564?text=Hi, I want to know about PG accommodation', '_blank')
  }

  return (
    <>
      {/* Floating Chat Button with Tooltip */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Animated Tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 animate-bounce">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
              {tooltipText}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
        
        {/* Pulsing Ring Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse opacity-30"></div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window with Slide Animation */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:bottom-24 sm:right-6 sm:left-auto sm:inset-x-auto w-auto sm:w-full sm:max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col h-[calc(100vh-5rem)] sm:h-[600px] sm:max-h-[80vh] animate-slide-up">
          {/* Header with Gradient Animation */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white p-3 sm:p-4 rounded-t-2xl flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg truncate">Ishwar</h3>
              <p className="text-xs text-white/80 truncate">Ask me anything!</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden p-1 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages with Fade-in Animation */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 min-h-0">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] sm:max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white transform hover:scale-105' 
                    : 'bg-white text-gray-800 border border-gray-200 transform hover:scale-105'
                } rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm transition-all duration-200`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.hasLocation && (
                      <button
                        onClick={openMap}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 touch-manipulation animate-bounce"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        📍 View on Map
                      </button>
                    )}
                    
                    {msg.hasContact && (
                      <>
                        <button
                          onClick={makeCall}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 touch-manipulation animate-bounce"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          📞 Call Now
                        </button>
                        
                        <button
                          onClick={sendWhatsApp}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 touch-manipulation animate-bounce"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
                          </svg>
                          💬 WhatsApp
                        </button>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs mt-1 sm:mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-fade-in">
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

          {/* Input with Glow Effect */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 rounded-b-2xl shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:shadow-lg transition-all duration-200 outline-none text-sm touch-manipulation"
                disabled={loading}
                autoComplete="off"
                autoCapitalize="sentences"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Gemini AI ✨
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat