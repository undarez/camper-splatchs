"use client";

import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

export default function ConditionUtilisation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1f37] rounded-lg p-8 shadow-lg border border-gray-700/50">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-400 text-sm mb-8 text-center">
            Dernière mise à jour : 20/01/2025
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-500" />
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-300">
              En accédant et en utilisant l'application SplashCamper, vous
              acceptez sans réserve les présentes Conditions Générales
              d'Utilisation (CGU). Si vous n'acceptez pas ces conditions,
              veuillez cesser immédiatement d'utiliser l'application.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-500" />
              2. Description du service
            </h2>
            <p className="text-gray-300 mb-4">
              SplashCamper est une plateforme collaborative destinée aux
              camping-caristes. Elle permet :
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                De localiser et de partager des informations sur des stations de
                lavage adaptées aux camping-cars et des parkings.
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                De consulter les services proposés sur chaque emplacement.
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                D'utiliser des fonctionnalités telles qu'une carte interactive,
                un calendrier d'entretien personnel et des outils de navigation
                GPS.
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                De soumettre de nouvelles stations ou parkings (vérifiés par
                notre équipe).
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-500" />
              3. Inscription et compte utilisateur
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">
                  Bonnes pratiques
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    Inscription avec une adresse e-mail valide ou compte Google
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    Informations exactes et mises à jour
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    Être majeur
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">
                  À éviter
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    Informations frauduleuses
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    Utilisation abusive du compte
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    Partage des identifiants
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-500" />
              4. Utilisation responsable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">
                  Ce qu'il faut faire
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    Publier des informations vérifiées
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                    Respecter les autres utilisateurs
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3">
                  Ce qu'il ne faut pas faire
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    Publier des informations fausses
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 mr-2 text-red-500 mt-1 flex-shrink-0" />
                    Harceler ou spammer
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sections 5-7 */}
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-yellow-500" />
                5. Limitation de responsabilité
              </h2>
              <p className="text-gray-300">
                Bien que SplashCamper s'efforce de fournir des informations
                fiables et à jour, nous ne pouvons garantir que les informations
                publiées seront toujours exactes ou exemptes d'erreurs.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-blue-500" />
                6. Résiliation
              </h2>
              <p className="text-gray-300">
                Vous pouvez résilier votre compte à tout moment en contactant
                notre support. SplashCamper se réserve également le droit de
                suspendre ou de supprimer un compte en cas de non-respect des
                CGU.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-blue-500" />
                7. Modifications des CGU
              </h2>
              <p className="text-gray-300">
                Les présentes CGU peuvent être modifiées à tout moment. Vous
                serez informé des modifications importantes, et votre
                utilisation continue de l'application vaudra acceptation des CGU
                mises à jour.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
