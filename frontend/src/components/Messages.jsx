import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Send, AlertCircle } from 'lucide-react'

const demoConversations = [
  { id: 1, name: 'Sarah K.',  initials: 'SK', color: 'bg-purple-400', message: 'That photo is amazing! 🔥',      time: '2m',       unread: 2 },
  { id: 2, name: 'James W.',  initials: 'JW', color: 'bg-blue-400',   message: 'When are you posting next?',    time: '14m',      unread: 0 },
  { id: 3, name: 'Priya M.',  initials: 'PM', color: 'bg-pink-400',   message: 'Followed you back 👋',          time: '1h',       unread: 1 },
  { id: 4, name: 'Alex R.',   initials: 'AR', color: 'bg-green-400',  message: "Let's collab on something!",    time: '3h',       unread: 0 },
  { id: 5, name: 'Mia T.',    initials: 'MT', color: 'bg-amber-400',  message: 'Sent you a post',               time: 'Yesterday',unread: 0 },
]

const demoChatMessages = [
  { from: 'them', text: 'Hey! Love your content 🙌' },
  { from: 'me',   text: 'Thanks, means a lot!' },
  { from: 'them', text: null }, // replaced by the conversation preview message
]

const ChatPopup = ({ convo, onClose }) => {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const messages = [
    { from: 'them', text: 'Hey! Love your content 🙌' },
    { from: 'me',   text: 'Thanks, means a lot!' },
    { from: 'them', text: convo.message },
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="fixed bottom-0 right-[310px] w-[280px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 rounded-t-2xl bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full ${convo.color} flex items-center justify-center`}>
            <span className="text-white text-[10px] font-bold">{convo.initials}</span>
          </div>
          <span className="font-semibold text-sm text-gray-900">{convo.name}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 px-4 py-3 h-52 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
              msg.from === 'me'
                ? 'bg-[#ff7d1a] text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Coming soon banner */}
      <div className="mx-3 mb-2 flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 shrink-0">
        <AlertCircle size={12} className="text-amber-500 shrink-0" />
        <p className="text-[10px] text-amber-600 font-medium">Messaging is coming soon — stay tuned!</p>
      </div>

      {/* Input */}
      <div className="px-3 pb-3 shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs outline-none placeholder:text-gray-400 text-gray-700"
        />
        <button
          disabled
          className="w-8 h-8 rounded-full bg-[#ff7d1a]/20 flex items-center justify-center shrink-0 cursor-not-allowed"
        >
          <Send size={13} className="text-[#ff7d1a]" />
        </button>
      </div>
    </div>
  )
}

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null)

  return (
    <>
      {/* Sidebar panel */}
      <aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-gray-100 bg-white h-full">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 shrink-0">
          <h2 className="font-bold text-base text-gray-900">Messages</h2>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search messages..."
              className="bg-transparent text-xs outline-none text-gray-600 placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2">
          {demoConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setActiveChat(activeChat?.id === convo.id ? null : convo)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                activeChat?.id === convo.id ? 'bg-[#ff7d1a]/8' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-full ${convo.color} flex items-center justify-center shrink-0`}>
                <span className="text-white text-xs font-bold">{convo.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold truncate ${convo.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {convo.name}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-1">{convo.time}</span>
                </div>
                <p className={`text-xs truncate mt-0.5 ${convo.unread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                  {convo.message}
                </p>
              </div>
              {convo.unread > 0 && (
                <div className="w-4 h-4 rounded-full bg-[#ff7d1a] flex items-center justify-center shrink-0">
                  <span className="text-[9px] text-white font-bold">{convo.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 shrink-0">
          <p className="text-[11px] text-gray-400 text-center">Messaging coming soon</p>
        </div>
      </aside>

      {/* Chat popup */}
      {activeChat && <ChatPopup convo={activeChat} onClose={() => setActiveChat(null)} />}
    </>
  )
}

export default Messages
