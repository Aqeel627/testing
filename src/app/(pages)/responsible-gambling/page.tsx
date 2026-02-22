import dynamic from "next/dynamic";
const RasGamRoute = dynamic(() => import("@/components/pages/res-gam"));

const  ResRoute = () => {
  return (
    <>
      <RasGamRoute />
    </>
  );
};

export default ResRoute;
