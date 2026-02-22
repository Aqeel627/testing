import dynamic from "next/dynamic";
const DisResolution = dynamic(() => import("@/components/pages/DisResolution"));

const  DisResolutionRoute  = () => {
  return (
    <>
      <DisResolution />
    </>
  );
};

export default DisResolutionRoute;
