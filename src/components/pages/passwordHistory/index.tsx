import dynamic from "next/dynamic";
import PasswordHistoryClient from "./password-history-client";
import RequireAuth from "@/lib/require-auth";

const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

const PasswordHistoryPage = () => {
  return (
    <>
      <BreadCrumb title="Password History" />
      <div className="w-full mx-auto flex flex-col flex-grow scroll-mt-[40px]">
        <RequireAuth>
        <PasswordHistoryClient />
        </RequireAuth>
      </div>
    </>
  );
};

export default PasswordHistoryPage;