import dynamic from "next/dynamic";
const ExclusionPage = dynamic(() => import("@/components/pages/Exclusion"));

const  ExclusionRoute = () => {
  return (
    <>
      <ExclusionPage />
    </>
  );
};

export default ExclusionRoute;
