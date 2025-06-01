'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?" }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const updatedMessages = [...messages, { role: 'user', content: input }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages }),
    })

    const data = await res.json()
    setMessages([...updatedMessages, { role: 'assistant', content: data.response }])
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Food Analyzer Chat</h1>
      <div className="space-y-2 mb-4 h-80 overflow-y-auto border p-2 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a food item..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
