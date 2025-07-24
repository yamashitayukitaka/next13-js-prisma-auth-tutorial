import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'


const getCurrentUser = async () => {
  try {
    // セッション情報取得
    // セッション情報とは以下
    // ログイン済みかどうかの状態
    // ユーザーIDやメールアドレスなどのユーザー情報
    // アクセストークンなどの認証トークン（必要に応じて）
    // セッションの有効期限
    const session = await getServerSession(authOptions)
    // route.tsで設定したauthOptionsオブジェクトを引数に取る
    // セッション情報はauthOptionsの設定に従って、作成されるデータなのでauthOptionsを引数に取る
    // getServerSession関数はauthOptionsを参照しながらデータを取得する

    // ログインしていない場合(セッション情報が無い場合)
    if (!session?.user?.email) {
      return null
    }

    // ログインユーザーのセッション情報のメールアドレスを取得
    const response = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!response) {
      return null
    }

    return response

  } catch (error) {
    return null
  }
}

export default getCurrentUser
