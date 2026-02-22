import dynamic from "next/dynamic";
const Fairness = dynamic(() => import("@/components/pages/Fairness"));

const  FairnessRoute  = () => {
  return (
    <>
      <Fairness />
    </>
  );
};

export default FairnessRoute;
