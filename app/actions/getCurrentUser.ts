import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'



// ✅getCurrentUser は 「今ログインしているユーザーの詳細情報をデータベースから取得する」ための関数
// ログイン状態を管理・判定する目的に使われる
// 注）ログインの認証自体（アカウント情報を入力してDBと照合してログイン成功させる処理）ではない
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

    const response = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })
    // セッションで取得できたuser.emailと同一値がデータベース内にあればそのuserテーブルの情報を取得する

    if (!response) {
      return null
    }

    return response

  } catch (error) {
    return null
  }
}

export default getCurrentUser

// ===============================================================
// セッション情報=>一時的な保管に過ぎない情報（時間が過ぎれば消える）
// DBに保管されたログイン情報=>永続的に保存された情報
// ===============================================================