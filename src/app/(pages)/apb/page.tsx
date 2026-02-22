import dynamic from "next/dynamic";
const Accounts = dynamic(() => import("@/components/pages/Accounts"));

const AccountsRoute = () => {
  return (
    <>
      <Accounts />
    </>
  );
};

export default AccountsRoute;
