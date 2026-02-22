import dynamic from "next/dynamic";
const StatementPage = dynamic(() => import("@/components/pages/Statement"));

const   statementoute = () => {
  return (
    <>
      <StatementPage />
    </>
  );
};

export default statementoute;
