import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-bold mb-4">Page non trouvée</h2>
      <p className="text-gray-600 mb-6">
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <Link
        href="/"
        className="text-white bg-primary hover:bg-primary/90 px-6 py-2 rounded-md transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
