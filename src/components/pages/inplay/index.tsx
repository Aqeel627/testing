"use client";

import { useAppStore } from "@/lib/store/store";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";

const SingleMarket = dynamic(() => import("@/components/common/single-market"));
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));
const InplaySportNav = dynamic(() => import("./tabs"));

const InplayPage = () => {
  // const { inplayEvents } = useAppStore();
  const { inplayEvents } = useIndexManagerStore();

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
              : inplayEvents?.[activeTab] || []
          }
        />
      </div>
    </>
  );
};

export default InplayPage;
