"use client";

import {
  Shield,
  Database,
  Settings,
  Lock,
  UserCog,
  RefreshCw,
  Mail,
  User,
  Activity,
  Server,
  Key,
  FileText,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function RegleConfidentialite() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1f37] rounded-lg p-8 shadow-lg border border-gray-700/50">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Règles de Confidentialité
          </h1>
          <p className="text-gray-400 text-sm mb-8 text-center">
            Dernière mise à jour : 20/01/2025
          </p>

          <div className="text-gray-300 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <p>
                Chez SplashCamper, la protection de vos données personnelles est
                une priorité. Cette politique explique en détail comment nous
                collectons, utilisons, stockons et protégeons vos informations
                personnelles, conformément aux réglementations applicables, y
                compris le RGPD.
              </p>
            </div>
          </div>

          {/* Section 1: Collecte des données */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-500" />
              1. Collecte des données
            </h2>
            <p className="text-gray-300 mb-4">
              Nous collectons uniquement les données nécessaires à
              l'amélioration de votre expérience utilisateur et au bon
              fonctionnement de l'application.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-teal-500" />
                  Informations de compte
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Adresse e-mail</li>
                  <li>• Nom d'utilisateur</li>
                  <li>• Mode de connexion (Google)</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-teal-500" />
                  Données d'utilisation
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Interactions avec l'application</li>
                  <li>• Emplacements recherchés</li>
                  <li>• Stations consultées</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Utilisation des données */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-blue-500" />
              2. Utilisation des données
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Server className="w-5 h-5 mr-2 text-teal-500" />
                  Services essentiels
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Fonctionnalités principales de l'application</li>
                  <li>• Vérification des informations soumises</li>
                  <li>• Validation des contenus</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Protection des données */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-500" />
              3. Protection des données
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-teal-500" />
                  Chiffrement
                </h3>
                <p className="text-gray-300 text-sm">
                  Données sensibles chiffrées
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-teal-500" />
                  Sauvegardes
                </h3>
                <p className="text-gray-300 text-sm">
                  Sauvegardes régulières et sécurisées
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-teal-500" />
                  Contrôle
                </h3>
                <p className="text-gray-300 text-sm">
                  Accès strictement contrôlés
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Vos droits */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <UserCog className="w-6 h-6 mr-2 text-blue-500" />
              4. Vos droits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-teal-500" />
                  Droit d'accès
                </h3>
                <p className="text-gray-300 text-sm">
                  Demander une copie de vos données
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-teal-500" />
                  Droit de rectification
                </h3>
                <p className="text-gray-300 text-sm">
                  Corriger vos informations
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2 text-teal-500" />
                  Droit de suppression
                </h3>
                <p className="text-gray-300 text-sm">Demander la suppression</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <div className="bg-blue-600/20 p-6 rounded-lg mt-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-400" />
              Nous contacter
            </h2>
            <p className="text-gray-300 mb-4">
              Pour exercer vos droits ou pour toute question concernant vos
              données personnelles :
            </p>
            <Link href="/pages/Contact">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
