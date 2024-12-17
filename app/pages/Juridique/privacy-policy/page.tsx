"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Politique de Confidentialité de CamperWash
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Collecte des Informations
              </h2>
              <p>
                Nous collectons les informations suivantes lorsque vous utilisez
                notre application :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Informations de profil (nom, email)</li>
                <li>Données de connexion via réseaux sociaux</li>
                <li>Localisation des stations ajoutées</li>
                <li>Informations sur les services des stations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Utilisation des Données
              </h2>
              <p>Nous utilisons vos données pour :</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Gérer votre compte et profil</li>
                <li>Améliorer nos services</li>
                <li>Vous permettre d'ajouter et gérer des stations</li>
                <li>Communiquer avec vous concernant nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. Protection des Données
              </h2>
              <p>
                Nous prenons la sécurité de vos données très au sérieux. Nous
                utilisons des mesures de sécurité appropriées pour protéger vos
                informations contre tout accès non autorisé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Vos Droits
              </h2>
              <p>Vous avez le droit de :</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données</li>
                <li>Supprimer votre compte</li>
                <li>Vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Contact
              </h2>
              <p>
                Pour toute question concernant cette politique de
                confidentialité, contactez-nous à : fortuna77320@gmail.com
              </p>
            </section>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
