import RequireAuth from "@/lib/require-auth";
import dynamic from "next/dynamic";
const SettingComponent = dynamic(() => import("@/components/pages/setting"));

export default function page() {
  return (
    <RequireAuth>
      <SettingComponent></SettingComponent>
    </RequireAuth>
  );
}
