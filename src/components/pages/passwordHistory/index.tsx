import dynamic from "next/dynamic";
import PasswordHistoryClient from "./password-history-client";
import RequireAuth from "@/lib/require-auth";

const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const PasswordHistoryPage = () => {
  return (
    <>
      <div id="password-history.tsx">
        <BreadCrumb title="Password History" />
        <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">
          <PasswordHistoryClient />
        </div>
      </div>
    </>
  );
};

export default PasswordHistoryPage;
