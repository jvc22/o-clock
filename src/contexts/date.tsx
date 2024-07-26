'use client'

import React, { createContext, useContext, useState } from 'react'

interface DateContextType {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDate = (): DateContextType => {
  const context = useContext(DateContext)

  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider')
  }

  return context
}
