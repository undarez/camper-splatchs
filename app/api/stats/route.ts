import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Récupérer le nombre de stations
    const { count: stationsCount } = await supabase
      .from("stations")
      .select("*", { count: "exact", head: true });

    // Récupérer le nombre d'utilisateurs
    const { count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Récupérer le nombre de parkings
    const { count: parkingsCount } = await supabase
      .from("stations")
      .select("*", { count: "exact", head: true })
      .eq("type", "PARKING");

    return NextResponse.json({
      totalStations: stationsCount || 0,
      totalUsers: usersCount || 0,
      totalParkings: parkingsCount || 0,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return NextResponse.json({
      totalStations: 0,
      totalUsers: 0,
      totalParkings: 0,
    });
  }
}
