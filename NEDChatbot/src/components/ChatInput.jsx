import React from 'react'
import { SendIcon } from 'lucide-react'
export const ChatInput = ({ value, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-[#e8e1d9] border-t border-[#d3c8b4]"
    >
      <div className="flex items-center bg-white rounded-full shadow-md pl-4 pr-2 py-1">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type your message..."
          className="flex-1 outline-none bg-transparent text-black"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-[#e63946] text-white rounded-full hover:bg-[#c1272d] transition-colors"
        >
          <SendIcon size={18} />
        </button>
      </div>
    </form>
  )
}
