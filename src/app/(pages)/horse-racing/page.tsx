import dynamic from "next/dynamic";
const HorsePage = dynamic(() => import("@/components/pages/horse-racing"));

const HourseRoute = () => {
  return (
    <>
      <HorsePage />
    </>
  );
};

export default HourseRoute;
