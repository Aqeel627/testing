import PasswordHistory from "@/components/pages/password-history";
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
