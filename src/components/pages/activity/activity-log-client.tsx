"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import styles from '@/components/pages/passwordHistory/style.module.css'
import '../profit-loss/profit-loss-page/style.css'
import { cn } from "@/lib/utils";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}


const tabs = [
  {
    id: 1,
    name: "Activity",
    link: "/activity",
  },
  {
    id: 2,
    name: "Password History",
    link: "/password-history",
  },
];

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
    <div id="activityLogClient.tsx">
    <div className="">
      <div className="flex mx-auto overflow-x-auto scroll-width-none max-w-3xl px-2 pb-[5px] gap-[15px]">
        {/* Open Tab */}
        {tabs.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            className={`${styles["glass-panel"]} ${styles["nav-item"]} ${pathname===item.link&&styles.active}`}
            
          >
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <h6 className="text-[14px] font-semibold text-[var(--palette-text-primary)]">
          Activity Log
        </h6>
      </div>

      <div className="mt-[5px] bh-table-wrap mb-[30px]">
        <table className={'bh-table'}>
          <thead>
            <tr>
              <th>
                Login Date &amp; Time
              </th>
              <th>
                Login Status
              </th>
              <th>
                IP Address
              </th>
              <th>
                ISP
              </th>
              <th>
                City / State / Country
              </th>
            </tr>
          </thead>

          <tbody>
            {activityList?.map((log: any, idx: number) => (
              <tr key={idx} className="text-center">
                <td>
                  {formatDateTime(log?.createdAt)}
                </td>

                <td
                  className={[
                    log?.logMessage === "Login Failed" ? "text-red-500" : "",
                    log?.logMessage === "Login Successful"
                      ? "text-green-500"
                      : "",
                  ].join(" ")}
                >
                  {log?.logMessage}
                </td>

                <td>
                  {log?.ip ? log?.ip : "-"}
                </td>

                <td>
                  {log?.isp ? log?.isp : "-"}
                </td>

                <td className="font-bold">
                  {log?.city ? log?.city : "-"} / {log?.state ? log?.state : "-"}{" "}
                  / {log?.country ? log?.country : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}