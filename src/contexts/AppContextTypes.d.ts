export interface AppContextTypeData {
  state: {
    open: boolean
  }
}

export interface AppContextTypeApi {
  state?: AppContextTypeData
  setOpen
}
