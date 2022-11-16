import { useState, createContext, ReactNode, useContext, useMemo } from 'react'

import type { AppContextTypeData, AppContextTypeApi } from './AppContextTypes'

export const AppContextData = createContext({} as AppContextTypeData)
export const AppContextApi = createContext({} as AppContextTypeApi)

export function useAppGlobalStateData(): AppContextTypeData {
  const context = useContext(AppContextData)

  if (!context) {
    throw new Error('useAppGlobalStateData must be used within a AppGlobalStateProvider')
  }

  return context
}
export function useAppGlobalStateApi(): AppContextTypeApi {
  const context = useContext(AppContextApi)

  if (!context) {
    throw new Error('useAppGlobalStateApi must be used within a AppGlobalStateProvider')
  }

  return context
}

export const AppGlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)

  const DataValue = useMemo(
    () => ({
      state: {
        open,
      },
    }),
    [open],
  )

  const ApiValue = useMemo(
    () => ({
      setOpen,
    }),
    [open],
  )

  return (
    <AppContextData.Provider value={DataValue}>
      <AppContextApi.Provider value={ApiValue}>{children}</AppContextApi.Provider>
    </AppContextData.Provider>
  )
}
