import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

config();
const prisma = new PrismaClient();

async function getCoordinates(address) {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
    );

    if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates;
      return {
        latitude: location[1],
        longitude: location[0],
      };
    }
    throw new Error('Aucun résultat trouvé pour cette adresse');
  } catch (error) {
    console.error(`Erreur lors de la géolocalisation de l'adresse: ${address}`, error);
    return null;
  }
}

const stations = [
  {
    name: "JCD lavage",
    address: "2 rue Jean Moulin 02880 Crouy",
    type: "STATION_LAVAGE",
    status: "active",
    description: "Station de lavage spécialisée pour camion, camping-cars avec aire de service complète",
    equipments: [
      "Lavage haute pression",
      
    ],
    averageRating: 4.5,
    images: [
      "https://example.com/millau1.jpg",
      "https://example.com/millau2.jpg"
    ]
  },
  {
    name: "Aire de Service Cap d'Agde",
    address: "Avenue des Sergents, 34300 Cap d'Agde",
    type: "STATION_LAVAGE",
    status: "active",
    description: "Station de lavage et aire de service pour camping-cars en bord de mer",
    equipments: [
      "Lavage haute pression",
      "Vidange eaux grises",
      "Vidange eaux noires",
      "Remplissage eau propre",
      "Électricité",
      "WiFi"
    ],
    openingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    pricing: {
      washing: "6€/15min",
      greyWaterDisposal: "3€",
      blackWaterDisposal: "3€",
      freshWater: "3€/100L"
    },
    averageRating: 4.2
  },
  {
    name: "Station Camping-Car Carcassonne",
    address: "Avenue du Général Leclerc, 11000 Carcassonne",
    type: "STATION_LAVAGE",
    status: "active",
    description: "Station de lavage moderne avec tous les services nécessaires",
    equipments: [
      "Lavage haute pression",
      "Vidange eaux grises",
      "Vidange eaux noires",
      "Remplissage eau propre",
      "Électricité",
      "Aspirateur",
      "Gonflage pneus"
    ],
    openingHours: {
      monday: { open: "07:00", close: "21:00" },
      tuesday: { open: "07:00", close: "21:00" },
      wednesday: { open: "07:00", close: "21:00" },
      thursday: { open: "07:00", close: "21:00" },
      friday: { open: "07:00", close: "21:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "20:00" }
    },
    pricing: {
      washing: "5€/15min",
      greyWaterDisposal: "2€",
      blackWaterDisposal: "2€",
      freshWater: "2€/100L"
    },
    averageRating: 4.7
  },
  {
    name: "Station Test Géolocalisation",
    address: "1 Place du Capitole, 31000 Toulouse",
    type: "STATION_LAVAGE",
    status: "active",
    description: "Station test pour vérifier la géolocalisation automatique",
    equipments: [
      "Lavage haute pression",
      "Vidange eaux grises",
      "Vidange eaux noires",
      "Remplissage eau propre"
    ],
    openingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "09:00", close: "19:00" },
      sunday: { open: "09:00", close: "19:00" }
    },
    pricing: {
      washing: "4€/15min",
      greyWaterDisposal: "2€",
      blackWaterDisposal: "2€",
      freshWater: "2€/100L"
    },
    averageRating: 4.0
  }
];

async function createAdminUser() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('NEXT_PUBLIC_ADMIN_EMAIL non défini');
  }

  console.log('Vérification de l\'utilisateur admin...');
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser) {
    console.log('Création de l\'utilisateur admin...');
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        role: 'ADMIN',
        provider: 'credentials'
      }
    });
    console.log('Utilisateur admin créé');
  } else {
    console.log('Utilisateur admin existe déjà');
  }

  return adminUser;
}

async function importStations() {
  console.log("Début de l'importation des stations...");

  // Créer l'utilisateur admin si nécessaire
  const adminUser = await createAdminUser();

  for (const station of stations) {
    try {
      console.log(`Traitement de la station "${station.name}"...`);

      // Obtenir les coordonnées à partir de l'adresse
      const coordinates = await getCoordinates(station.address);
      if (!coordinates) {
        console.error(`Impossible d'obtenir les coordonnées pour la station "${station.name}"`);
        continue;
      }

      // Création de la station avec Prisma
      const newStation = await prisma.station.create({
        data: {
          name: station.name,
          address: station.address,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          type: station.type || 'STATION_LAVAGE',
          status: 'active',
          hasParking: station.type === 'PARKING',
          images: station.images || [],
          author: {
            connect: {
              id: adminUser.id
            }
          }
        }
      });

      console.log(`Station créée avec l'ID: ${newStation.id}`);

      // Si c'est un parking, ajouter les détails du parking
      if (station.type === 'PARKING' && station.parkingDetails) {
        await prisma.parkingDetails.create({
          data: {
            station: {
              connect: {
                id: newStation.id
              }
            },
            isPayant: station.parkingDetails.isPayant,
            tarif: station.parkingDetails.tarif,
            taxeSejour: station.parkingDetails.taxeSejour,
            hasElectricity: station.parkingDetails.hasElectricity,
            commercesProches: station.parkingDetails.commercesProches,
            handicapAccess: station.parkingDetails.handicapAccess,
            totalPlaces: station.parkingDetails.totalPlaces,
            hasWifi: station.parkingDetails.hasWifi,
            hasChargingPoint: station.parkingDetails.hasChargingPoint,
            waterPoint: station.parkingDetails.waterPoint,
            wasteWater: station.parkingDetails.wasteWater,
            wasteWaterDisposal: station.parkingDetails.wasteWaterDisposal,
            blackWaterDisposal: station.parkingDetails.blackWaterDisposal
          }
        });
      }

      // Si c'est une station de lavage, ajouter les services
      if (station.type === 'STATION_LAVAGE') {
        await prisma.service.create({
          data: {
            station: {
              connect: {
                id: newStation.id
              }
            },
            highPressure: station.equipments.includes('Lavage haute pression') ? 'PASSERELLE' : 'NONE',
            tirePressure: station.equipments.includes('Gonflage pneus'),
            vacuum: station.equipments.includes('Aspirateur'),
            waterPoint: station.equipments.includes('Remplissage eau propre'),
            wasteWater: station.equipments.includes('Vidange eaux grises'),
            wasteWaterDisposal: station.equipments.includes('Vidange eaux grises'),
            blackWaterDisposal: station.equipments.includes('Vidange eaux noires'),
            electricity: station.equipments.includes('Électricité') ? 'AMP_15' : 'NONE',
            paymentMethods: ['CARTE_BANCAIRE', 'ESPECES']
          }
        });
      }

      console.log(`Station "${station.name}" importée avec succès`);
    } catch (error) {
      console.error(`Erreur lors de l'importation de la station "${station.name}":`, error);
    }
  }

  console.log("Importation terminée");
  await prisma.$disconnect();
}

// Exécuter l'importation
importStations().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}); 