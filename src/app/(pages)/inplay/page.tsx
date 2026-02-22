import dynamic from "next/dynamic";
const InplayPage = dynamic(() => import("@/components/pages/inplay"));

const Inplay = () => {
  return (
    <>
      <InplayPage />
    </>
  );
};

export default Inplay;
