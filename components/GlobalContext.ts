import React from "react";

export type AuthorizationObj = {
  token   : string | undefined,
  fullname: string | undefined,
  hisId   : number | undefined,
  id      : number | undefined,
}

export type TokenContent = {
  authorized: AuthorizationObj
  setToken:(c: any) => void
}

export const TokenContext = React.createContext<TokenContent>({
  authorized: {
    token   : undefined,
    fullname: undefined,
    hisId   : undefined,
    id      : undefined,
  },
  setToken: () => {}
});