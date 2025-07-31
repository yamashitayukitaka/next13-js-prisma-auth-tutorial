'use client'

import React, { useCallback, useState } from 'react'
import { signOut } from 'next-auth/react'
import { User } from '@prisma/client'

import useLoginModal from '@/app/hooks/useLoginModal'
import useSignupModal from '@/app/hooks/useSignupModal'
import useProfileModal from '@/app/hooks/useProfileModal'
import MenuItem from '@/app/components/navigation/MenuItem'
import Image from 'next/image'

type MenuProps = {
  currentUser: User | null
}

const Menu: React.FC<MenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false)
  const loginModal = useLoginModal()
  const signupModal = useSignupModal()
  const profileModal = useProfileModal()

  const toggleOpen = useCallback(() => {
    setIsOpen((values) => !values)
  }, [])
  return (
    <div className='relative'>
      <div className="relative h-10 w-10 cursor-pointer" onClick={toggleOpen}>
        <Image
          src={currentUser?.image || '/default.png'}
          // 論理和で最初のtruthyな値返す
          className="rounded-full object-cover"
          alt="avatar"
          fill
          sizes="(max-width: 768px) 32px, (max-width: 1200px) 40px, 40px"
        // sizeを指定しないとエラーがでる
        />
      </div>

      {isOpen && (
        // toggleOpen関数でisOpenがtrue falseに切り替えられ、trueの場合は
        // &&以降が返る
        <div className="absolute right-0 z-10 w-40 overflow-hidden rounded-lg bg-white text-sm shadow-lg shadow-gray-100">
          <div className="cursor-pointer">
            {currentUser ? (

              <>
                <MenuItem
                  label="プロフィール"
                  onClick={() => {
                    profileModal.onOpen()
                    setIsOpen(false)
                    // 状態変数isOpenがfalseに切り替わるので
                    // isOpen && (以降のJSXが消える
                  }}
                />
                <MenuItem
                  label="ログアウト"
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                />
              </>
            ) : (
              <>
                <MenuItem
                  label="ログイン"
                  onClick={() => {
                    loginModal.onOpen()
                    setIsOpen(false)
                  }}
                />
                <MenuItem
                  label="サインアップ"
                  onClick={() => {
                    signupModal.onOpen()
                    setIsOpen(false)
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu
