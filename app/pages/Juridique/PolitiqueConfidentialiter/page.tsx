const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* En-tête */}
          <div className="border-b border-blue-100 pb-8 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
            <p className="mt-4 text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-gradient-to-r from-[#2ABED9]/5 to-transparent rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              Chez CamperWash, nous accordons une grande importance à la
              protection de vos données personnelles. Cette politique détaille
              comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </div>

          {/* Sections principales */}
          <div className="space-y-8">
            {/* Collecte des données */}
            <section className="bg-gradient-to-r from-blue-50 to-transparent p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                1. Collecte des données
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3 mt-2"></div>
                  <span>
                    <strong className="text-[#1B4B82]">
                      Informations de compte :
                    </strong>{" "}
                    email, nom d&apos;utilisateur
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3 mt-2"></div>
                  <span>
                    <strong className="text-[#1B4B82]">
                      Données de profil :
                    </strong>{" "}
                    type de véhicule, département
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3 mt-2"></div>
                  <span>
                    <strong className="text-[#1B4B82]">
                      Données de localisation :
                    </strong>{" "}
                    uniquement avec votre consentement
                  </span>
                </li>
              </ul>
            </section>

            {/* Utilisation des données */}
            <section className="p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                2. Utilisation des données
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-[#2ABED9] mb-2">
                    Services essentiels
                  </h3>
                  <p className="text-gray-700">
                    Fournir et améliorer nos services de localisation de
                    stations
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-[#2ABED9] mb-2">
                    Personnalisation
                  </h3>
                  <p className="text-gray-700">
                    Adapter votre expérience selon vos préférences
                  </p>
                </div>
              </div>
            </section>

            {/* Protection des données */}
            <section className="bg-gradient-to-r from-blue-50 to-transparent p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                3. Protection des données
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Conformément au RGPD, nous mettons en œuvre des mesures de
                sécurité strictes pour protéger vos données personnelles contre
                tout accès non autorisé, modification ou destruction.
              </p>
            </section>

            {/* Vos droits */}
            <section className="p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                4. Vos droits
              </h2>
              <div className="grid gap-4">
                {[
                  "Accès",
                  "Rectification",
                  "Suppression",
                  "Opposition",
                  "Portabilité",
                ].map((droit) => (
                  <div
                    key={droit}
                    className="flex items-center space-x-3 text-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-[#2ABED9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Droit de {droit.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-[#2ABED9]/10 to-[#1B4B82]/10 p-6 rounded-xl mt-12">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                Contactez-nous
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant vos données personnelles ou pour
                exercer vos droits :
              </p>
              <a
                href="/pages/Contact"
                className="inline-block bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Nous contacter
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
