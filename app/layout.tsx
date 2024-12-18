import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/pages/Header/page";
import SessionsWrapper from "@/app/pages/SessionsWrapper/page";
import CookiesConsentModal from "@/app/pages/Juridique/CookiesConsentModal/page";
import Footer from "@/app/pages/Footer/page";
import ClientLayout from "@/app/components/Loader/ClientLayout/page";
import MobileSidebar from "@/app/pages/mobile-sidebar/page";
import Script from "next/script";

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
    <SessionsWrapper>
      <html lang="fr">
        <head>
          <meta property="fb:app_id" content="893594792366674" />
          <meta property="og:url" content="https://splashcamper.vercel.app" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="SplashCamper" />
          <meta
            property="og:description"
            content="Trouvez les meilleures stations de lavage pour camping-car"
          />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9668851625466214"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientLayout>
            <div className="flex min-h-screen">
              {/* Sidebar mobile */}
              <MobileSidebar />

              {/* Contenu principal */}
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
        </body>
      </html>
    </SessionsWrapper>
  );
}
