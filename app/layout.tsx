import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://persona-ai.example.com";
const TITLE = "Persona AI — Chat with Hitesh Choudhary & Piyush Garg";
const DESCRIPTION =
  "An AI simulation of two well-known dev educators. Pick a persona, ask a real question, switch mid-conversation for the other angle.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Persona AI",
  keywords: ["Persona AI", "Hitesh Choudhary", "Piyush Garg", "AI chat", "coding mentor AI"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Persona AI",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#12130F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          // Runs before hydration so a returning visitor's saved theme applies
          // immediately, with no flash of the wrong theme on load.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-ink text-paper font-sans antialiased">{children}</body>
    </html>
  );
}
