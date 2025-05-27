import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Review, Station, Prisma } from "@prisma/client";

// Type pour les services avec les propriétés spécifiques à Delisle
interface ServiceWithDelisleProps {
  id: string;
  createdAt: Date;
  stationId: string;
  highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
  electricity: "NONE" | "AMP_8" | "AMP_15";
  maxVehicleLength: number | null;
  portiquePrice: number | null;
  manualWashPrice: number | null;
}

// Type pour les pistes de lavage
interface WashLane {
  id: string;
  stationId: string;
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour les pistes de lavage du fichier JSON
interface JsonWashLane {
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
  id?: string;
}

// Type pour les stations avec leurs relations
type StationWithWashLanes = Prisma.StationGetPayload<{
  include: {
    services: true;
    parkingDetails: true;
    washLanes: true;
    author: { select: { id: true; name: true; email: true; image: true } };
    reviews: {
      include: {
        author: { select: { id: true; name: true; image: true } };
      };
    };
  };
}> & {
  services: ServiceWithDelisleProps | null;
  washLanes: WashLane[];
};

interface StationWithRelations extends Station {
  isDelisle: boolean;
  services: {
    id: string;
    highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
    electricity: "NONE" | "AMP_8" | "AMP_15";
    maxVehicleLength: number | null;
    createdAt: Date;
    portiquePrice: number | null;
    manualWashPrice: number | null;
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: "NONE" | "AMP_8" | "AMP_15";
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    createdAt: Date;
  } | null;
  washLanes: WashLane[];
  reviews: (Review & {
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  })[];
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fonction requise pour l'export statique avec des routes dynamiques
export async function generateStaticParams() {
  // Retourner une liste vide car les API routes ne peuvent pas être pré-générées
  return [];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Recherche de la station avec l'ID:", params.id);

    // Vérifier si l'ID correspond à une station du fichier JSON
    if (params.id.startsWith("station_")) {
      console.log("Détecté une station du fichier JSON");
      // Pour les stations du fichier JSON, nous devons nous assurer que isDelisle est correctement défini
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/stationData/${params.id}`
      );
      if (response.ok) {
        const stationData = await response.json();
        console.log("Données de la station JSON:", stationData);
        console.log("isDelisle original:", stationData.isDelisle);
        console.log("Nom de la station:", stationData.name);
        console.log("washLanes original:", stationData.washLanes);

        // Forcer isDelisle à true pour les stations Delisle
        const isDelisleStation =
          stationData.isDelisle === true ||
          (stationData.name && stationData.name.includes("Delisle"));

        console.log("isDelisle forcé:", isDelisleStation);

        // Transformer les données pour le format attendu par le front-end
        const formattedStation = {
          ...stationData,
          isDelisle: isDelisleStation, // Forcer à true pour les stations Delisle
          phone_number: stationData.phoneNumber,
          postal_code: stationData.postalCode,
          services: stationData.services
            ? {
                ...stationData.services,
                high_pressure: stationData.services.highPressure,
                tire_pressure: stationData.services.tirePressure,
                water_point: stationData.services.waterPoint,
                waste_water: stationData.services.wasteWater,
                waste_water_disposal: stationData.services.wasteWaterDisposal,
                black_water_disposal: stationData.services.blackWaterDisposal,
                handicap_access: stationData.services.handicapAccess,
                // Assurer que les prix sont correctement définis dans les deux formats
                portique_price:
                  stationData.services.portiquePrice !== undefined
                    ? Number(stationData.services.portiquePrice)
                    : null,
                manual_wash_price:
                  stationData.services.manualWashPrice !== undefined
                    ? Number(stationData.services.manualWashPrice)
                    : null,
                portiquePrice:
                  stationData.services.portiquePrice !== undefined
                    ? Number(stationData.services.portiquePrice)
                    : null,
                manualWashPrice:
                  stationData.services.manualWashPrice !== undefined
                    ? Number(stationData.services.manualWashPrice)
                    : null,
                // Ajouter les méthodes de paiement si elles existent
                paymentMethods: stationData.services.paymentMethods || [],
              }
            : null,
          wash_lanes:
            stationData.washLanes && Array.isArray(stationData.washLanes)
              ? stationData.washLanes.map((lane: JsonWashLane) => ({
                  id: lane.id || `lane_${lane.laneNumber}`,
                  stationId: params.id,
                  lane_number: lane.laneNumber,
                  has_high_pressure: lane.hasHighPressure,
                  has_buses_portique: lane.hasBusesPortique,
                  has_roller_portique: lane.hasRollerPortique,
                  laneNumber: lane.laneNumber,
                  hasHighPressure: lane.hasHighPressure,
                  hasBusesPortique: lane.hasBusesPortique,
                  hasRollerPortique: lane.hasRollerPortique,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }))
              : [],
          washLanes:
            stationData.washLanes && Array.isArray(stationData.washLanes)
              ? stationData.washLanes.map((lane: JsonWashLane) => ({
                  id: lane.id || `lane_${lane.laneNumber}`,
                  stationId: params.id,
                  laneNumber: lane.laneNumber,
                  hasHighPressure: lane.hasHighPressure,
                  hasBusesPortique: lane.hasBusesPortique,
                  hasRollerPortique: lane.hasRollerPortique,
                  lane_number: lane.laneNumber,
                  has_high_pressure: lane.hasHighPressure,
                  has_buses_portique: lane.hasBusesPortique,
                  has_roller_portique: lane.hasRollerPortique,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }))
              : [],
        };

        console.log("Station JSON formatée:", formattedStation);
        console.log(
          "washLanes après transformation:",
          formattedStation.washLanes
        );
        console.log(
          "wash_lanes après transformation:",
          formattedStation.wash_lanes
        );
        return NextResponse.json(formattedStation);
      }
    }

    // Définir explicitement le type de sélection pour inclure washLanes
    const station = await (
      prisma.station.findUnique as unknown as (args: {
        where: { id: string };
        include: {
          services: true;
          parkingDetails: true;
          washLanes: true;
          reviews: {
            include: {
              author: {
                select: {
                  id: true;
                  name: true;
                  email: true;
                  image: true;
                };
              };
            };
            orderBy: {
              createdAt: "desc";
            };
          };
          author: {
            select: {
              id: true;
              name: true;
              email: true;
              image: true;
            };
          };
        };
      }) => Promise<StationWithWashLanes>
    )({
      where: {
        id: params.id,
      },
      include: {
        services: true,
        parkingDetails: true,
        washLanes: true,
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log(
      "Résultat de la requête:",
      station ? "Station trouvée" : "Station non trouvée"
    );

    if (!station) {
      console.log("Station non trouvée pour l'ID:", params.id);
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    // Transformer les données pour le front-end
    const stationWithRelations = {
      ...station,
      isDelisle: station.isDelisle ?? false,
      washLanes: station.washLanes || [],
    } as StationWithRelations;

    console.log("isDelisle dans la base de données (brut):", station.isDelisle);
    console.log(
      "Type de isDelisle dans la base de données:",
      typeof station.isDelisle
    );
    console.log("washLanes dans la base de données:", station.washLanes);
    console.log("services dans la base de données:", station.services);
    console.log("portiquePrice:", station.services?.portiquePrice);
    console.log("manualWashPrice:", station.services?.manualWashPrice);
    console.log(
      "isDelisle après transformation:",
      stationWithRelations.isDelisle
    );

    // Ajouter les versions snake_case des propriétés et transformer les services
    const response = {
      ...stationWithRelations,
      isDelisle: station.isDelisle === true,
      phone_number: station.phoneNumber,
      postal_code: station.postalCode,
      services: station.services
        ? {
            ...station.services,
            high_pressure: station.services.highPressure,
            tire_pressure: station.services.tirePressure,
            water_point: station.services.waterPoint,
            waste_water: station.services.wasteWater,
            waste_water_disposal: station.services.wasteWaterDisposal,
            black_water_disposal: station.services.blackWaterDisposal,
            handicap_access: station.services.handicapAccess,
            portique_price: station.services.portiquePrice,
            manual_wash_price: station.services.manualWashPrice,
            portiquePrice: station.services.portiquePrice,
            manualWashPrice: station.services.manualWashPrice,
          }
        : null,
      parking_details: station.parkingDetails
        ? {
            ...station.parkingDetails,
            is_payant: station.parkingDetails.isPayant,
            has_electricity: station.parkingDetails.hasElectricity,
            commerces_proches: station.parkingDetails.commercesProches,
            handicap_access: station.parkingDetails.handicapAccess,
            total_places: station.parkingDetails.totalPlaces,
            has_wifi: station.parkingDetails.hasWifi,
            has_charging_point: station.parkingDetails.hasChargingPoint,
            water_point: station.parkingDetails.waterPoint,
            waste_water: station.parkingDetails.wasteWater,
            waste_water_disposal: station.parkingDetails.wasteWaterDisposal,
            black_water_disposal: station.parkingDetails.blackWaterDisposal,
          }
        : null,
      wash_lanes: Array.isArray(station.washLanes)
        ? (station.washLanes as WashLane[]).map((lane: WashLane) => ({
            id: lane.id,
            stationId: lane.stationId,
            lane_number: lane.laneNumber,
            has_high_pressure: lane.hasHighPressure,
            has_buses_portique: lane.hasBusesPortique,
            has_roller_portique: lane.hasRollerPortique,
            laneNumber: lane.laneNumber,
            hasHighPressure: lane.hasHighPressure,
            hasBusesPortique: lane.hasBusesPortique,
            hasRollerPortique: lane.hasRollerPortique,
            createdAt: lane.createdAt,
            updatedAt: lane.updatedAt,
          }))
        : [],
      washLanes: Array.isArray(station.washLanes)
        ? (station.washLanes as WashLane[]).map((lane: WashLane) => ({
            id: lane.id,
            stationId: lane.stationId,
            laneNumber: lane.laneNumber,
            hasHighPressure: lane.hasHighPressure,
            hasBusesPortique: lane.hasBusesPortique,
            hasRollerPortique: lane.hasRollerPortique,
            lane_number: lane.laneNumber,
            has_high_pressure: lane.hasHighPressure,
            has_buses_portique: lane.hasBusesPortique,
            has_roller_portique: lane.hasRollerPortique,
            createdAt: lane.createdAt,
            updatedAt: lane.updatedAt,
          }))
        : [],
      averageRating:
        stationWithRelations.reviews.length > 0
          ? Number(
              (
                stationWithRelations.reviews.reduce(
                  (acc: number, review) => acc + review.rating,
                  0
                ) / stationWithRelations.reviews.length
              ).toFixed(1)
            )
          : 0,
    };

    console.log("Réponse préparée avec succès");
    console.log("washLanes après transformation:", response.washLanes);
    console.log("wash_lanes après transformation:", response.wash_lanes);
    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la récupération de la station:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de la station",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Début de la mise à jour de la station:", params.id);

    const body = await request.json();
    console.log("Données reçues:", body);

    const {
      description,
      phone_number,
      is_delisle,
      wash_lanes,
      portique_price,
      manual_wash_price,
    } = body;

    if (
      !description &&
      !phone_number &&
      !is_delisle &&
      !wash_lanes &&
      !portique_price &&
      !manual_wash_price
    ) {
      console.log("Aucune donnée valide fournie pour la mise à jour");
      return NextResponse.json(
        { error: "Aucune donnée valide fournie pour la mise à jour" },
        { status: 400 }
      );
    }

    console.log("Mise à jour de la station avec:", {
      description,
      phoneNumber: phone_number,
      isDelisle: is_delisle,
      washLanes: wash_lanes,
      portiquePrice: portique_price,
      manualWashPrice: manual_wash_price,
    });

    // Mise à jour de la station
    const _updatedStation = await prisma.station.update({
      where: {
        id: params.id,
      },
      data: {
        ...(description && { description }),
        ...(phone_number && { phoneNumber: phone_number }),
        ...(is_delisle !== undefined && { isDelisle: is_delisle }),
      },
    });

    // Mise à jour des services si nécessaire
    if (portique_price !== undefined || manual_wash_price !== undefined) {
      // Vérifier si le service existe déjà
      const existingService = await prisma.service.findUnique({
        where: {
          stationId: params.id,
        },
      });

      if (existingService) {
        // Mettre à jour le service existant
        await (
          prisma.service.update as unknown as (args: {
            where: { stationId: string };
            data: {
              portiquePrice?: number;
              manualWashPrice?: number;
            };
          }) => Promise<ServiceWithDelisleProps>
        )({
          where: {
            stationId: params.id,
          },
          data: {
            ...(portique_price !== undefined && {
              portiquePrice: parseFloat(portique_price),
            }),
            ...(manual_wash_price !== undefined && {
              manualWashPrice: parseFloat(manual_wash_price),
            }),
          },
        });
      } else {
        // Créer un nouveau service
        await (
          prisma.service.create as unknown as (args: {
            data: {
              stationId: string;
              portiquePrice?: number;
              manualWashPrice?: number;
            };
          }) => Promise<ServiceWithDelisleProps>
        )({
          data: {
            stationId: params.id,
            ...(portique_price !== undefined && {
              portiquePrice: parseFloat(portique_price),
            }),
            ...(manual_wash_price !== undefined && {
              manualWashPrice: parseFloat(manual_wash_price),
            }),
          },
        });
      }
    }

    // Gestion des pistes de lavage
    if (wash_lanes && Array.isArray(wash_lanes)) {
      // Supprimer les pistes existantes
      await (
        prisma as unknown as {
          washLane: {
            deleteMany: (args: {
              where: { stationId: string };
            }) => Promise<unknown>;
          };
        }
      ).washLane.deleteMany({
        where: {
          stationId: params.id,
        },
      });

      // Créer les nouvelles pistes
      for (const lane of wash_lanes) {
        await (
          prisma as unknown as {
            washLane: {
              create: (args: {
                data: {
                  stationId: string;
                  laneNumber: number;
                  hasHighPressure: boolean;
                  hasBusesPortique: boolean;
                  hasRollerPortique: boolean;
                };
              }) => Promise<WashLane>;
            };
          }
        ).washLane.create({
          data: {
            stationId: params.id,
            laneNumber: lane.lane_number || lane.laneNumber,
            hasHighPressure:
              lane.has_high_pressure || lane.hasHighPressure || false,
            hasBusesPortique:
              lane.has_buses_portique || lane.hasBusesPortique || false,
            hasRollerPortique:
              lane.has_roller_portique || lane.hasRollerPortique || false,
          },
        });
      }
    }

    // Récupérer la station mise à jour avec toutes ses relations
    const updatedStationWithRelations = await (
      prisma.station.findUnique as unknown as (args: {
        where: { id: string };
        include: {
          services: true;
          parkingDetails: true;
          washLanes: true;
        };
      }) => Promise<StationWithWashLanes>
    )({
      where: {
        id: params.id,
      },
      include: {
        services: true,
        parkingDetails: true,
        washLanes: true,
      },
    });

    console.log(
      "Station mise à jour avec succès:",
      updatedStationWithRelations
    );
    return NextResponse.json(updatedStationWithRelations);
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la mise à jour de la station:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour de la station",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
