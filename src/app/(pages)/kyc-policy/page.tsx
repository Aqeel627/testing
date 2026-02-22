import dynamic from "next/dynamic";
const KPolicy = dynamic(() => import("@/components/pages/kyc-policy"));

const KpolicyRoute = () => {
  return (
    <>
      <KPolicy />
    </>
  );
};

export default KpolicyRoute;
