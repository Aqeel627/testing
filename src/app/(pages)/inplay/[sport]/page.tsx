import BreadCrumb from "@/components/common/bread-crumb";
import React from "react";
import InplayPage from "./index";

const Inplay = async ({ params }: { params: Promise<{ sport: string }> }) => {
  const { sport } = await params;
  return (
    <>
      <BreadCrumb title="Inplay" />
      <InplayPage />
    </>
  );
};

export default Inplay;
