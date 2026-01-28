import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'BookScavenger',
  description: 'Discover books near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1120] text-gray-200 min-h-screen">
        {/* Navbar */}
        <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#D4AF37]">
            BookScavenger
          </Link>

          <div className="space-x-6 text-sm">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <Link href="/search" className="hover:text-[#D4AF37]">Search</Link>
            <Link href="/library/login" className="hover:text-[#D4AF37]">Library</Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}
