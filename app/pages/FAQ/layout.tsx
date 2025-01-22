import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "FAQ - Questions fréquentes sur l'entretien de camping-cars | SplashCamper",
  description:
    "Trouvez toutes les réponses à vos questions sur l'entretien de votre camping-car. Conseils d'experts et produits recommandés pour l'intérieur et l'extérieur.",
  keywords:
    "FAQ camping-car, entretien camping-car, nettoyage camping-car, produits entretien camping-car",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
