import StatementPage from "@/components/pages/statement";
import RequireAuth from "@/lib/require-auth";

const statementoute = () => {
  return (
    <>
      <RequireAuth>
        <StatementPage />
      </RequireAuth>
    </>
  );
};

export default statementoute;
