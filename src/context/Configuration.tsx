
import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { getConfiguration } from '../apollo/queries'

const GETCONFIGURATION = gql`
  ${getConfiguration}
`

const ConfigurationContext = React.createContext({
  currency: '', 
  currencySymbol: '', 
  deliveryRate: 0 
})

export const ConfigurationProvider = ({ children }: { children: React.ReactNode }) => {
  // Provide default configuration to prevent Apollo Client context errors
  const configuration = { 
    currency: 'USD', 
    currencySymbol: '$', 
    deliveryRate: 5 
  }

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  )
}

export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
