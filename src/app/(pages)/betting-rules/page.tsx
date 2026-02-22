import dynamic from "next/dynamic";
const Batting = dynamic(() => import("@/components/pages/Batting"));

const BattingRoute = () => {
  return (
    <>
      <Batting />
    </>
  );
};

export default BattingRoute;
