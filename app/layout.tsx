import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/pages/Header/page";
import SessionsWrapper from "@/app/pages/SessionsWrapper/page";
import CookiesConsentModal from "@/app/pages/Juridique/CookiesConsentModal/page";
import Footer from "@/app/pages/Footer/page";
import ClientLayout from "@/app/components/Loader/ClientLayout/page";
import MobileSidebar from "@/app/pages/mobile-sidebar/page";

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
  title: "CamperWash",
  description: "Trouvez les meilleures stations de lavage pour camping-car",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionsWrapper>
      <html lang="fr">
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
                <main className="flex-1">{children}</main>
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
