import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/app/pages/Header/page";
import Footer from "@/app/pages/Footer/page";
import { Toaster } from "./components/ui/toaster";
import Script from "next/script";
import { Providers } from "./components/providers";
import { Metadata } from "next";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "SplashCamper - Station de lavage camping-car | Trouvez les stations près de chez vous",
  description:
    "Application de station de lavage camping-car en France. Trouvez facilement où laver son camping-car : stations de lavage camping-car autour de moi, aires de service, points d'eau et parkings adaptés.",
  keywords:
    "station lavage camping-car, laver son camping-car, station de lavage camping-car autour de moi, application station lavage camping-car, aire de service camping-car, point d'eau camping-car, parking camping-car, France, voyage",
  openGraph: {
    title: "SplashCamper - Station de lavage camping-car en France",
    description:
      "Application pour trouver les stations de lavage camping-car autour de vous. Service gratuit pour localiser où laver son camping-car en France.",
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
    title: "SplashCamper - Station de lavage camping-car",
    description:
      "Trouvez facilement où laver votre camping-car avec notre application gratuite de localisation de stations de lavage",
    images: ["https://splashcamper.fr/logo.png"],
  },
  alternates: {
    canonical: "https://splashcamper.fr",
  },
  icons: {
    icon: [
      {
        url: "/images/logo.png",
        href: "/images/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/logo.png",
        href: "/images/logo.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
    shortcut: ["/images/logo.png"],
    apple: [
      {
        url: "/images/logo.png",
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
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/images/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/logo.png"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SplashCamper" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9668851625466214"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <SonnerToaster position="top-right" theme="dark" />
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
