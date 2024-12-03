import { Suspense } from 'react'
import './globals.css'
import { Montserrat } from 'next/font/google'


const montserrat = Montserrat({
  weight: ["300",'400','700'],
  subsets: ['latin'],
})


export const metadata = {
  title: 'Songify',
  description: 'Songify helps you discover new music',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`} >
      <Suspense>
        {children}
      </Suspense>
      </body>
    </html>
  )
}
