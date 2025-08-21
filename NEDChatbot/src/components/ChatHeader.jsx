import React from 'react'
import { BotMessageSquare } from 'lucide-react'
export const ChatHeader = () => {
  return (
    <header className="bg-black text-[#f5f0e8] p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-[#e63946] p-2 rounded-full">
          <BotMessageSquare size = {20} className = 'text-[#f5f0e8]' />
        </div>
        <div>
          <h1 className="font-bold text-lg">The NED Assistant</h1>
          <p className="text-xs opacity-70">Always ready to help :)</p>
        </div>
      </div>
    </header>
  )
}
