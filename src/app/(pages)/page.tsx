import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("@/components/pages/home"));

export default function Home() {
  return <HomePage />;
}
