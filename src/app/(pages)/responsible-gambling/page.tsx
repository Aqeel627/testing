import dynamic from "next/dynamic";
const RasGamRoute = dynamic(() => import("@/components/pages/Res-Gam"));

const  ResRoute = () => {
  return (
    <>
      <RasGamRoute />
    </>
  );
};

export default ResRoute;
