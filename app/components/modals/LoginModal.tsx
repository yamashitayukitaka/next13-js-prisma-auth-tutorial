'use client'

import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import useSignupModal from '@/app/hooks/useSignupModal'
import useLoginModal from '@/app/hooks/useLoginModal'
import Modal from '@/app/components/modals/Modal'
import Input from '@/app/components/input/Input'
import Button from '@/app/components/button/Button'
import * as z from 'zod'

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

// ログインモーダル
const LoginModal = () => {
  const router = useRouter()
  const loginModal = useLoginModal()
  const signupModal = useSignupModal()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    // 初期値
    defaultValues: { email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // サインアップモーダルを開く
  const onToggle = useCallback(() => {
    loginModal.onClose()
    signupModal.onOpen()
  }, [loginModal, signupModal])

  // 送信
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true)

    try {
      // ログイン
      const res = await signIn('credentials', {
        // credentialsはGoogleやGitHubなどの外部OAuthを使用するのではなく
        // 自分で用意したフォームのユーザー名・パスワードなどを使うログインを行うためのプロバイダー名
        ...data,
        redirect: false,
      })

      // エラーチェック
      if (res?.error) {
        toast.error('エラーが発生しました。' + res.error)
        return
      }

      toast.success('ログインしました!')
      loginModal.onClose()
      router.refresh()
    } catch (error) {
      toast.error('エラーが発生しました。' + error)
    } finally {
      setLoading(false)
    }
  }

  // モーダルの中身
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        label="メールアドレス"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="パスワード"
        type="password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  // フッターの中身
  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      {/* Googleログイン */}
      <Button outline label="Googleでログイン" icon={FcGoogle} onClick={() => signIn('google')} />
      {/* signIn 関数は、NextAuth.js によって提供される関数で、ログイン処理を開始するために使用します。
        この関数に「プロバイダー名」を文字列で渡すことで、対応する認証フローが実行されます。 */}

      {/* サインアップリンク */}
      <div className="mt-4 text-center">
        <div onClick={onToggle} className="cursor-pointer text-sm text-neutral-500 hover:underline">
          アカウントを作成する
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={loading}
      isOpen={loginModal.isOpen}
      title="ログイン"
      primaryLabel="ログイン"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal