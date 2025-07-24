// このファイルは内部的にNextAuthがfetchしてサーバーが読み込む為のファイル
//  /api/auth/[...nextauth]/route.ts は NextAuth（認証ライブラリ）専用のAPIルート
// 👉 NextAuthが内部的に fetch などでリクエストを送るために使う、サーバーが読み込むエンドポイント（APIルート）です。
// 🔍 補足解説
// このファイルは何のため？
// NextAuthの認証処理（ログイン、ログアウト、セッション取得など）を動かすためのサーバー側の設定を記述する為のファイル。
// App Router 環境（app/ ディレクトリ）で NextAuth を使うには、この route.ts が必要です。

import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'


// NextAuth設定
// 🔹 authOptions は関数ではなく、NextAuthの設定をまとめたオブジェクトです。
// 🔹 NextAuthOptions は、NextAuthライブラリが提供する TypeScript の型定義です。
export const authOptions: NextAuthOptions = {
  // Prismaを使うための設定
  adapter: PrismaAdapter(prisma),
  // 認証プロバイダーの設定
  providers: [
    // Google認証
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // メールアドレス認証
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // メールアドレスとパスワード
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      // async authorize(credentials) 
      // authorize 関数は、**CredentialsProvider の中で自分でカスタマイズして定義する非同期関数
      authorize: async (credentials) => {
        // メールアドレスとパスワードがない場合はエラー
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードが存在しません')
        }

        // ユーザーを取得
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // ユーザーが存在しない場合はエラー
        if (!user || !user?.hashedPassword) {
          throw new Error('ユーザーが存在しません')
        }

        // パスワードが一致しない場合はエラー
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!isCorrectPassword) {
          throw new Error('パスワードが一致しません')
        }

        return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }