import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthContext from './context/AuthContext'
import getCurrentUser from './actions/getCurrentUser'
import './globals.css'
import Navigation from './components/navigation/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prisma Auth',
  description: 'Prisma Auth',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={inter.className}>


        <div className="flex min-h-screen flex-col">
          <Navigation />

          <main className="container mx-auto max-w-screen-sm flex-1 px-1 py-5">{children}</main>

          <footer className="py-5">
            <div className="text-center text-sm">
              Copyright © All rights reserved | FullStackChannel
            </div>
          </footer>
        </div>

      </body>
    </html>
  )
}
