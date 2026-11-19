'use client'
import axios from 'axios'
import { Send } from 'lucide-react'
import React, { useEffect, useState } from 'react' 

type message={
  bookingId:string, 
  sender: "user" | "driver", 
  text:string
}

function RideChat({ currentRole, bookingId, userName, driverName }: any) {

  const otherName = currentRole == "user" ? driverName : userName
  const myName = currentRole == "user" ? userName : driverName
  const [messages, setMessages] = useState<message[]>([])
  const [lastMessage, setLastMessage] = useState("") 
  const [text, setText] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const sendMessage = async() => { 
    try {
      const {data} = await axios.post("/api/chat/sender", { 
        sender:currentRole, 
        text,
        bookingId
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  } 

  const getAllMsgs = async() => { 
    try {
      const {data} = await axios.get("/api/chat/get-all", { 
        params : { 
          bookingId
        }
      })
      console.log(data)
      setMessages(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAISuggestions = async() => { 
    try {
      const {data} = await axios.post("/api/chat/ai-suggestions", { 
        role:currentRole, 
        lastMessage
      })
      console.log(data)
      setSuggestions(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { 
    getAllMsgs();
  }, [])

  return (
    <div className='flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-100'>

      <div className='shrink-0 flex items-center gap-3 px-4 py-2 bg-white border-b border-zinc-100'>
        <div className='relative shrink-0'>
          <div className='w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white text-xs font-bold'>
            {otherName.charAt(0).toUpperCase()}
          </div>
          <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white' />
        </div>

        <div className='flex-1 min-w-0'>
          <p className='text-sm font-bold text-zinc-900 leading-none'>{otherName}</p>
          <p className='text-[11px] text-emerald-500 font-semibold mt-0.5'>Active Now</p>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50
      ' style={{ scrollbarWidth: "none", msOverflowStyle: "none"}}>

          <style>{`div::-webkit-scrollbar {display: none}`}</style> 

          {messages.length === 0 && ( 
            <div className='flex flex-col items-center justify-center h-full gap-3 py-16'>
              <div className='w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center'>
                <Send size={18} className='text-zinc-400' />
              </div>
              <p className='text-sm text-zinc-400 font-medium'>No messages yet</p>
              <p className='text-xs text-zinc-300'>Start the conversation below</p>
            </div>
          )}
      </div>

    </div>
  )
}

export default RideChat