import BreadCrumb from "@/components/common/bread-crumb";
import React from "react";

const Inplay = async ({ params }: { params: Promise<{ sport: string }> }) => {
  const { sport } = await params;
  return (
    <>
      <BreadCrumb title="Inplay"/>
    </>
  );
};

export default Inplay;
