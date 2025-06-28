
import React, { useContext, useState, ReactNode } from 'react'

interface RestContextType {
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  name: string | undefined;
  setName: (name: string | undefined) => void;
  id: string | undefined;
  setId: (id: string | undefined) => void;
}

export const RestContext = React.createContext<RestContextType | undefined>(undefined)

interface RestProviderProps {
  children: ReactNode;
}

export const RestProvider: React.FC<RestProviderProps> = ({ children }) => {
  const [image, setImage] = useState<string | undefined>()
  const [name, setName] = useState<string | undefined>()
  const [id, setId] = useState<string | undefined>()
  
  return (
    <RestContext.Provider value={{ image, setImage, name, setName, id, setId }}>
      {children}
    </RestContext.Provider>
  )
}

export const useRestaurantContext = () => {
  const context = useContext(RestContext)
  if (context === undefined) {
    throw new Error('useRestaurantContext must be used within a RestProvider')
  }
  return context
}
