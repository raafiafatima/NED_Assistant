import React from 'react'
export const ChatMessage = ({ message }) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? 'bg-[#e64a57] text-white rounded-tr-none' : 'bg-[#e8e1d9] text-black rounded-tl-none'}`}
      >
        <p>{message.question}</p>
      </div>
    </div>
  )
}
