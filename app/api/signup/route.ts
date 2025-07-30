import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'

// サインアップ
export async function POST(request: Request) {
  try {
    // リクエストボディの取得
    const body = await request.json()
    const { email, name, password } = body

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)
    // bcrypt は オブジェクト型
    // 以下代表的なメソッド
    // bcrypt.hash()        // パスワードをハッシュ化
    // bcrypt.compare()     // 平文パスワードとハッシュを比較
    // bcrypt.genSalt()     // ソルトを生成
    // ハッシュ化とは入力したパスワードを不規則かつ解読不可な値（ハッシュ値）に変換して
    // 入力した本人が覚えてない限り再現不可能にすること
    // データベースにもハッシュ値で保存されるので、データベース内を見てもパスワードは分からない

    // ユーザーの作成
    const response = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return new NextResponse('Error', { status: 500 })
  }
}