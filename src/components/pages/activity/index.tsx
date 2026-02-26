import dynamic from "next/dynamic";
import ActivityLogClient from "./activity-log-client";
import RequireAuth from "@/lib/require-auth";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const ActivityPage = () => {
  return (
    <>
      <BreadCrumb title="Activities" />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">
        <ActivityLogClient />
      </div>
    </>
  );
};

export default ActivityPage;
