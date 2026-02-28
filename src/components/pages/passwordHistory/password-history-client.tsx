"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import styles from "./style.module.css";

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

export default function PasswordHistoryClient() {
  const pathname = usePathname();
  const [passwordChangeData, setPasswordChangeData] = useState<any[]>([]);

  useEffect(() => {
    fetchData({
      url: CONFIG.activityList,
      payload: { type: "PASSWORD_HISTORY_LOGS" }, // same Angular
      setFn: (data: any) => {
        setPasswordChangeData(data?.passwordHistoryLogs || []); // same mapping
      },
    });
  }, []);

  return (
    <div className="">
      {/* <div className="">
        <ul className="flex justify-start  gap-3 w-full overflow-x-auto scrollbar-hide">
          <li>
            <Link
              href="/activity"
              className={
                pathname === "/activity"
                  ? "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[20px]  border bg-[rgba(var(--palette-primary-mainChannel)_/_14%)] border-(--primary-color) text-(--primary-color)"
                  : "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[12px] border border-(--secondary-text-color) text-(--secondary-text-color) shadow-[0_0_0_1px_rgba(var(--palette-grey-500Channel)_/_18%)] hover:border-[rgba(var(--palette-primary-mainChannel)_/_30%)]"
              }
            >
              Activity Log
            </Link>
          </li>

          <li>
            <Link
              href="/password-history"
              className={
                pathname === "/password-history"
                  ? "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[20px]  border bg-[rgba(var(--palette-primary-mainChannel)_/_14%)] border-(--primary-color) text-(--primary-color)"
                  : "flex items-center justify-center px-6 py-3 rounded-[16px] whitespace-nowrap text-[14px] font-medium transition-all duration-200 backdrop-blur-[12px] border border-(--secondary-text-color) text-(--secondary-text-color) shadow-[0_0_0_1px_rgba(var(--palette-grey-500Channel)_/_18%)] hover:border-[rgba(var(--palette-primary-mainChannel)_/_30%)]"
              }
            >
              Password History
            </Link>
          </li>
        </ul>
      </div> */}

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
          Password History
        </h6>
      </div>

      <div className="mt-[5px] overflow-x-auto overflow-y-hidden scrollbar-hide mb-[30px]">
        <table className={styles['bh-table']}>
          <thead>
            <tr>
              <th>
                Date/Time
              </th>
              <th>
                Remark
              </th>
            </tr>
          </thead>

          {passwordChangeData?.length != 0 && (
            <tbody>
              {passwordChangeData.map((item: any, idx: number) => (
                <tr key={idx} className="bg-[var(--palette-background-paper)]">
                  <td className="text-center text-[16px] px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                    {formatDateTime(item?.createdAt)}
                  </td>
                  <td className="text-center text-[16px] px-2 py-2 border-r border-white border-b border-white text-[var(--palette-text-primary)]">
                    {item?.remark || "NA"}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
