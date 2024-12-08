import { AuthForm } from "@/app/pages/auth/page";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion | CampingCar Wash",
  description: "Connectez-vous à votre compte CampingCar Wash",
};

export default function SignInPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <Image
          src="/images/A_realistic_camping_cars_station.png"
          alt="Station de lavage camping-car"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-8 mr-2"
              width={500}
              height={500}
              priority
            />
          </Link>
          CampingCar Wash
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Trouvez facilement les stations de lavage pour votre camping-car
            </p>
            <p className="text-base">
              Pour découvrir nos services et localiser les stations près de chez
              vous, connectez-vous à votre espace personnel.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Connexion à votre compte
            </h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous avec Google, Facebook ou Instagram
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
