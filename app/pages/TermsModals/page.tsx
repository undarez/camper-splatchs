"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TermsModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");
    if (!accepted) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conditions d&apos;utilisation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h2>Conditions d&apos;utilisation</h2>
          <h3>1. Introduction</h3>
          Bienvenue sur Splach Camper . En utilisant notre site, vous acceptez
          de respecter les présentes conditions d&apos;utilisation.
          <h3>2. Acceptation des Conditions</h3>
          L&apos;utilisation de notre site implique l&apos;acceptation de ces
          conditions. Si vous n&apos;acceptez pas ces conditions, veuillez ne
          pas utiliser notre site.
          <h3>3. Modifications des Conditions</h3>
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les utilisateurs seront informés des modifications, et
          l&apos;utilisation continue du site après modification constitue une
          acceptation des nouvelles conditions.
          <h3>4. Utilisation du Site</h3>
          Les utilisateurs s&apos;engagent à utiliser le site de manière
          responsable et à ne pas diffuser de contenu illégal ou inapproprié.
          <h3>5. Propriété Intellectuelle</h3>
          Tout le contenu de ce site est protégé par des droits d&apos;auteur.
          Aucune reproduction sans autorisation n&apos;est autorisée.
          <h3>6. Responsabilité</h3>
          Nous ne pouvons être tenus responsables des dommages résultant de
          l&apos;utilisation de notre site.
          <h3>7. Données Personnelles</h3>
          Nous collectons et utilisons vos données personnelles conformément à
          notre politique de confidentialité. Vous avez le droit d&apos;accéder,
          rectifier ou de supprimer vos données.
          <h3>8. Liens Externes</h3>
          Notre site peut contenir des liens vers d&apos;autres sites. Nous ne
          sommes pas responsables du contenu de ces sites.
          <h3>9. Droit Applicable</h3>
          Ces conditions sont régies par le droit français. En cas de litige, le
          tribunal compétent sera celui de [Votre Ville].
          <h3>10. Contact</h3>
          Pour toute question concernant ces conditions, veuillez nous contacter
          à l&apos;adresse suivante : flobillard02200@gmail.com.
        </div>
        <DialogFooter>
          <Button onClick={handleAccept}>Accepter</Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Refuser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
