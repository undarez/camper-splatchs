const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* En-tête */}
          <div className="border-b border-blue-100 pb-8 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
              Mentions Légales
            </h1>
          </div>

          {/* Propriété Intellectuelle */}
          <section className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              Propriété intellectuelle
            </h2>
            <p className="prose prose-lg text-gray-700">
              Cette application est la propriété exclusive de [Votre nom]. Tous
              les droits de reproduction sont réservés, y compris pour les
              documents téléchargeables et les représentations iconographiques.
            </p>
          </section>

          {/* Protection des Données */}
          <section className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-[#1B4B82] mb-6">
              Protection des données
            </h2>
            <p className="prose prose-lg text-gray-700">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès,
              de rectification et de suppression de vos données personnelles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
