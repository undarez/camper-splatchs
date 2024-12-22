import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/pages/Header/page";
import CookiesConsentModal from "@/app/pages/Juridique/CookiesConsentModal/page";
import Footer from "@/app/pages/Footer/page";
import ClientLayout from "@/app/components/Loader/ClientLayout/page";
import MobileSidebar from "@/app/pages/mobile-sidebar/page";
import SessionWrapper from "@/app/components/SessionWrapper";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "@/app/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SplashCamper",
  description: "Trouvez les meilleures stations de lavage pour camping-car",
  other: {
    "google-adsense-account": "ca-pub-9668851625466214",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta property="fb:app_id" content="893594792366674" />
        <meta property="og:url" content="https://splashcamper.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SplashCamper" />
        <meta
          property="og:description"
          content="Trouvez les meilleures stations de lavage pour camping-car"
        />
        <meta name="author" content="Florian Billard" />
        <meta name="owner" content="Florian Billard" />
        <meta name="copyright" content="© 2024 SplashCamper" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://splashcamper.vercel.app" />
        <meta
          name="google-site-verification"
          content="6eWBLMLxDalDyK7lsjGEkYXqzdw3ULqbrmbees92ves"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9668851625466214"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="splash-camper-theme"
        >
          <SessionWrapper>
            <ClientLayout>
              <div className="flex min-h-screen">
                <MobileSidebar />
                <div className="flex-1 flex flex-col">
                  <div className="hidden md:block">
                    <Header />
                  </div>
                  <CookiesConsentModal />
                  <main className="flex-1">
                    <div className="max-w-7xl mx-auto w-full px-4">
                      {children}
                    </div>
                  </main>
                  <div className="hidden md:block">
                    <Footer />
                  </div>
                </div>
              </div>
            </ClientLayout>
          </SessionWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
