"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { User, Role } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction de débogage pour vérifier les variables d'environnement
  const checkEnvVars = async () => {
    try {
      const response = await fetch("/api/admin/debug");
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur de débogage:", response.status, errorText);
        toast.error(
          "Erreur lors de la vérification des variables d'environnement"
        );
        return;
      }

      const data = await response.json();
      console.log("Variables d'environnement:", data);
      toast.success("Variables d'environnement vérifiées (voir console)");
    } catch (error) {
      console.error("Erreur de débogage:", error);
      toast.error(
        "Erreur lors de la vérification des variables d'environnement"
      );
    }
  };

  // Fonction pour corriger le rôle administrateur
  const fixAdminRole = async () => {
    try {
      toast.info("Tentative de correction du rôle administrateur...");
      const response = await fetch("/api/admin/fix-admin");
      const data = await response.json();

      if (data.success) {
        console.log("Correction du rôle administrateur:", data);
        toast.success(data.message);

        // Si une déconnexion est requise, rediriger vers la page de déconnexion
        if (data.action === "logout_required") {
          toast.info(
            "Vous allez être déconnecté pour appliquer les changements..."
          );
          setTimeout(() => {
            window.location.href = "/api/auth/signout";
          }, 2000);
        } else {
          // Sinon, simplement rafraîchir la page
          window.location.reload();
        }
      } else {
        console.error("Erreur de correction:", data);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la correction du rôle:", error);
      toast.error("Erreur lors de la correction du rôle administrateur");
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("AdminUsers: Début de la récupération des utilisateurs");
      const response = await fetch("/api/admin/users");
      console.log("AdminUsers: Statut de la réponse:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "AdminUsers: Erreur de réponse:",
          response.status,
          errorText
        );
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }

      const data = await response.json();
      console.log("AdminUsers: Données reçues:", data.length, "utilisateurs");
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("AdminUsers: Erreur complète:", error);
      toast.error("Impossible de charger les utilisateurs");
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      setEditingUser(null);
      toast.success("Utilisateur mis à jour avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setUsers(users.filter((user) => user.id !== userId));
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Vérification d'autorisation améliorée
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" &&
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-300 mb-4">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </p>
          <div className="text-gray-400 text-sm">
            <p>Email: {session?.user?.email || "Non connecté"}</p>
            <p>Rôle: {session?.user?.role || "Aucun"}</p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={checkEnvVars}
              variant="outline"
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              Vérifier les variables d'environnement
            </Button>
            <Button
              onClick={fixAdminRole}
              variant="outline"
              className="bg-green-900 text-white hover:bg-green-800"
            >
              Corriger le rôle administrateur
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            Gestion des Utilisateurs
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-auto">
              <Input
                type="search"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchUsers}
                variant="outline"
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Rafraîchir
              </Button>
              <Button
                onClick={checkEnvVars}
                variant="outline"
                className="bg-blue-900 text-white hover:bg-blue-800"
              >
                Déboguer
              </Button>
              <Button
                onClick={fixAdminRole}
                variant="outline"
                className="bg-green-900 text-white hover:bg-green-800"
              >
                Corriger le rôle administrateur
              </Button>
              <div className="text-gray-300 text-sm sm:text-base ml-4">
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300 px-2 sm:px-4">
                    Nom
                  </TableHead>
                  <TableHead className="text-gray-300 px-2 sm:px-4">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-300 px-2 sm:px-4">
                    Rôle
                  </TableHead>
                  <TableHead className="text-gray-300 px-2 sm:px-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-700/50">
                    <TableCell className="text-white px-2 sm:px-4">
                      {editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.name || ""}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white border-gray-600 text-sm sm:text-base"
                        />
                      ) : (
                        <span className="text-sm sm:text-base">
                          {user.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-white px-2 sm:px-4">
                      {editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.email || ""}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white border-gray-600 text-sm sm:text-base"
                        />
                      ) : (
                        <span className="text-sm sm:text-base">
                          {user.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-white px-2 sm:px-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              role: e.target.value as Role,
                            })
                          }
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-1 sm:p-2 text-sm sm:text-base"
                        >
                          <option value="USER">Utilisateur</option>
                          <option value="ADMIN">Administrateur</option>
                        </select>
                      ) : (
                        <span className="text-sm sm:text-base">
                          {user.role}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-2 sm:px-4">
                      <div className="flex gap-2">
                        {editingUser?.id === user.id ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => handleSave(editingUser)}
                              className="bg-green-600 hover:bg-green-700 text-sm sm:text-base py-1 h-8 sm:h-10"
                            >
                              Sauvegarder
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              className="border-gray-600 text-white hover:bg-gray-700 text-sm sm:text-base py-1 h-8 sm:h-10"
                            >
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEdit(user)}
                              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-1 h-8 sm:h-10"
                            >
                              Modifier
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 sm:h-10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 text-white border border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Supprimer l'utilisateur
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet
                                    utilisateur ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
