import PasswordHistory from "@/components/pages/passwordHistory";
import RequireAuth from "@/lib/require-auth";

const PasswordHistoryRoute = () => {
  return (
    <>
      <RequireAuth>
        <PasswordHistory />
      </RequireAuth>
    </>
  );
};

export default PasswordHistoryRoute;
