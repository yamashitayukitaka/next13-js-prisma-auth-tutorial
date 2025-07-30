'use client'
// ======================================================
import { User } from "@prisma/client"
// npx prisma generateを実行することによって
// 上記のようにimportすれば、prisma shemaで定義したmodelのprismaの型定義
// がTypeScriptの型定義に自動で変換され利用可能になる



// model User {
//   id             String    @id @default(uuid())
//   name           String?
//   email          String?   @unique
//   emailVerified  DateTime?
//   image          String?
//   hashedPassword String?
//   createdAt      DateTime  @default(now())
//   updatedAt      DateTime  @updatedAt
//   accounts       Account[]
// }

// ✅上記modelが下記TypeScriptに変換される

// export type User = {
//   id: string
//   name: string | null
//   email: string | null
//   emailVerified: Date | null
//   image: string | null
//   hashedPassword: string | null
//   createdAt: Date
//   updatedAt: Date
// }

// ✅生成された型は node_modules/@prisma/client/index.d.ts にある。
// ======================================================
import Link from "next/link"
import Menu from "@/app/components/navigation/Menu"


type NavigationProps = {
  currentUser: User | null
}


const Navigation: React.FC<NavigationProps> = ({ currentUser }) => {
  return (
    <header className="shadow-lg shadow-gray-100">
      <div className="container mx-auto flex max-w-screen-sm items-center justify-between px-1 py-5">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          FullStackChannel
        </Link>

        <div className="flex items-center justify-center space-x-2">
          <Menu currentUser={currentUser} />
        </div>
      </div>
    </header>
  )
}

export default Navigation
