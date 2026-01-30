import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Typlax - Type to Transform',
    description: 'An immersive, indie-game-inspired typing experience that transforms typing practice into a meditative, playful journey.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="bg-primary-bg text-primary-text min-h-screen">
                {children}
            </body>
        </html>
    )
}
