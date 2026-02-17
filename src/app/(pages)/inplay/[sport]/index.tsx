"use client";

import { useAppStore } from "@/lib/store/store";

const InplayPage = () => {
  const { inplayEvents } = useAppStore();

  console.log(inplayEvents);

  return <div></div>;
};

export default InplayPage;
