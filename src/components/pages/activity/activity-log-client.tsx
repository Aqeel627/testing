"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatDateTime(value: any) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const h = d.getHours(); // Angular: H
  const min = pad2(d.getMinutes());
  const sec = pad2(d.getSeconds());
  return `${dd}-${mm}-${yyyy} ${h}:${min}:${sec}`;
}

export default function ActivityLogClient() {
  const pathname = usePathname();
  const [activityList, setActivityList] = useState<any[]>([]);

  useEffect(() => {
    fetchData({
      url: CONFIG.activityList,
      payload: { type: "ACTIVITY_LOGS" }, // same to same Angular
      setFn: (data: any) => {
        setActivityList(data?.activityLogs || []); // same to same Angular response mapping
      },
    });
  }, []);

  return (
    <div className="">
      <div className="">
        <ul className="flex justify-start  gap-3 w-full overflow-x-auto scrollbar-hide py-2">
          <li>
            <Link
              href="/activity"
              className={
                pathname === "/activity"
                  ? "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[20px]  border bg-[rgba(var(--palette-primary-mainChannel)_/_14%)] border-[rgba(var(--palette-primary-mainChannel)_/_30%)] text-[var(--primary-color)]"
                  : "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[12px] border bg-[rgba(var(--palette-background-paperChannel)_/_92%)] border-[rgba(var(--palette-grey-500Channel)_/_32%)] text-[var(--palette-text-secondary)] shadow-[0_0_0_1px_rgba(var(--palette-grey-500Channel)_/_18%)] hover:border-[rgba(var(--palette-primary-mainChannel)_/_30%)]"
              }
            >
              Activity Log
            </Link>
          </li>

          <li>
            <Link
              href="/passwordHistory"
              className={
                pathname === "/passwordHistory"
                  ? "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[20px]  border bg-[rgba(var(--palette-primary-mainChannel)_/_14%)] border-[rgba(var(--palette-primary-mainChannel)_/_30%)] text-[var(--primary-color)]"
                  : "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[12px] border bg-[rgba(var(--palette-background-paperChannel)_/_92%)] border-[rgba(var(--palette-grey-500Channel)_/_32%)] text-[var(--palette-text-secondary)] shadow-[0_0_0_1px_rgba(var(--palette-grey-500Channel)_/_18%)] hover:border-[rgba(var(--palette-primary-mainChannel)_/_30%)]"
              }
            >
              Password History
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <h6 className="text-[14px] font-semibold text-[var(--palette-text-primary)]">
          Activity Log
        </h6>
      </div>

      <div className="mt-[5px] overflow-x-auto overflow-y-hidden scrollbar-hide mb-[30px]">
        <table className="w-full border-collapse whitespace-nowrap text-[11px] rounded-[5px] overflow-hidden">
          <thead>
            <tr>
              <th className="text-center font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-white px-2 py-2 rounded-tl-[5px]">
                Login Date &amp; Time
              </th>
              <th className="text-center font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-white px-2 py-2">
                Login Status
              </th>
              <th className="text-center font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-white px-2 py-2">
                IP Address
              </th>
              <th className="text-center font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-white px-2 py-2">
                ISP
              </th>
              <th className="text-center font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-white px-2 py-2 rounded-tr-[5px]">
                City / State / Country
              </th>
            </tr>
          </thead>

          <tbody>
            {activityList?.map((log: any, idx: number) => (
              <tr key={idx} className="bg-[var(--palette-background-paper)]">
                <td className="text-center text-[16px] px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                  {formatDateTime(log?.createdAt)}
                </td>

                <td
                  className={[
                    "text-center text-[16px] px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]",
                    log?.logMessage === "Login Failed" ? "text-red-500" : "",
                    log?.logMessage === "Login Successful"
                      ? "text-green-500"
                      : "",
                  ].join(" ")}
                >
                  {log?.logMessage}
                </td>

                <td className="text-center text-[16px] font-bold px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                  {log?.ip ? log?.ip : "-"}
                </td>

                <td className="text-center text-[16px] px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                  {log?.isp ? log?.isp : "-"}
                </td>

                <td className="text-center text-[16px] font-bold px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                  {log?.city ? log?.city : "-"} / {log?.state ? log?.state : "-"}{" "}
                  / {log?.country ? log?.country : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}