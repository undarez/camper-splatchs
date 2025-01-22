import dynamic from "next/dynamic";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

const HomeClient = dynamic(() => import("@/app/pages/Home/page"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  return <HomeClient />;
}
