import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "LuxBiss - Make Money Online",
  description: "Production-grade, reusable, scalable application for business investment.",
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = googleClientId && googleClientId !== "undefined" && googleClientId !== "null";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${inter.variable} antialiased font-sans`}
      >
        {isGoogleConfigured ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
              <Toaster position="top-right" toastOptions={{ className: 'text-sm font-semibold' }} />
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        ) : (
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{ className: 'text-sm font-semibold' }} />
            {children}
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
