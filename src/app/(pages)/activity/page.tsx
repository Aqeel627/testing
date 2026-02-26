import RequireAuth from "@/lib/require-auth";
import dynamic from "next/dynamic";
const Activity = dynamic(() => import("@/components/pages/activity"));

const ActivityRoute = () => {
  return (
    <>
      <RequireAuth>
        <Activity />
      </RequireAuth>
    </>
  );
};

export default ActivityRoute;
