export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* En-tête */}
          <div className="border-b border-blue-100 pb-8 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
              À propos de CamperWash
            </h1>
            <p className="mt-4 text-gray-600">
              La solution pour tous les propriétaires de camping-cars
            </p>
          </div>

          {/* Notre Mission */}
          <section className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              Notre Mission
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                CamperWash est née d&apos;un constat simple : la difficulté pour
                les camping-caristes de trouver des stations de lavage adaptées
                à leurs véhicules. Notre mission est de simplifier la vie des
                voyageurs en leur permettant de :
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Localiser facilement les stations adaptées
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Partager leurs expériences avec la communauté
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Contribuer à l&apos;enrichissement de la base de données
                </li>
              </ul>
            </div>
          </section>

          {/* La Solution */}
          <section className="p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              La Solution
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-medium text-[#2ABED9] mb-3">
                  Cartographie Interactive
                </h3>
                <p className="text-gray-700">
                  Une carte détaillée avec toutes les stations de lavage
                  adaptées, leurs équipements et leurs spécificités.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-medium text-[#2ABED9] mb-3">
                  Communauté Active
                </h3>
                <p className="text-gray-700">
                  Des avis et retours d&apos;expérience partagés par les
                  utilisateurs pour des informations toujours à jour.
                </p>
              </div>
            </div>
          </section>

          {/* Pour Qui ? */}
          <section className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              À qui s&apos;adresse CamperWash ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Propriétaires de camping-cars
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Voyageurs en van aménagé
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Loueurs de véhicules de loisirs
                </li>
              </ul>
            </div>
          </section>

          {/* Évolution Continue */}
          <section className="bg-gradient-to-r from-[#2ABED9]/10 to-[#1B4B82]/10 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              Une Évolution Continue
            </h2>
            <p className="text-gray-700 mb-6">
              CamperWash est en constante évolution pour mieux répondre à vos
              besoins. Nos prochaines évolutions incluent :
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-medium text-[#2ABED9] mb-2">
                  Réservation en ligne
                </h3>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-medium text-[#2ABED9] mb-2">
                  Application mobile
                </h3>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-medium text-[#2ABED9] mb-2">
                  Système de fidélité
                </h3>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-medium text-[#2ABED9] mb-2">Newsletter</h3>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
