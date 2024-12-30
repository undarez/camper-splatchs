export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="bg-[#1E2337] rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Administration
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Stations en attente */}
          <div className="bg-[#252B43] rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Stations en attente
            </h2>
            <div className="space-y-4">
              {/* Liste des stations */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-2">Nom</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {/* ... lignes du tableau ... */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-[#252B43] rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Statistiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1E2337] rounded-lg p-4">
                <p className="text-gray-400">Total stations</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="bg-[#1E2337] rounded-lg p-4">
                <p className="text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-[#252B43] rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Actions rapides
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors">
                Ajouter une station
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 px-4 transition-colors">
                Gérer les utilisateurs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
