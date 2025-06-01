'use client'
import { useState, useRef, useEffect } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hello! I'm your Food Analyzer assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const updatedMessages = [...messages, { role: 'user', content: input }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()
      setMessages([...updatedMessages, { role: 'assistant', content: data.response }])
    } catch (e) {
      setMessages([...updatedMessages, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) sendMessage()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-3xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" className="w-10 h-10 rounded-full shadow" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Food Analyzer Chat</h1>
        </div>
        <div className="mb-6 h-96 overflow-y-auto px-2 py-4 bg-gradient-to-b from-white via-blue-50 to-green-50 rounded-2xl border border-blue-100 shadow-inner">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-xs px-4 py-3 rounded-2xl shadow
                  ${msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none border border-blue-100'}
                `}
              >
                <span className="block text-xs font-semibold mb-1 opacity-60">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </span>
                <span className="whitespace-pre-line">{msg.content}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            className="flex-grow border-2 border-blue-200 focus:border-blue-400 outline-none rounded-xl px-4 py-3 text-lg transition-all shadow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="🍎 Ask about a food item and nutrition..."
            disabled={loading}
          />
          <button
            className={`transition-all px-6 py-3 rounded-xl font-bold text-lg shadow
              ${loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white'}
            `}
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Powered by <span className="font-semibold text-blue-600">Agentic AI</span>
      </footer>
    </div>
  )
}
