"use client";

import { useAppStore } from "@/lib/store/store";
import { useState } from "react";
import dynamic from "next/dynamic";

const SingleMarket = dynamic(() => import("@/components/common/single-market"));
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));
const InplaySportNav = dynamic(() => import("./tabs"));

const InplayPage = () => {
  const { inplayEvents } = useAppStore();

  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <div id="inplay.tsx">
        <BreadCrumb title="Inplay" />
        <InplaySportNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <SingleMarket
          events={
            activeTab === "All"
              ? inplayEvents?.all
              : activeTab === "Cricket"
                ? inplayEvents[4]
                : activeTab === "Soccer"
                  ? inplayEvents[1]
                  : inplayEvents[2]
          }
        />
      </div>
    </>
  );
};

export default InplayPage;
