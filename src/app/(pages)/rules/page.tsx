import dynamic from "next/dynamic";
const RulesPage = dynamic(() => import("@/components/pages/rules"));

const  RulesRoute = () => {
  return (
    <>
      <RulesPage />
    </>
  );
};

export default RulesRoute;
