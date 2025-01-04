import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/app/pages/Header/page";
import Footer from "@/app/pages/Footer/page";
import { Toaster } from "./components/ui/toaster";
import Script from "next/script";
import { Providers } from "./components/providers";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "SplashCamper - Trouvez les meilleures stations de lavage pour camping-cars",
  description:
    "SplashCamper est votre guide pour trouver les stations de lavage et parkings adaptés aux camping-cars en France. Localisez facilement les points d'eau, aires de vidange et services pour votre véhicule.",
  keywords:
    "camping-car, station lavage, parking camping-car, aire de service, vidange camping-car, point d'eau camping-car, France, voyage",
  openGraph: {
    title: "SplashCamper - Stations de lavage pour camping-cars",
    description:
      "Trouvez facilement les stations de lavage et parkings adaptés aux camping-cars en France",
    url: "https://www.splashcamper.fr",
    siteName: "SplashCamper",
    images: [
      {
        url: "https://www.splashcamper.fr/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SplashCamper - Stations de lavage pour camping-cars",
    description:
      "Trouvez facilement les stations de lavage et parkings adaptés aux camping-cars en France",
    images: ["https://splashcamper.fr/logo.png"],
  },
  alternates: {
    canonical: "https://splashcamper.fr",
  },
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
    shortcut: ["/logo.png"],
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#1B4B82",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SplashCamper" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful');
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
