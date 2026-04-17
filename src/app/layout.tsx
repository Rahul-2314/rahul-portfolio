import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Rahul Chowdhury | Full-Stack MERN Developer",
	description:
		"BTech CSE (AIML) undergrad at UEM Jaipur. Full-Stack MERN Developer building production-grade applications and AI systems. Open to internships.",
	metadataBase: new URL("https://rahulchowdhury.in"),
	openGraph: {
		title: "Rahul Chowdhury | Full-Stack Developer",
		description:
			"BTech CSE Undergrad building production-grade MERN applications.",
		type: "website",
		url: "https://rahulchowdhury.in",
		siteName: "Rahul Chowdhury",
		locale: "en_IN",
	},
	twitter: {
		card: "summary",
		title: "Rahul Chowdhury | Full-Stack Developer",
		description: "BTech CSE Undergrad building production-grade MERN applications.",
		site: "@rahul_x14",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#060a11" />

				{/* Google Fonts — Playfair Display (formal serif) + Syne + JetBrains Mono + Inter */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
