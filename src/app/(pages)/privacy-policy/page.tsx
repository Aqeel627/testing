import dynamic from "next/dynamic";
const PrivatPolicyPage = dynamic(() => import("@/components/pages/page-private-pokicy"));

const  PrivatePolicyRoute = () => {
  return (
    <>
      <PrivatPolicyPage />
    </>
  );
};

export default PrivatePolicyRoute;
