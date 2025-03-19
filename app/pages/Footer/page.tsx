"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1a1f37] to-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* À propos */}
          <div className="bg-[#1E2337]/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm h-full">
            <h3 className="text-blue-400 font-semibold text-base sm:text-lg mb-3">
              À propos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/About"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/Juridique/regles-de-confidentialite"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Règles de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/Juridique/ConditionUtilisation"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/Juridique/mentions-legales"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-[#1E2337]/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm h-full">
            <h3 className="text-blue-400 font-semibold text-base sm:text-lg mb-3">
              Contact
            </h3>
            <button className="w-full bg-[#1E2337] hover:bg-blue-500 text-white px-4 py-2 rounded-lg border border-blue-400/30 hover:border-transparent transition-all flex items-center justify-center gap-2 text-sm">
              <Link href="/pages/Contact">Nous contacter</Link>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-[#1E2337]/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm h-full">
            <h3 className="text-blue-400 font-semibold text-base sm:text-lg mb-3">
              Réseaux sociaux
            </h3>
            <div className="flex space-x-3">
              <Link
                href="https://www.facebook.com/profile.php?id=61570891016497"
                className="bg-[#1E2337] p-2 rounded-lg hover:bg-blue-500 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-[#1E2337] p-2 rounded-lg hover:bg-blue-500 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-[#1E2337] p-2 rounded-lg hover:bg-blue-500 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-[#1E2337]/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm h-full">
            <h3 className="text-blue-400 font-semibold text-base sm:text-lg mb-3">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Restez informé de nos dernières actualités
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Votre email..."
                className="w-full bg-[#1E2337] border border-blue-400/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-white"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-400/20 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 SplashCamper. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
