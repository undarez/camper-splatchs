const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="border-b border-blue-100 pb-8 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="mt-4 text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-gradient-to-r from-blue-50 to-transparent p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-700 leading-relaxed">
                En accédant et en utilisant l&apos;application CamperWash, vous
                acceptez d&apos;être lié par ces Conditions Générales
                d&apos;Utilisation. Si vous n&apos;acceptez pas ces conditions,
                veuillez ne pas utiliser l&apos;application.
              </p>
            </section>

            <section className="p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                2. Description du service
              </h2>
              <p className="text-gray-700 leading-relaxed">
                CamperWash est une plateforme collaborative permettant aux
                utilisateurs de localiser et de partager des informations sur
                les stations de lavage adaptées aux camping-cars.
              </p>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-transparent p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                3. Inscription et compte utilisateur
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  L&apos;inscription est gratuite
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Les informations fournies doivent être exactes et à jour
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Vous êtes responsable de la confidentialité de vos
                  identifiants
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#2ABED9] rounded-full mr-3"></div>
                  Un compte ne peut être créé que par une personne physique
                  majeure
                </li>
              </ul>
            </section>

            <section className="bg-gradient-to-r from-[#2ABED9]/10 to-[#1B4B82]/10 p-6 rounded-xl mt-12">
              <h2 className="text-2xl font-semibold text-[#1B4B82] mb-4">
                Des questions ?
              </h2>
              <p className="text-gray-700 mb-4">
                Notre équipe est là pour vous aider et répondre à toutes vos
                questions.
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

export default Terms;
