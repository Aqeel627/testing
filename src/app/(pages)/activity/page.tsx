import dynamic from "next/dynamic";
const Activity = dynamic(() => import("@/components/pages/activity"));

const ActivityRoute = () => {
  return (
    <>
      <Activity />
    </>
  );
};

export default ActivityRoute;
