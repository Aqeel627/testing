import dynamic from "next/dynamic";
const TermCondition = dynamic(() => import("@/components/pages/TermCondition"));

const  TermConditionRoute  = () => {
  return (
    <>
      <TermCondition />
    </>
  );
};

export default TermConditionRoute;
