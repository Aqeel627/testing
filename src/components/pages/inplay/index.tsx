"use client";

import { useAppStore } from "@/lib/store/store";
import InplaySportNav from "./tabs";
import { useState } from "react";
import BreadCrumb from "@/components/common/bread-crumb";
import InplayMarket from "./inplay-market";

const InplayPage = () => {
  const { inplayEvents } = useAppStore();

  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <BreadCrumb title="Inplay" />
      <InplaySportNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <InplayMarket
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
    </>
  );
};

export default InplayPage;
