import dynamic from "next/dynamic";
const AmlPolicy = dynamic(() => import("@/components/pages/aml-policy"));

const AmlPolicyRoute = () => {
  return (
    <>
      <AmlPolicy />
    </>
  );
};

export default AmlPolicyRoute;
