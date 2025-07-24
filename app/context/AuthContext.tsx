'use client'

import { SessionProvider } from 'next-auth/react'

type AuthContextProps = {
  children: React.ReactNode
}

// 認証コンテキスト

const AuthContext = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>
}


// 1. AuthContext の親コンポーネントが 
// <AuthContext>これはチルドレンです</AuthContext>
// のように使用しており、"これはチルドレンです" を AuthContext に渡している。

// 2. AuthContext コンポーネントは受け取った children（= "これはチルドレンです"）を、
// <SessionProvider>{children}</SessionProvider> としてさらに SessionProvider に渡している。

// 3. SessionProvider コンポーネント内では、
// const SessionProvider = ({ children }) => {
//   return <div>{children}</div>
// }
// のように children を展開して描画している。

// ※このように children はバケツリレーのように、
// 親 → AuthContext → SessionProvider の3段階で渡されている。


export default AuthContext