"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import styles from "./style.module.css";
import "../profit-loss/profit-loss-page/style.css";

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
    <div id="password-history-client.tsx">
      <div className="">
        <div className="flex mx-auto overflow-x-auto scroll-width-none max-w-3xl px-2 pb-[5px] gap-[15px]">
          {/* Open Tab */}
          {tabs.map((item) => (
            <Link
              href={item.link}
              key={item.id}
              className={`${styles["glass-panel"]} ${styles["nav-item"]} ${pathname === item.link && styles.active}`}
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

        <div className="mt-[5px] bh-table-wrap mb-[30px]">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Remark</th>
              </tr>
            </thead>

            {passwordChangeData?.length != 0 && (
              <tbody>
                {passwordChangeData.map((item: any, idx: number) => (
                  <tr key={idx} className="text-center">
                    <td>{formatDateTime(item?.createdAt)}</td>
                    <td>{item?.remark || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
