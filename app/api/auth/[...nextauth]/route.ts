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

  adapter: PrismaAdapter(prisma),
  // NextAuthでPrismaを使うための設定

  // =================================================
  // 認証プロバイダーの設定
  // providerとは「どの方法でログインさせるか？」を指定する設定
  // 🔹 NextAuthにおける provider とは？
  // 認証プロバイダーの例（NextAuth公式）
  // プロバイダー名	説明
  // GoogleProvider()	Googleアカウントでログインできるようにする
  // GithubProvider()	GitHubアカウントでログイン
  // CredentialsProvider()	自分で用意したメール・パスワードなどでログイン
  // FacebookProvider()	Facebookでログイン
  // TwitterProvider()	Twitterでログイン（X）
  providers: [
    // Google認証
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // envファイルからGOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETを取得して引数に指定
    }),

    // メールアドレス認証
    CredentialsProvider({
      name: 'credentials',
      //認証方法の名前。ログイン画面で表示されることもある（任意の名前にできる）

      credentials: {
        // ログインフォームで必要な入力項目
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      // async authorize(credentials) 
      // authorize 関数は、**CredentialsProvider の中で自分でカスタマイズして定義する非同期関数
      authorize: async (credentials) => {
        // メールアドレスとパスワードがない場合はエラー
        if (!credentials?.email || !credentials?.password) {
          // ==========================================================================
          // ✴️ credentials?.email は
          // 「credentialsオブジェクトの中にemailがあれば、その値を返す」という意味
          //
          // ✴️ ! は論理否定演算子で、値が falsy（undefined, null, '', 0, false など）の場合に true を返す
          // つまり !credentials?.email は
          // ・emailが存在し、値がtruthy（文字列など）なら false
          // ・emailが存在しないか、空文字などfalsyなら true
          //
          // ✴️ これにより「email または password が無い、もしくは空文字の場合はエラーを出す」ことをチェックしている
          // ==========================================================================
          throw new Error('メールアドレスとパスワードが存在しません')
        }


        // ======================================================================
        // ユーザーを取得
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            // ✅ credentials.email
            // ユーザーがログイン画面で入力したメールアドレス
            // 登録済ユーザーの情報として Prisma（データベース）に保存されている値ではない
          },
        })
        // credentials.email に一致する user レコードの すべてのプロパティとその値 を取得する

        // ✅User モデルがこう定義されているとすると：
        //   model User {
        //   id             String     @id @default(uuid())
        //   name           String?
        //   email          String?    @unique
        //   emailVerified  DateTime?
        //   image          String?
        //   hashedPassword String?
        //   createdAt      DateTime   @default(now())
        //   updatedAt      DateTime   @updatedAt
        //   accounts       Account[]
        // }

        // ✅この場合、user の中には以下のようなデータが取得される（例）
        // {
        //   id: '8a7f...',
        //   name: '山田太郎',
        //   email: 'yamada@example.com',
        //   emailVerified: null,
        //   image: 'https://example.com/profile.png',
        //   hashedPassword: '$2b$10$...',
        //   createdAt: 2025-07-31T09:00:00.000Z,
        //   updatedAt: 2025-07-31T10:00:00.000Z,
        //   accounts: [] // ※ この accounts は空配列か、リレーションを明示的にincludeしないと入らない
        // }
        // ======================================================================

        // ユーザーが存在しない場合はエラー
        if (!user || !user?.hashedPassword) {
          throw new Error('ユーザーが存在しません')
        }

        // パスワードが一致しない場合はエラー
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
        // bcrypt.compare() は、ユーザーがログインフォームに入力した「平文のパスワード」と、
        // データベースなどに保存されている「ハッシュ化されたパスワード」を比較して、一致するかどうかを確認する非同期
        // 真偽値（true または false）を返す

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
// RESTAPIのGETとPOSTを使用可能にする