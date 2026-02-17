"use client";

import { useAppStore } from "@/lib/store/store";
import React, { useEffect } from "react";

const InplayPage = () => {
  const { allEventsList } = useAppStore();

  const formattedEvents = React.useMemo(() => {
    if (!allEventsList) return null;

    const four = (allEventsList[4] || []).filter(
      (item: any) => item?.inplay === true,
    );

    const two = (allEventsList[2] || []).filter(
      (item: any) => item?.inplay === true,
    );

    const one = (allEventsList[1] || []).filter(
      (item: any) => item?.inplay === true,
    );

    return {
      all: [...four, ...two, ...one],
      4: four,
      2: two,
      1: one,
    };
  }, [allEventsList]);

  console.log(formattedEvents)

  return <div></div>;
};

export default InplayPage;
