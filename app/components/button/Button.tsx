'use client'

import { IconType } from 'react-icons'

type ButtonProps = {
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  outline?: boolean
  del?: boolean
  icon?: IconType
  // これらの?はプロパティは渡してもいいし、渡さなくてもいいという意味
  // Optional chaining（オプショナルチェイニング） の ?とは全く意味が違う
  // disabled?: booleanと定義した場合はpropsとしてdisabledを渡さなくてもエラーにならないが
  // disabled: booleanとした場合はpropsとしてdisabledを渡さないとエラーになる
}

// ボタン
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, outline, del, icon: Icon }) => {

  return (
    <button
      disabled={disabled}

      onClick={onClick}
      className={`relative w-full rounded-full border py-2 font-semibold hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70 
      ${outline
          ? 'border-neutral-400 bg-white text-black'
          : del
            ? 'border-red-500 bg-red-500 text-white'
            : 'border-sky-500 bg-sky-500 text-white'
        }
      `}
    //これは 三項演算子（条件演算子）の応用的な使い方 の一つです。
    //ネスト（三項演算子の中にさらに三項演算子を入れる）を使っている
    // outlineがtrueなら'border-neutral-400 bg-white text-black'を返す
    // outlineがfalseならdel以降のもうひとつの三項演算子を参照して
    // delがtrueなら'border-red-500 bg-red-500 text-white'を返す
    // delがfalseなら'border-sky-500 bg-sky-500 text-white'を返す
    >
      {Icon && <Icon size={24} className="absolute left-4" />}
      {label}
    </button>
  )
}

export default Button