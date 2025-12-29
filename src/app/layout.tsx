import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PWAInstaller } from './components/PWAInstaller'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Skaner Jelita - Low FODMAP',
	description: 'Skanuj produkty i wykrywaj składniki FODMAP za pomocą AI. Aplikacja dla osób z IBS i SIBO.',
	manifest: '/manifest.json',
	themeColor: '#047857',
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
		userScalable: false,
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Skaner Jelita',
	},
	icons: {
		icon: '/favicon.ico',
		apple: '/icon-192.png',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pl">
			<head>
				<meta name="application-name" content="Skaner Jelita" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Skaner Jelita" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<PWAInstaller />
			</body>
		</html>
	)
}
